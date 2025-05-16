import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    FiUsers,
    FiShield,
    FiRadio,
    FiInfo,
    FiArrowRight,
    FiWifiOff,
    FiMessageSquare,
    FiMic,
    FiVolume2,
    FiSend,
    FiActivity,
    FiPlus,
    FiList
} from "react-icons/fi";
import { useLanguage } from "../i18n/LanguageContext";
import { useDeviceStore } from "@core/stores/deviceStore";
import Menu from "../components/ui/Menu";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Footer from "../components/ui/Footer";
import Badge from "../components/ui/Badge";
import type { BadgeVariant } from "../components/ui/Badge";
import StatCard from "../components/ui/StatCard";
import { Spinner } from "../components/ui/Spinner";
import NewDeviceDialog from '../components/Dialog/NewDeviceDialog';
import UserTemplatesPanel from '../components/panels/UserTemplatesPanel';

interface Message {
    id: string;
    content: string;
    timestamp: string;
    isFromAdmin: boolean;
    status: 'read' | 'unread';
}

const UserDashboard: React.FC = () => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);
    const [connectDialogOpen, setConnectDialogOpen] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isLoadingDeviceData, setIsLoadingDeviceData] = useState(false);
    const [connectedDevices, setConnectedDevices] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('messages');

    const { getDevices } = useDeviceStore();
    const devices = useMemo(() => getDevices(), [getDevices]);

    // Sprawdź, czy myNode jest prawidłowo załadowany
    const myNode = devices.length > 0
        ? (devices[0]?.getNode ? devices[0].getNode(devices[0].hardware?.myNodeNum) : null)
        : null;

    // Sprawdź, czy faktycznie mamy załadowany węzeł z danymi
    const isNodeLoaded = myNode && myNode.user && myNode.user.longName;

    // Stan ładowania - pokazujemy loader, gdy urządzenia się łączą lub dane węzła nie są jeszcze dostępne
    const showLoader = isConnecting || (devices.length > 0 && !isNodeLoaded);

    // Monitorowanie stanu ładowania
    useEffect(() => {
        if (devices.length > 0 && !isNodeLoaded) {
            setIsLoadingDeviceData(true);
            console.log("Device data is loading");

            const intervalId = setInterval(() => {
                const updatedDevices = getDevices();
                if (updatedDevices.length > 0) {
                    const device = updatedDevices[0];
                    const node = device?.getNode ? device.getNode(device.hardware?.myNodeNum) : null;
                    const nodeFullyLoaded = node && node.user && node.user.longName;

                    if (nodeFullyLoaded) {
                        setIsLoadingDeviceData(false);
                        setIsConnecting(false);
                        console.log("Device data is loaded (from polling)");
                        clearInterval(intervalId);
                    }
                }
            }, 1000);

            return () => clearInterval(intervalId);
        } else if (devices.length > 0 && isNodeLoaded) {
            setIsLoadingDeviceData(false);
            setIsConnecting(false);
            console.log("Device data is loaded");
        }
    }, [devices, isNodeLoaded, getDevices]);

    // Sprawdź zmiany w urządzeniach po zamknięciu dialogu
    useEffect(() => {
        if (!connectDialogOpen) {
            const updatedDevices = getDevices();
            setConnectedDevices(updatedDevices);

            if (updatedDevices.length > 0) {
                const device = updatedDevices[0];
                const node = device?.getNode ? device.getNode(device.hardware?.myNodeNum) : null;
                setIsLoadingDeviceData(!node || !node.user || !node.user.longName);
            }
        }
    }, [connectDialogOpen, getDevices]);

    const stats = {
        activeNodes: devices.length > 0 ? (devices[0]?.getNodesLength ? devices[0].getNodesLength() : 0) : 0,
        onlineUsers: devices.length > 0 ? ((devices[0]?.getNodesLength ? devices[0].getNodesLength() : 1) - 1) : 0,
        pendingMessages: messages.filter(m => m.status === 'unread').length,
        batteryLvl: myNode?.deviceMetrics?.batteryLevel ?? 0,
    };

    const handleStartConnect = () => {
        console.log("Starting connect");
        setIsConnecting(true);
        setConnectDialogOpen(true);
    };

    const handleDeviceConnect = (device: any) => {
        console.log("Device connected");
        setConnectedDevices(prev => [...prev, device]);
        setIsLoadingDeviceData(true);
        setConnectDialogOpen(false);
    };

    const handleCloseDialog = () => {
        console.log("Dialog closed");
        setConnectDialogOpen(false);

        if (devices.length === 0) {
            setIsConnecting(false);
        }
    };

    useEffect(() => {
        // Inicjalizacja Web Speech API
        if ('webkitSpeechRecognition' in window) {
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'pl-PL';

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setNewMessage(transcript);
                setIsRecording(false);
            };

            recognition.onerror = (event: any) => {
                console.error('Błąd rozpoznawania mowy:', event.error);
                setIsRecording(false);
            };

            setRecognition(recognition);
        }

        // Symulacja pobrania wiadomości
        setMessages([
            {
                id: '1',
                content: 'Witaj w systemie! Jak możemy Ci pomóc?',
                timestamp: new Date().toISOString(),
                isFromAdmin: true,
                status: 'unread'
            }
        ]);
    }, []);

    const startRecording = () => {
        if (recognition) {
            setIsRecording(true);
            recognition.start();
        }
    };

    const stopRecording = () => {
        if (recognition) {
            recognition.stop();
            setIsRecording(false);
        }
    };

    const speakMessage = (message: string) => {
        if ('speechSynthesis' in window) {
            setIsSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'pl-PL';
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message: Message = {
                id: Date.now().toString(),
                content: newMessage,
                timestamp: new Date().toISOString(),
                isFromAdmin: false,
                status: 'unread'
            };
            setMessages(prev => [...prev, message]);
            setNewMessage("");
        }
    };

    const tabs = [
        { id: 'messages', icon: FiMessageSquare, label: t('messages') },
        { id: 'nodes', icon: FiRadio, label: t('nodes') }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Menu
                appTitle={t("appTitle")}
                userDashboardText={t("userDashboard")}
                adminDashboardText={t("adminDashboard")}
            />

            <div className="container mx-auto py-6 px-4 max-w-7xl space-y-6">
                {/* Navigation Tabs */}
                <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Pokaż kartę ładowania/informacyjną gdy nie ma urządzeń lub są w trakcie ładowania */}
                {showLoader ? (
                    <Card>
                        <div className="m-auto flex flex-col gap-3 text-center p-4">
                            <div className="flex justify-center items-center py-4">
                                <Spinner />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {isLoadingDeviceData
                                    ? (t('loadingDeviceData') || 'Loading device data...')
                                    : (t('connecting') || 'Connecting to device...')}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {isLoadingDeviceData
                                    ? (t('configuringDevice') || 'Configuring device, please wait...')
                                    : (t('pleaseWait') || 'Please wait, establishing connection...')}
                            </p>
                        </div>
                    </Card>
                ) : devices.length === 0 ? (
                    <Card>
                        <div className="m-auto flex flex-col gap-3 text-center p-4">
                            <FiRadio
                                size={48}
                                className="mx-auto text-gray-400 dark:text-gray-500"
                            />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {t('noDevices')}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t('connectAtLeastOneDevice')}
                            </p>
                            <div className="flex justify-center mt-4">
                                <Button onClick={handleStartConnect} icon={FiPlus}>
                                    {t('newConnection')}
                                </Button>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <>
                        {activeTab === 'messages' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Panel główny */}
                                <div className="lg:col-span-2">
                                    <Card variant="default" className="bg-white dark:bg-gray-800">
                                        <div className="p-4">
                                            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                                                {t("messages")}
                                            </h2>
                                            <div className="space-y-4">
                                                {messages.map((message) => (
                                                    <div
                                                        key={message.id}
                                                        className={`p-4 rounded-lg ${
                                                            message.isFromAdmin
                                                                ? "bg-blue-50 dark:bg-blue-900/20"
                                                                : "bg-gray-50 dark:bg-gray-700/50"
                                                        }`}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <Badge
                                                                variant={message.isFromAdmin ? "blue" : "green"}
                                                            >
                                                                {message.isFromAdmin ? t("admin") : t("you")}
                                                            </Badge>
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                {new Date(message.timestamp).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                                                            {message.content}
                                                        </p>
                                                        {message.isFromAdmin && (
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                onClick={() => speakMessage(message.content)}
                                                                disabled={isSpeaking}
                                                            >
                                                                <FiVolume2 className="mr-2" />
                                                                {isSpeaking ? t("speaking") : t("readAloud")}
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Panel boczny */}
                                <div className="lg:col-span-1">
                                    <Card variant="default" className="bg-white dark:bg-gray-800">
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                                                {t("sendMessage")}
                                            </h3>
                                            <div className="space-y-4">
                                                <textarea
                                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                    rows={4}
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    placeholder={t("typeMessage")}
                                                />
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={isRecording ? stopRecording : startRecording}
                                                    >
                                                        <FiMic className={`mr-2 ${isRecording ? "text-red-500" : ""}`} />
                                                        {isRecording ? t("stopRecording") : t("startRecording")}
                                                    </Button>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={handleSendMessage}
                                                        disabled={!newMessage.trim()}
                                                    >
                                                        <FiSend className="mr-2" />
                                                        {t("send")}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        )}
                        {activeTab === 'nodes' && (
                            <>
                                <div className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                                    <FiRadio className="w-5 h-5" />
                                    {devices.map((device) => {
                                        const deviceNode = device.getNode(device.hardware.myNodeNum);
                                        return (
                                            <div key={device.id}>
                                                {t('connected')}: {deviceNode?.user?.longName ?? "UNK"}
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <StatCard
                                        icon={FiRadio}
                                        label={t("activeNodes")}
                                        value={stats.activeNodes}
                                        helpText={t("totalConnectedNodes")}
                                    />
                                    <StatCard
                                        icon={FiUsers}
                                        label={t("onlineUsers")}
                                        value={stats.onlineUsers}
                                        helpText={t("connectedToNetwork")}
                                    />
                                    <StatCard
                                        icon={FiMessageSquare}
                                        label={t("pendingMessages")}
                                        value={stats.pendingMessages}
                                        helpText={t("unreadMessages")}
                                    />
                                    <StatCard
                                        icon={FiActivity}
                                        label={t("batteryLvl")}
                                        value={`${stats.batteryLvl}%`}
                                        helpText={t("batteryLvlHelp")}
                                    />
                                </div>
                            </>
                        )}
                    </>
                )}

                <NewDeviceDialog
                    isOpen={connectDialogOpen}
                    onClose={handleCloseDialog}
                    onConnect={handleDeviceConnect}
                    isConnecting={isConnecting}
                />
            </div>

            <Footer />
        </div>
    );
};

export default UserDashboard;