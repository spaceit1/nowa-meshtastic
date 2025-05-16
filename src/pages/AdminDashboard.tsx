import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useAccessibility } from "../contexts/AccessibilityContext";
import { useLanguage } from "../i18n/LanguageContext";
import { useModal } from "../hooks/useModal";
import { useDeviceStore } from "@core/stores/deviceStore";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";
import {
    FiUsers,
    FiRadio,
    FiSend,
    FiActivity,
    FiMessageSquare,
    FiList,
    FiDatabase,
    FiPlus,
    FiUser,
    FiInfo
} from "react-icons/fi";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Menu from "../components/ui/Menu";
import { BroadcastPanel } from "../components/panels/BroadcastPanel";
import { UserMessagesPanel } from "../components/panels/UserMessagesPanel";
import { NodesPanel } from "../components/panels/NodesPanel";
import { TemplatesPanel } from "../components/panels/TemplatesPanel";
import { UserTemplatesPanel } from "../components/panels/UserTemplatesPanel";
import { LogsPanel } from "../components/panels/LogsPanel";
import { CategoryPanel } from "../components/panels/CategoryPanel";
import EditTemplateModal from "../components/modals/EditTemplateModal";
import DeleteTemplateModal from "../components/modals/DeleteTemplateModal";
import ViewTemplateModal from "../components/modals/ViewTemplateModal";
import NewDeviceDialog from '../components/Dialog/NewDeviceDialog';
import { Spinner } from "../components/ui/Spinner";

// Mock data types
export interface Node {
    id: string;
    name: (t: (key: string) => string) => string;
    status: string;
    users: number;
    battery: number;
    signal: string;
}

export interface UserRequest {
    id: string;
    sender: string;
    userLocation: string;
    category: string;
    message: string;
    timestamp: string;
    status: string;
    priority: string;
}

export interface Template {
    id: string;
    name: string;
    category: string;
    priority: string;
    usageCount: number;
    content: string;
}

// Mock user help requests
const mockUserRequests: UserRequest[] = [
    {
        id: "req-001",
        sender: "Mieszkaniec Dzielnicy A",
        userLocation: "Dzielnica północna",
        category: "urgentHelp",
        message:
            "Potrzebuję pomocy z ewakuacją. Mam niepełnosprawne dziecko i nie mogę samodzielnie opuścić budynku.",
        timestamp: "2023-06-15T16:45:00Z",
        status: "pending",
        priority: "high",
    },
    {
        id: "req-002",
        sender: "Wolontariusz",
        userLocation: "Dzielnica centralna",
        category: "resources",
        message:
            "W centrum ewakuacyjnym kończy się woda pitna. Potrzebujemy dostaw dla około 50 osób.",
        timestamp: "2023-06-15T17:30:00Z",
        status: "inProgress",
        priority: "medium",
    },
    {
        id: "req-003",
        sender: "Pielęgniarka",
        userLocation: "Dzielnica wschodnia",
        category: "medicalEmergency",
        message:
            "Potrzebujemy insulin i leków na nadciśnienie w szpitalu. Wielu pacjentów nie ma swoich leków.",
        timestamp: "2023-06-15T18:15:00Z",
        status: "pending",
        priority: "critical",
    },
    {
        id: "req-004",
        sender: "Mieszkaniec",
        userLocation: "Strefa szkolna",
        category: "infrastructure",
        message:
            "Uszkodzony most na ulicy Kwiatowej uniemożliwia ewakuację. Nikt nie może się tędy dostać.",
        timestamp: "2023-06-16T09:00:00Z",
        status: "pendingsdad",
        priority: "high",
    },
];

// Zakładamy, że templates jest zdefiniowane wcześniej w kodzie
const templates = []; // Dodaj swoje dane szablonów

const AdminDashboard: React.FC = () => {
    const { t } = useLanguage();
    const [broadcastMessage, setBroadcastMessage] = useState("");
    const [messageCategory, setMessageCategory] = useState("");
    const [messagePriority, setMessagePriority] = useState("medium");
    const [messageTitle, setMessageTitle] = useState("");
    const [targetAudience, setTargetAudience] = useState("all");
    const [userRequests, setUserRequests] = useState(mockUserRequests);
    const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [connectDialogOpen, setConnectDialogOpen] = useState(false);
    const [selectedPort, setSelectedPort] = useState<string>("");
    const [availablePorts, setAvailablePorts] = useState<string[]>([]);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isLoadingDeviceData, setIsLoadingDeviceData] = useState(false);
    const [connectedDevices, setConnectedDevices] = useState<any[]>([]);
    const [pendingMessageCount, setPendingMessageCount] = useState(0);

    // Modal hooks
    const editTemplateModal = useModal();
    const deleteTemplateModal = useModal();
    const viewTemplateModal = useModal();

    const [templateContent, setTemplateContent] = useState<Partial<Template>>({});
    const [editingTemplateContent, setEditingTemplateContent] = useState("");
    const [currentTab, setCurrentTab] = useState(0);

    const { getDevices } = useDeviceStore();
    const devices = useMemo(() => getDevices(), [getDevices]);

    // Sprawdź, czy myNode jest prawidłowo załadowany
    const myNode = devices.length > 0
        ? (devices[0]?.getNode ? devices[0].getNode(devices[0].hardware?.myNodeNum) : null)
        : null;

    // Najpierw sprawdzamy, czy faktycznie mamy załadowany węzeł z danymi
    const isNodeLoaded = myNode && myNode.user && myNode.user.longName;

    // Stan ładowania - pokazujemy loader, gdy urządzenia się łączą lub dane węzła nie są jeszcze dostępne
    const showLoader = isConnecting || (devices.length > 0 && !isNodeLoaded);

    // Monitorowanie stanu ładowania
    useEffect(() => {
        if (devices.length > 0 && !isNodeLoaded) {
            // Urządzenia są, ale dane węzła jeszcze się ładują
            setIsLoadingDeviceData(true);
            console.log("Device data is loading");

            // Dodaj polling, który będzie sprawdzał stan co sekundę
            const intervalId = setInterval(() => {
                // Pobierz aktualne urządzenia
                const updatedDevices = getDevices();
                if (updatedDevices.length > 0) {
                    const device = updatedDevices[0];
                    const node = device?.getNode ? device.getNode(device.hardware?.myNodeNum) : null;
                    const nodeFullyLoaded = node && node.user && node.user.longName;

                    if (nodeFullyLoaded) {
                        // Dane węzła zostały załadowane
                        setIsLoadingDeviceData(false);
                        setIsConnecting(false);
                        console.log("Device data is loaded (from polling)");
                        clearInterval(intervalId);
                    }
                }
            }, 1000); // Sprawdzaj co 1000ms (1 sekunda)

            // Wyczyść interval przy odmontowaniu komponentu
            return () => clearInterval(intervalId);
        } else if (devices.length > 0 && isNodeLoaded) {
            // Urządzenia i dane węzła są załadowane
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
                // Sprawdź czy dane węzła są dostępne
                const device = updatedDevices[0];
                const node = device?.getNode ? device.getNode(device.hardware?.myNodeNum) : null;
                setIsLoadingDeviceData(!node || !node.user || !node.user.longName);
            }

            console.log(updatedDevices);
        }
    }, [connectDialogOpen, getDevices]);

    useEffect(() => {
        if (devices.length === 0) {
            setPendingMessageCount(0);
            return;
        }

        // Calculate pending messages from user requests
        const pendingRequestCount = userRequests.filter(req =>
            req.status.toLowerCase().includes('pending')
        ).length;

        // Set count from pending requests
        setPendingMessageCount(pendingRequestCount);
    }, [devices, userRequests]);

    const stats = {
        activeNodes: devices.length > 0 ? (devices[0]?.getNodesLength ? devices[0].getNodesLength() : 0) : 0,
        onlineUsers: devices.length > 0 ? ((devices[0]?.getNodesLength ? devices[0].getNodesLength() : 1) - 1) : 0,
        pendingMessages: pendingMessageCount,
        batteryLvl: myNode?.deviceMetrics?.batteryLevel ?? 0,
    };

    // Load mockMessages on mount
    useEffect(() => {
        // In a real app, this would be an API call
        console.log("Loading user requests...");
    }, []);

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

        // Jeśli zamknięto dialog bez połączenia, resetujemy stan łączenia
        if (devices.length === 0) {
            setIsConnecting(false);
        }
    };

    const handleBroadcast = () => {
        console.log("Broadcasting message:", broadcastMessage);
    };

    const handleRequestSelect = (requestId: string) => {
        console.log("Selected request:", requestId);
    };

    const handleSaveTemplateContent = () => {
        console.log("Saving template content:", editingTemplateContent);
    };

    const handleSendTemplate = () => {
        console.log("Sending template:", selectedTemplate);
    };

    const handleTemplateFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTemplateContent((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateRequestStatus = (requestId: string, status: string) => {
        console.log("Updating request status:", requestId, status);
    };

    const handleAddNewTemplate = () => {
        console.log("Adding new template");
    };

    const handleViewTemplate = (templateId: string) => {
        console.log("Viewing template:", templateId);
    };

    const handleEditTemplate = (templateId: string) => {
        console.log("Editing template:", templateId);
    };

    const handleDeleteTemplate = (templateId: string) => {
        console.log("Deleting template:", templateId);
    };

    const handleConfirmDelete = (templateId: string) => {
        console.log("Confirming delete:", templateId);
    };

    const refreshPorts = async () => {
        try {
            // Tutaj dodamy logikę pobierania dostępnych portów
            // Na razie symulacja
            setAvailablePorts(["COM1", "COM2", "COM3"]);
        } catch (error) {
            console.error("Błąd podczas pobierania portów:", error);
        }
    };

    useEffect(() => {
        if (connectDialogOpen) {
            refreshPorts();
        }
    }, [connectDialogOpen]);

    const tabs = [
        { id: 'broadcast', icon: FiRadio, label: t('broadcast') },
        { id: 'messages', icon: FiMessageSquare, label: t('messages') },
        { id: 'nodes', icon: FiActivity, label: t('nodes') },
        { id: 'templates', icon: FiList, label: t('templates') },
        { id: 'userTemplates', icon: FiUser, label: t('userTemplates') },
        { id: 'categories', icon: FiList, label: t('categories') },
        { id: 'logs', icon: FiInfo, label: t('logs') }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Menu
                appTitle={t("appTitle")}
                userDashboardText={t("userDashboard")}
                adminDashboardText={t("adminDashboard")}
            />

            <div className="container mx-auto py-6 px-4 max-w-7xl space-y-6">
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
                            <FiList
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
                ) : null}

                <NewDeviceDialog
                    isOpen={connectDialogOpen}
                    onClose={handleCloseDialog}
                    onConnect={handleDeviceConnect}
                    isConnecting={isConnecting}
                />

                {/* Pokaż interfejs urządzenia tylko gdy urządzenia są w pełni załadowane */}
                {devices.length > 0 && !showLoader && (
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
                                icon={FiSend}
                                label={t("pendingMessages")}
                                value={stats.pendingMessages}
                                helpText={t("awaitingDelivery")}
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

                {/* <Alert
                    size="sm"
                    variant="warning"
                    title={t("warningTitleOnAdminDashboard") || "The battery level of the Eastern Hospital node is critically low (23%). Please replace or recharge."}
                /> */}

                {/* Pokaż interfejs zakładek tylko gdy urządzenia są w pełni załadowane */}
                {devices.length > 0 && !showLoader && (
                    <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm">
                        {/* Tab List */}
                        <div className="mb-4 overflow-x-auto flex border-b border-gray-200 dark:border-gray-700 scrollbar-thin">
                            {tabs.map((tab, index) => (
                                <button
                                    key={index}
                                    className={`px-4 py-2 flex items-center whitespace-nowrap ${currentTab === index
                                        ? "border-b-2 border-purple-500 text-purple-600 dark:text-purple-400"
                                        : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                        }`}
                                    onClick={() => setCurrentTab(index)}
                                >
                                    <tab.icon className="mr-2 w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Panels */}
                        <div className="p-4">
                            {currentTab === 0 && (
                                <BroadcastPanel
                                    messageTitle={messageTitle}
                                    setMessageTitle={setMessageTitle}
                                    messageCategory={messageCategory}
                                    setMessageCategory={setMessageCategory}
                                    messagePriority={messagePriority}
                                    setMessagePriority={setMessagePriority}
                                    targetAudience={targetAudience}
                                    setTargetAudience={setTargetAudience}
                                    broadcastMessage={broadcastMessage}
                                    setBroadcastMessage={setBroadcastMessage}
                                    handleBroadcast={handleBroadcast}
                                    categories={categories}
                                />
                            )}

                            {currentTab === 1 && (
                                <UserMessagesPanel
                                    userRequests={userRequests}
                                    selectedRequests={selectedRequests}
                                    handleRequestSelect={handleRequestSelect}
                                    handleUpdateRequestStatus={handleUpdateRequestStatus}
                                    setSelectedRequests={setSelectedRequests}
                                    categories={categories}
                                />
                            )}

                            {currentTab === 2 && (
                                <NodesPanel />
                            )}

                            {currentTab === 3 && (
                                <TemplatesPanel
                                    templates={templates}
                                    handleAddNewTemplate={handleAddNewTemplate}
                                    handleViewTemplate={handleViewTemplate}
                                    handleEditTemplate={handleEditTemplate}
                                    handleDeleteTemplate={handleDeleteTemplate}
                                />
                            )}

                            {currentTab === 4 && (
                                <UserTemplatesPanel />
                            )}

                            {currentTab === 5 && (
                                <CategoryPanel />
                            )}

                            {currentTab === 6 && (
                                <LogsPanel />
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Footer />

            {/* Modals */}
            {selectedTemplate && (
                <>
                    <EditTemplateModal
                        isOpen={editTemplateModal.isOpen}
                        onClose={editTemplateModal.close}
                        template={selectedTemplate}
                        handleTemplateFormChange={handleTemplateFormChange}
                        handleSaveTemplate={handleSaveTemplate}
                        categories={categories}
                    />

                    <DeleteTemplateModal
                        isOpen={deleteTemplateModal.isOpen}
                        onClose={deleteTemplateModal.close}
                        template={selectedTemplate}
                        handleConfirmDelete={handleConfirmDelete}
                    />
                </>
            )}

            <ViewTemplateModal
                isOpen={viewTemplateModal.isOpen}
                onClose={viewTemplateModal.close}
                templateContent={templateContent}
                editingTemplateContent={editingTemplateContent}
                setEditingTemplateContent={setEditingTemplateContent}
                handleSaveTemplateContent={handleSaveTemplateContent}
                handleSendTemplate={handleSendTemplate}
            />
        </div>
    );
};

export default AdminDashboard;