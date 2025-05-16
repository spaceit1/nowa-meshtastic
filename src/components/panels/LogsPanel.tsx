import React, { useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useLogStore } from '@core/stores/logStore';
import { useDeviceStore } from '@core/stores/deviceStore';
import { format } from 'date-fns';

const LogsPanel: React.FC = () => {
    const { t } = useLanguage();
    const { logs } = useLogStore();
    const { getDevices } = useDeviceStore();
    const devices = getDevices();

    useEffect(() => {
        if (devices.length > 0) {
            const device = devices[0];
            const myNode = device.getNode(device.hardware.myNodeNum);
            
            // Dodaj log o połączeniu tylko raz przy montowaniu komponentu
            if (myNode?.user?.longName) {
                const logStore = useLogStore.getState();
                logStore.addLog({
                    timestamp: Date.now(),
                    level: 'INFO',
                    message: `Połączono z urządzeniem: ${myNode.user.longName}`,
                    nodeName: myNode.user.longName
                });
            }
        }
    }, []); // Pusta tablica zależności - efekt wykona się tylko raz przy montowaniu

    const getLogColor = (level: string) => {
        switch (level) {
            case 'ERROR':
                return 'text-red-500';
            case 'WARN':
                return 'text-yellow-500';
            case 'INFO':
                return 'text-blue-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t("logs")}</h2>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md font-mono text-sm bg-gray-50 dark:bg-gray-800 overflow-x-auto h-[400px] overflow-y-scroll">
                {[...logs].reverse().map((log, index) => (
                    <p key={index} className={getLogColor(log.level)}>
                        [{format(log.timestamp, 'yyyy-MM-dd HH:mm:ss')}] {log.level}: {log.message}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default LogsPanel;