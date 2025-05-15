import { useState } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Alert from '../../ui/Alert';
import { FiGlobe } from 'react-icons/fi';
import { MeshDevice } from "@meshtastic/core";
import { TransportHTTP } from "@meshtastic/transport-http";
import { useAppStore } from "@core/stores/appStore.ts";
import { useDevice, useDeviceStore } from "@core/stores/deviceStore.ts";
import { subscribeAll } from "@core/subscriptions.ts";
import { randId } from "@core/utils/randId.ts";
import { useController, useForm } from "react-hook-form";
import { useMessageStore } from "@core/stores/messageStore";

export interface TabElementProps {
    closeDialog: () => void;
}

interface FormData {
    ip: string;
    tls: boolean;
}

const HTTP = ({ closeDialog }: TabElementProps) => {
    const { t } = useLanguage();
    const [ip, setIp] = useState('meshtastic.local');
    const [tls, setTls] = useState(location.protocol === 'https:');
    const [connectionInProgress, setConnectionInProgress] = useState(false);
    const isURLHTTPS = location.protocol === "https:";

    const { addDevice } = useDeviceStore();
    const { getNode } = useDevice();
    const messageStore = useMessageStore();
    const { setSelectedDevice } = useAppStore();

    const { control, handleSubmit, register } = useForm<FormData>({
        defaultValues: {
            ip: ["client.meshtastic.org", "localhost"].includes(
                globalThis.location.hostname,
            )
                ? "meshtastic.local"
                : globalThis.location.host,
            tls: isURLHTTPS ? true : false,
        },
    });

    useController({ name: "tls", control });

    const [connectionError, setConnectionError] = useState<
        { host: string; secure: boolean } | null
    >(null);

    const onSubmit = handleSubmit(async (data) => {
        setConnectionInProgress(true);
        setConnectionError(null);

        try {
            const id = randId();
            const transport = await TransportHTTP.create(data.ip, data.tls);
            const device = addDevice(id);
            const connection = new MeshDevice(transport, id);

            // Konfiguracja i inicjalizacja urządzenia
            await connection.configure();

            setSelectedDevice(id);
            device.addConnection(connection);
            await subscribeAll(device, connection, messageStore);

            // Czekamy na załadowanie danych urządzenia
            const myNode = getNode(device.hardware.myNodeNum);
            if (!myNode) {
                throw new Error('Nie udało się załadować danych urządzenia');
            }

            closeDialog();
        } catch (error) {
            console.error("Connection error:", error);
            setConnectionError({ host: data.ip, secure: data.tls });
            setConnectionInProgress(false);
        }
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{t('httpConnection')}</h3>
            </div>

            {connectionError && (
                <Alert
                    variant="warning"
                    size="sm"
                    title={t('connectionFailed')}
                >
                    <div className="space-y-1">
                        <p>{t('connectionFailedDescription')}</p>
                        {connectionError.secure && <p>{t('tlsWarning')}</p>}
                        <a
                            href={`${connectionError.secure ? 'https' : 'http'}://${connectionError.host}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline font-medium"
                        >
                            {`${connectionError.secure ? 'https' : 'http'}://${connectionError.host}`}
                        </a>
                        {connectionError.secure && <p>{t('tlsInstructions')}</p>}
                    </div>
                </Alert>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
                <Input
                    label={t('ipAddress')}
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    placeholder="000.000.000.000 / meshtastic.local"
                    icon={<FiGlobe />}
                    button={{
                        icon: <FiGlobe />,
                        onClick: () => { },
                        disabled: true,
                        children: tls ? 'https://' : 'http://'
                    }}
                />

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="tls"
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        checked={tls}
                        onChange={(e) => setTls(e.target.checked)}
                        disabled={location.protocol === 'https:'}
                    />
                    <label htmlFor="tls" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('useHttps')}
                    </label>
                </div>

                <Button
                    type="submit"
                    disabled={!ip || connectionInProgress}
                    loading={connectionInProgress}
                    variant="primary"
                    size="md"
                    fullWidth
                >
                    {connectionInProgress ? t('connecting') : t('connect')}
                </Button>
            </form>
        </div>
    );
};

export default HTTP;