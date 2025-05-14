import React from 'react';
import {
    FiMessageSquare,
    FiAlertTriangle,
    FiActivity,
    FiUsers,
    FiRadio,
    FiDatabase
} from 'react-icons/fi';
import { useLanguage } from '../../i18n/LanguageContext';
import type { UserRequest } from '../../pages/AdminDashboard';

interface UserMessagesPanelProps {
    userRequests: UserRequest[];
    selectedRequests: string[];
    handleRequestSelect: (requestId: string) => void;
    handleUpdateRequestStatus: (requestId: string, newStatus: string) => void;
    setSelectedRequests: React.Dispatch<React.SetStateAction<string[]>>;
    categories: Array<{ id: string; name: string }>;
}

const UserMessagesPanel: React.FC<UserMessagesPanelProps> = ({
    userRequests,
    selectedRequests,
    handleRequestSelect,
    handleUpdateRequestStatus,
    setSelectedRequests,
    categories
}) => {
    const { t } = useLanguage();

    const getPriorityColor = (priority: string): string => {
        switch (priority) {
            case "critical":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            case "high":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
            case "medium":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
            case "low":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
        }
    };

    const getRequestStatusColor = (status: string): string => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            case "inProgress":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
            case "resolved":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "rejected":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
        }
    };

    const getRequestStatusLabel = (status: string): string => {
        switch (status) {
            case "pending":
                return t("requestPending") || "Pending";
            case "inProgress":
                return t("requestInProgress") || "In Progress";
            case "resolved":
                return t("requestResolved") || "Resolved";
            case "rejected":
                return t("requestRejected") || "Rejected";
            default:
                return status;
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "urgentHelp":
                return FiAlertTriangle;
            case "medicalEmergency":
                return FiActivity;
            case "evacuation":
                return FiUsers;
            case "resources":
                return FiDatabase;
            case "infrastructure":
                return FiRadio;
            default:
                return FiMessageSquare;
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">{t("userMessages")}</h2>
                <div className="flex space-x-2">
                    <select
                        className="p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                        <option value="all">{t("allMessages")}</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <select
                        className="p-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                        <option value="all">{t("allStatuses")}</option>
                        <option value="pending">{t("requestPending")}</option>
                        <option value="inProgress">{t("requestInProgress")}</option>
                        <option value="resolved">{t("requestResolved")}</option>
                    </select>
                </div>
            </div>

            {userRequests.length > 0 ? (
                <div className="flex flex-col space-y-4">
                    {userRequests.map((request) => {
                        const CategoryIcon = getCategoryIcon(request.category);

                        return (
                            <div
                                key={request.id}
                                className="border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                            >
                                <div className="p-4">
                                    <div className="flex flex-col md:flex-row md:justify-between">
                                        <div className="flex-1 mb-4 md:mb-0">
                                            <div className="flex mb-2 items-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-3 w-4 h-4"
                                                    checked={selectedRequests.includes(request.id)}
                                                    onChange={() => handleRequestSelect(request.id)}
                                                />
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full mr-2 ${getPriorityColor(request.priority)}`}>
                                                    {t(request.priority)}
                                                </span>
                                                <span className="font-bold">
                                                    {request.sender} - {request.userLocation}
                                                </span>
                                            </div>

                                            <div className="flex mb-2 items-center">
                                                <CategoryIcon className={`mr-2 w-4 h-4 text-${getPriorityColor(request.priority).split(' ')[1].replace('text-', '')}`} />
                                                <span className="font-medium text-gray-600 dark:text-gray-400">
                                                    {t(request.category)}
                                                </span>
                                            </div>

                                            <p className="mb-3">{request.message}</p>

                                            <div className="flex items-center text-sm text-gray-500">
                                                <span>
                                                    {new Date(request.timestamp).toLocaleString()}
                                                </span>
                                                <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getRequestStatusColor(request.status)}`}>
                                                    {getRequestStatusLabel(request.status)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 items-center md:items-end md:ml-4">
                                            {request.status === "pending" && (
                                                <>
                                                    <button
                                                        className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                                                        onClick={() => handleUpdateRequestStatus(request.id, "inProgress")}
                                                    >
                                                        {t("startProcessing")}
                                                    </button>
                                                    <button
                                                        className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md"
                                                        onClick={() => handleUpdateRequestStatus(request.id, "resolved")}
                                                    >
                                                        {t("markResolved")}
                                                    </button>
                                                </>
                                            )}

                                            {request.status === "inProgress" && (
                                                <button
                                                    className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md"
                                                    onClick={() => handleUpdateRequestStatus(request.id, "resolved")}
                                                >
                                                    {t("markResolved")}
                                                </button>
                                            )}

                                            <button
                                                className="px-3 py-1 text-sm border border-purple-500 text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-md"
                                            >
                                                {t("reply")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="p-6 text-center border border-gray-200 dark:border-gray-700 rounded-md">
                    <FiMessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-2">
                        {t("noUserMessages") || "No User Messages"}
                    </h3>
                    <p>
                        {t("noUserMessagesDesc") || "There are no user messages or help requests at this time."}
                    </p>
                </div>
            )}

            {selectedRequests.length > 0 && (
                <div className="flex justify-between items-center mt-2">
                    <p>
                        {selectedRequests.length}{" "}
                        {selectedRequests.length === 1 ? t("itemSelected") : t("itemsSelected")}
                    </p>
                    <div className="flex space-x-2">
                        <button
                            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                            onClick={() => {
                                selectedRequests.forEach((id) => handleUpdateRequestStatus(id, "inProgress"));
                                setSelectedRequests([]);
                            }}
                        >
                            {t("processSelected")}
                        </button>
                        <button
                            className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md"
                            onClick={() => {
                                selectedRequests.forEach((id) => handleUpdateRequestStatus(id, "resolved"));
                                setSelectedRequests([]);
                            }}
                        >
                            {t("resolveSelected")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMessagesPanel;