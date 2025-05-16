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
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import type { BadgeVariant } from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import Select from '../ui/Select';

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

    const getPriorityColor = (priority: string): BadgeVariant => {
        switch (priority) {
            case "critical":
                return "red";
            case "high":
                return "orange";
            case "medium":
                return "blue";
            case "low":
                return "green";
            default:
                return "gray";
        }
    };

    const getRequestStatusColor = (status: string): BadgeVariant => {
        switch (status) {
            case "pending":
                return "yellow";
            case "inProgress":
                return "blue";
            case "resolved":
                return "green";
            case "rejected":
                return "red";
            default:
                return "gray";
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
        <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t("userMessages")}</h2>
                <div className="flex space-x-2">
                    <Select
                        options={[
                            { value: 'all', label: t("allMessages") },
                            ...categories.map(category => ({
                                value: category.id,
                                label: category.name
                            }))
                        ]}
                        value="all"
                        onChange={() => {}}
                        placeholder={t("allMessages")}
                    />
                    <Select
                        options={[
                            { value: 'all', label: t("allStatuses") },
                            { value: 'pending', label: t("requestPending") },
                            { value: 'inProgress', label: t("requestInProgress") },
                            { value: 'resolved', label: t("requestResolved") }
                        ]}
                        value="all"
                        onChange={() => {}}
                        placeholder={t("allStatuses")}
                    />
                </div>
            </div>

            {userRequests.length > 0 ? (
                <Card variant="default" className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="space-y-4">
                        {userRequests.map((request) => {
                            const CategoryIcon = getCategoryIcon(request.category);

                            return (
                                <div
                                    key={request.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="space-y-1">
                                        <div className="flex mb-2 items-center">
                                            <input
                                                type="checkbox"
                                                className="mr-3 w-4 h-4"
                                                checked={selectedRequests.includes(request.id)}
                                                onChange={() => handleRequestSelect(request.id)}
                                            />
                                            <Badge variant={getPriorityColor(request.priority)}>
                                                {t(request.priority as any)}
                                            </Badge>
                                            <span className="ml-2 font-bold text-gray-900 dark:text-gray-100">
                                                {request.sender} - {request.userLocation}
                                            </span>
                                        </div>

                                        <div className="flex mb-2 items-center">
                                            <CategoryIcon className="mr-2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            <span className="font-medium text-gray-600 dark:text-gray-400">
                                                {t(request.category)}
                                            </span>
                                        </div>

                                        <p className="text-gray-700 dark:text-gray-300">{request.message}</p>

                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <span>
                                                {new Date(request.timestamp).toLocaleString()}
                                            </span>
                                            <Badge variant={getRequestStatusColor(request.status)} className="ml-3">
                                                {t(getRequestStatusLabel(request.status) as any)}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 items-center md:items-end md:ml-4">
                                        {request.status === "pending" && (
                                            <>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleUpdateRequestStatus(request.id, "inProgress")}
                                                >
                                                    {t("startProcessing")}
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleUpdateRequestStatus(request.id, "resolved")}
                                                >
                                                    {t("markResolved")}
                                                </Button>
                                            </>
                                        )}

                                        {request.status === "inProgress" && (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleUpdateRequestStatus(request.id, "resolved")}
                                            >
                                                {t("markResolved")}
                                            </Button>
                                        )}

                                        <Button
                                            variant="secondary"
                                            size="sm"
                                        >
                                            {t("reply")}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            ) : (
                <EmptyState
                    title={t("noUserMessages")}
                    description={t("noUserMessagesDesc")}
                    icon={<FiMessageSquare className="w-12 h-12 text-gray-400" />}
                />
            )}

            {selectedRequests.length > 0 && (
                <div className="flex justify-between items-center mt-2">
                    <p className="text-gray-700 dark:text-gray-300">
                        {selectedRequests.length}{" "}
                        {selectedRequests.length === 1 ? t("itemSelected") : t("itemsSelected")}
                    </p>
                    <div className="flex space-x-2">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                                selectedRequests.forEach((id) => handleUpdateRequestStatus(id, "inProgress"));
                                setSelectedRequests([]);
                            }}
                        >
                            {t("processSelected")}
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                                selectedRequests.forEach((id) => handleUpdateRequestStatus(id, "resolved"));
                                setSelectedRequests([]);
                            }}
                        >
                            {t("resolveSelected")}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMessagesPanel;