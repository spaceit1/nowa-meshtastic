import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import type { Node } from '../../pages/AdminDashboard';

interface NodesPanelProps {
    nodes: Node[];
}

const NodesPanel: React.FC<NodesPanelProps> = ({ nodes }) => {
    const { t } = useLanguage();

    const getStatusColor = (status: string): string => {
        switch (status) {
            case "online":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "offline":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
        }
    };

    const getSignalColor = (signal: string): string => {
        switch (signal) {
            case "good":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "signalMedium":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            case "poor":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-medium mb-2">{t("networkNodes")}</h2>

            {nodes.map((node) => (
                <div key={node.id} className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium">
                                {typeof node.name === "function" ? node.name(t) : node.name}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(node.status)}`}>
                                {node.status === "online" ? t("online") : t("offline")}
                            </span>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t("connectedUsers")}</p>
                                <p className="text-md font-medium">{node.users}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t("batteryLevel")}</p>
                                <p className="text-md font-medium">{node.battery}%</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t("signalStrength")}</p>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSignalColor(node.signal)}`}>
                                    {t(node.signal)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NodesPanel;