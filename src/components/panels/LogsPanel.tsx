import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

const LogsPanel: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-medium mb-2">{t("systemLogs")}</h2>

            <div
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-md font-mono text-sm bg-gray-50 dark:bg-gray-800 overflow-x-auto h-[400px] overflow-y-scroll"
            >
                <p className="text-green-500">[2025-05-11 08:15:23] INFO: System started successfully</p>
                <p className="text-blue-500">[2025-05-11 08:16:45] INFO: Node 'North District Hub' connected</p>
                <p className="text-blue-500">[2025-05-11 08:17:12] INFO: Node 'Central Square' connected</p>
                <p className="text-yellow-500">[2025-05-11 08:18:03] WARN: Node 'East Hospital' battery level low (23%)</p>
                <p className="text-blue-500">[2025-05-11 08:20:41] INFO: User broadcast sent to all nodes</p>
                <p className="text-red-500">[2025-05-11 08:32:17] ERROR: Connection to node 'East Hospital' lost</p>
                <p className="text-blue-500">[2025-05-11 08:45:22] INFO: 24 users connected to 'North District Hub'</p>
                <p className="text-blue-500">[2025-05-11 09:05:11] INFO: Message template 'Evacuation Alert' used</p>
                <p className="text-blue-500">[2025-05-11 09:15:33] INFO: Node 'School Zone' connected</p>
                <p className="text-yellow-500">[2025-05-11 09:20:15] WARN: Network congestion detected in 'Central Square'</p>
            </div>
        </div>
    );
};

export default LogsPanel;