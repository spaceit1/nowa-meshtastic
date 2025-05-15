import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useDevice } from '@core/stores/deviceStore';
import { Protobuf } from '@meshtastic/core';
import { FiLock, FiUnlock } from 'react-icons/fi';

const NodesPanel: React.FC = () => {
    const { t } = useLanguage();
    const { getNodes, hasNodeError } = useDevice();

    const nodes = getNodes((node) => node.user !== undefined);

    const getStatusColor = (lastHeard: number): string => {
        const now = Date.now() / 1000;
        if (lastHeard === 0) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        if (now - lastHeard > 300) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    };

    const getSignalColor = (snr: number): string => {
        const signalStrength = Math.min(Math.max((snr + 10) * 5, 0), 100);
        if (signalStrength > 70) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        if (signalStrength > 30) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    };

    return (
        <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-medium mb-2">{t("nodes")}</h2>

            {nodes.length === 0 ? (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    {t("noNodes")}
                </div>
            ) : (
                nodes.map((node) => (
                    <div key={node.num} className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                        <div className="bg-gray-50 dark:bg-gray-700 p-3">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium">
                                    {node.user?.longName ?? `Node ${node.num}`}
                                </h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(node.lastHeard)}`}>
                                    {node.lastHeard === 0 ? t("offline") : t("online")}
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{t("connection")}</p>
                                    <p className="text-md font-medium">
                                        {node.hopsAway !== undefined
                                            ? node.viaMqtt === false && node.hopsAway === 0
                                                ? t("direct")
                                                : `${node.hopsAway} ${node.hopsAway > 1 ? t("hops") : t("hop")} ${t("away")}`
                                            : "-"}
                                        {node.viaMqtt === true ? `, ${t("viaMqtt")}` : ""}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{t("encryption")}</p>
                                    <div className="text-md font-medium">
                                        {node.user?.publicKey && node.user?.publicKey.length > 0
                                            ? <FiLock className="text-green-600" />
                                            : <FiUnlock className="text-yellow-300" />}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{t("signal")}</p>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSignalColor(node.snr)}`}>
                                        {node.snr}db ({Math.min(Math.max((node.snr + 10) * 5, 0), 100)}%)
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{t("model")}</p>
                                    <p className="text-md font-medium">
                                        {Protobuf.Mesh.HardwareModel[node.user?.hwModel ?? 0]}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default NodesPanel;