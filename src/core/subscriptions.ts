import type { Device } from "@core/stores/deviceStore.ts";
import { MeshDevice, Protobuf } from "@meshtastic/core";
import { type MessageStore, MessageType } from "@core/stores/messageStore/index.ts";
import PacketToMessageDTO from "@core/dto/PacketToMessageDTO.ts";
import NodeInfoFactory from "@core/dto/NodeNumToNodeInfoDTO.ts";
import { useLogStore } from "@core/stores/logStore";

export const subscribeAll = (
  device: Device,
  connection: MeshDevice,
  messageStore: MessageStore,
) => {
  let myNodeNum = 0;
  const logStore = useLogStore.getState();

  connection.events.onDeviceMetadataPacket.subscribe((metadataPacket) => {
    device.addMetadata(metadataPacket.from, metadataPacket.data);
    logStore.addLog({
      timestamp: Date.now(),
      level: 'INFO',
      message: `Otrzymano metadane od węzła ${metadataPacket.from}`,
    });
  });

  connection.events.onRoutingPacket.subscribe((routingPacket) => {
    switch (routingPacket.data.variant.case) {
      case "errorReason": {
        if (
          routingPacket.data.variant.value === Protobuf.Mesh.Routing_Error.NONE
        ) {
          return;
        }
        logStore.addLog({
          timestamp: Date.now(),
          level: 'ERROR',
          message: `Błąd routingu: ${routingPacket.data.variant.value}`,
        });
        break;
      }
      case "routeReply": {
        logStore.addLog({
          timestamp: Date.now(),
          level: 'INFO',
          message: `Odpowiedź routingu: ${routingPacket.data.variant.value}`,
        });
        break;
      }
      case "routeRequest": {
        logStore.addLog({
          timestamp: Date.now(),
          level: 'INFO',
          message: `Żądanie routingu: ${routingPacket.data.variant.value}`,
        });
        break;
      }
    }
  });

  connection.events.onTelemetryPacket.subscribe((telemetryPacket) => {
    const node = device.getNode(telemetryPacket.from);
    if (node?.user?.longName) {
      logStore.addLog({
        timestamp: Date.now(),
        level: 'INFO',
        message: `Otrzymano dane telemetryczne od ${node.user.longName}`,
        nodeName: node.user.longName
      });
    }
  });

  connection.events.onDeviceStatus.subscribe((status) => {
    device.setStatus(status);
    logStore.addLog({
      timestamp: Date.now(),
      level: 'INFO',
      message: `Status urządzenia zmieniony na: ${status}`,
    });
  });

  connection.events.onWaypointPacket.subscribe((waypoint) => {
    const { data } = waypoint;
    device.addWaypoint(data);
  });

  connection.events.onMyNodeInfo.subscribe((nodeInfo) => {
    device.setHardware(nodeInfo);
    messageStore.setNodeNum(nodeInfo.myNodeNum);
    myNodeNum = nodeInfo.myNodeNum;
    logStore.addLog({
      timestamp: Date.now(),
      level: 'INFO',
      message: `Zainicjalizowano urządzenie z ID: ${nodeInfo.myNodeNum}`,
    });
  });

  connection.events.onUserPacket.subscribe((user) => {
    device.addUser(user);
    const node = device.getNode(user.from);
    if (node?.user?.longName) {
      logStore.addLog({
        timestamp: Date.now(),
        level: 'INFO',
        message: `Zaktualizowano informacje o użytkowniku: ${node.user.longName}`,
        nodeName: node.user.longName
      });
    }
  });

  connection.events.onPositionPacket.subscribe((position) => {
    device.addPosition(position);
  });

  connection.events.onNodeInfoPacket.subscribe((nodeInfo) => {
    const nodeWithUser = NodeInfoFactory.ensureDefaultUser(nodeInfo);
    device.addNodeInfo(nodeWithUser);
    if (nodeWithUser.user?.longName) {
      logStore.addLog({
        timestamp: Date.now(),
        level: 'INFO',
        message: `Wykryto nowy węzeł: ${nodeWithUser.user.longName}`,
        nodeName: nodeWithUser.user.longName
      });
    }
  });

  connection.events.onChannelPacket.subscribe((channel) => {
    device.addChannel(channel);
  });
  connection.events.onConfigPacket.subscribe((config) => {
    device.setConfig(config);
  });
  connection.events.onModuleConfigPacket.subscribe((moduleConfig) => {
    device.setModuleConfig(moduleConfig);
  });

  connection.events.onMessagePacket.subscribe((messagePacket) => {
    const dto = new PacketToMessageDTO(messagePacket, myNodeNum);
    const message = dto.toMessage();
    messageStore.saveMessage(message);

    const node = device.getNode(messagePacket.from);
    if (node?.user?.longName) {
      logStore.addLog({
        timestamp: Date.now(),
        level: 'INFO',
        message: `Otrzymano wiadomość od ${node.user.longName}`,
        nodeName: node.user.longName
      });
    }

    if (message.type == MessageType.Direct) {
      if (message.to === myNodeNum) {
        device.incrementUnread(messagePacket.from);
      }
    } else if (message.type == MessageType.Broadcast) {
      if (message.from !== myNodeNum) {
        device.incrementUnread(message.channel);
      }
    }
  });

  connection.events.onTraceRoutePacket.subscribe((traceRoutePacket) => {
    device.addTraceRoute({
      ...traceRoutePacket,
    });
  });

  connection.events.onPendingSettingsChange.subscribe((state) => {
    device.setPendingSettingsChanges(state);
  });

  connection.events.onMeshPacket.subscribe((meshPacket) => {
    device.processPacket({
      from: meshPacket.from,
      snr: meshPacket.rxSnr,
      time: meshPacket.rxTime,
    });
  });

  connection.events.onRoutingPacket.subscribe((routingPacket) => {
    if (routingPacket.data.variant.case === "errorReason") {
      switch (routingPacket.data.variant.value) {
        case Protobuf.Mesh.Routing_Error.MAX_RETRANSMIT:
          logStore.addLog({
            timestamp: Date.now(),
            level: 'ERROR',
            message: `Błąd routingu: Przekroczono maksymalną liczbę retransmisji`,
          });
          break;
        case Protobuf.Mesh.Routing_Error.NO_CHANNEL:
          logStore.addLog({
            timestamp: Date.now(),
            level: 'ERROR',
            message: `Błąd routingu: Brak kanału`,
          });
          device.setNodeError(
            routingPacket.from,
            Protobuf.Mesh.Routing_Error[routingPacket?.data?.variant?.value],
          );
          device.setDialogOpen("refreshKeys", true);
          break;
        case Protobuf.Mesh.Routing_Error.PKI_UNKNOWN_PUBKEY:
          logStore.addLog({
            timestamp: Date.now(),
            level: 'ERROR',
            message: `Błąd routingu: Nieznany klucz publiczny PKI`,
          });
          device.setNodeError(
            routingPacket.from,
            Protobuf.Mesh.Routing_Error[routingPacket?.data?.variant?.value],
          );
          device.setDialogOpen("refreshKeys", true);
          break;
        default: {
          break;
        }
      }
    }
  });
};
