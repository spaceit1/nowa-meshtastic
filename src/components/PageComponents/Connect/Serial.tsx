import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import Button from '../../ui/Button';
import { FiRefreshCw } from 'react-icons/fi';
import { MeshDevice } from "@meshtastic/core";
import { useAppStore } from "@core/stores/appStore.ts";
import { useDeviceStore } from "@core/stores/deviceStore.ts";
import { subscribeAll } from "@core/subscriptions.ts";
import { randId } from "@core/utils/randId.ts";
import { useMessageStore } from "@core/stores/messageStore";

interface SerialProps {
    closeDialog: () => void;
}

const Serial: React.FC<SerialProps> = ({ closeDialog }) => {
    const { t } = useLanguage();
    const [availablePorts, setAvailablePorts] = useState<SerialPort[]>([]);
    const [selectedPort, setSelectedPort] = useState<SerialPort | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { addDevice } = useDeviceStore();
    const messageStore = useMessageStore();
    const { setSelectedDevice: setSelectedDeviceId } = useAppStore();

    const refreshPorts = async () => {
        try {
            if ('serial' in navigator) {
                const ports = await navigator.serial.getPorts();
                setAvailablePorts(ports);
            } else {
                setError(t('serialNotSupported'));
            }
        } catch (err) {
            setError(t('errorRefreshingPorts'));
            console.error('Błąd podczas odświeżania portów:', err);
        }
    };

    const handleConnect = async () => {
        if (!selectedPort) return;

        setIsConnecting(true);
        setError(null);

        try {
            await selectedPort.open({ baudRate: 115200 });
            
            const id = randId();
            const device = addDevice(id);
            const connection = new MeshDevice(selectedPort, id);
            
            // Konfiguracja i inicjalizacja urządzenia
            await connection.configure();
            
            // Czekamy na pełne załadowanie danych
            await connection.ready;
            
            setSelectedDeviceId(id);
            device.addConnection(connection);
            await subscribeAll(device, connection, messageStore);
            
            closeDialog();
        } catch (err) {
            setError(t('errorConnectingToPort'));
            console.error('Błąd podczas łączenia z portem:', err);
        } finally {
            setIsConnecting(false);
        }
    };

    const requestPort = async () => {
        try {
            const port = await navigator.serial.requestPort();
            setSelectedPort(port);
            setAvailablePorts(prev => [...prev, port]);
        } catch (err) {
            if (err.name !== 'NotFoundError') {
                setError(t('errorRequestingPort'));
                console.error('Błąd podczas wybierania portu:', err);
            }
        }
    };

    useEffect(() => {
        refreshPorts();
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{t('serialConnection')}</h3>
                <Button
                    variant="secondary"
                    icon={FiRefreshCw}
                    onClick={refreshPorts}
                >
                    {t('refresh')}
                </Button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('selectPort')}
                </label>
                <select
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                    value={selectedPort?.getInfo().usbVendorId || ''}
                    onChange={(e) => {
                        const port = availablePorts.find(p => p.getInfo().usbVendorId === e.target.value);
                        setSelectedPort(port || null);
                    }}
                >
                    <option value="">{t('selectPort')}</option>
                    {availablePorts.map((port) => (
                        <option key={port.getInfo().usbVendorId} value={port.getInfo().usbVendorId}>
                            {`Port ${port.getInfo().usbVendorId}`}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex gap-3">
                <Button
                    variant="secondary"
                    onClick={requestPort}
                >
                    {t('selectNewPort')}
                </Button>
                <Button
                    onClick={handleConnect}
                    disabled={!selectedPort || isConnecting}
                    loading={isConnecting}
                >
                    {t('connect')}
                </Button>
            </div>
        </div>
    );
};

export default Serial; 