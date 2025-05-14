import React, { useState, useEffect } from "react";
import {
    FiUsers,
    FiRadio,
    FiSend,
    FiActivity,
    FiMessageSquare,
    FiList,
    FiDatabase
} from "react-icons/fi";
import { useLanguage } from "../i18n/LanguageContext";
import { useModal } from "../hooks/useModal";

import Menu from "../components/ui/Menu";
import Footer from "../components/ui/Footer";
import StatCard from "../components/ui/StatCard";
import Alert from "../components/ui/Alert";
import BroadcastPanel from "../components/panels/BroadcastPanel";
import UserMessagesPanel from "../components/panels/UserMessagesPanel";
import NodesPanel from "../components/panels/NodesPanel";
import TemplatesPanel from "../components/panels/TemplatesPanel";
import LogsPanel from "../components/panels/LogsPanel";
import EditTemplateModal from "../components/modals/EditTemplateModal";
import DeleteTemplateModal from "../components/modals/DeleteTemplateModal";
import ViewTemplateModal from "../components/modals/ViewTemplateModal";

import { categories } from "../utils/templateData";
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

const mockNodes: Node[] = [
    {
        id: "node-1",
        name: (t) => t("northDistrict") || "North District Hub",
        status: "online",
        users: 24,
        battery: 86,
        signal: "good",
    },
    {
        id: "node-2",
        name: (t) => t("centralDistrict") || "Central Square",
        status: "online",
        users: 18,
        battery: 52,
        signal: "signalMedium",
    },
    {
        id: "node-3",
        name: (t) => t("eastDistrict") || "East Hospital",
        status: "offline",
        users: 0,
        battery: 23,
        signal: "poor",
    },
    {
        id: "node-4",
        name: (t) => t("schoolZone") || "School Zone",
        status: "online",
        users: 12,
        battery: 78,
        signal: "good",
    },
];

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
        status: "pending",
        priority: "high",
    },
];

const mockTemplates: Template[] = [
    {
        id: "tpl-1",
        name: "evacuationAlert",
        category: "evacuation",
        priority: "high",
        usageCount: 14,
        content:
            "PILNE: Wymagana ewakuacja w Twojej okolicy. Udaj się natychmiast do najbliższego schronienia. Zabierz tylko niezbędne rzeczy i postępuj zgodnie z oficjalnymi instrukcjami.",
    },
    {
        id: "tpl-2",
        name: "medicalAidAvailable",
        category: "medicalEmergency",
        priority: "medium",
        usageCount: 8,
        content:
            "Pomoc medyczna jest teraz dostępna w następujących lokalizacjach: Park Centralny (24h), Szpital Wschodni (8-20), oraz jednostki mobilne w dzielnicy północnej.",
    },
    {
        id: "tpl-3",
        name: "powerOutageUpdate",
        category: "infrastructure",
        priority: "low",
        usageCount: 22,
        content:
            "Przerwa w dostawie prądu w sektorach 3, 4 i 7. Przewidywany czas przywrócenia: 18:00. Awaryjne zasilanie dostępne w centrach społecznościowych.",
    },
    {
        id: "tpl-4",
        name: "foodDistribution",
        category: "resources",
        priority: "medium",
        usageCount: 19,
        content:
            "Punkty dystrybucji żywności i wody utworzono w: Główny Plac, Szkoła Centralna i Arena Sportowa. Godziny dystrybucji: 8:00-18:00. Prosimy o zabranie dokumentu tożsamości i pojemników na wodę.",
    },
];

const AdminDashboard: React.FC = () => {
    const { t } = useLanguage();
    const [broadcastMessage, setBroadcastMessage] = useState("");
    const [messageCategory, setMessageCategory] = useState("");
    const [messagePriority, setMessagePriority] = useState("medium");
    const [messageTitle, setMessageTitle] = useState("");
    const [targetAudience, setTargetAudience] = useState("all");
    const [userRequests, setUserRequests] = useState(mockUserRequests);
    const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
    const [templates, setTemplates] = useState(mockTemplates);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    // Modal hooks
    const editTemplateModal = useModal();
    const deleteTemplateModal = useModal();
    const viewTemplateModal = useModal();

    const [templateContent, setTemplateContent] = useState<Partial<Template>>({});
    const [editingTemplateContent, setEditingTemplateContent] = useState("");
    const [currentTab, setCurrentTab] = useState(0);

    // Load mockMessages on mount
    useEffect(() => {
        // In a real app, this would be an API call
        console.log("Loading user requests...");
    }, []);

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

    const stats = {
        activeNodes: 12,
        onlineUsers: 56,
        pendingMessages: 8,
        batteryAvg: 64,
    };

    const tabs = [
        { icon: FiSend, label: t("broadcast") },
        { icon: FiMessageSquare, label: t("userMessages") },
        { icon: FiRadio, label: t("nodes") },
        { icon: FiList, label: t("templates") },
        { icon: FiDatabase, label: t("logs") },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Menu
                appTitle={t("appTitle")}
                userDashboardText={t("userDashboard")}
                adminDashboardText={t("adminDashboard")}
            />


            <div className="container mx-auto py-6 px-4 max-w-7xl space-y-6">
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
                        label={t("batteryAvg")}
                        value={`${stats.batteryAvg}%`}
                        helpText={t("acrossAllNodes")}
                    />

                </div>

                <Alert
                    size="sm"
                    variant="warning"
                    title={t("warningTitleOnAdminDashboard") || "The battery level of the Eastern Hospital node is critically low (23%). Please replace or recharge."}
                />

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
                            <NodesPanel nodes={mockNodes} />
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
                            <LogsPanel />
                        )}
                    </div>
                </div>
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