import { useState } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Alert from '../../ui/Alert';
import { FiGlobe } from 'react-icons/fi';
import { MeshDevice } from "@meshtastic/core";
import { TransportHTTP } from "@meshtastic/transport-http";
import { useAppStore } from "@core/stores/appStore.ts";
import { useDeviceStore } from "@core/stores/deviceStore.ts";
import { subscribeAll } from "@core/subscriptions.ts";
import { randId } from "@core/utils/randId.ts";
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
    const [ip, setIp] = useState(
        ["client.meshtastic.org", "localhost"].includes(
            window.location.hostname
        )
            ? "meshtastic.local"
            : window.location.host
    );
    const [tls, setTls] = useState(window.location.protocol === 'https:');
    const [connectionInProgress, setConnectionInProgress] = useState(false);
    const isURLHTTPS = window.location.protocol === "https:";

    const { addDevice } = useDeviceStore();
    const messageStore = useMessageStore();
    const { setSelectedDevice } = useAppStore();

    const [connectionError, setConnectionError] = useState<
        { host: string; secure: boolean } | null
    >(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setConnectionInProgress(true);
        setConnectionError(null);

        try {
            console.log(`Connecting to ${tls ? 'https' : 'http'}://${ip}...`);
            
            // Generate a unique ID for this connection
            const id = randId();
            
            // Create the HTTP transport
            const transport = await TransportHTTP.create(ip, tls);
            
            // Add the device to the store first
            const device = addDevice(id);
            
            // Create the Meshtastic device with this transport
            const connection = new MeshDevice(transport, id);
            
            // Configure the device - this starts the connection process
            console.log("Configuring device...");
            connection.configure();
            
            // Set as selected device
            setSelectedDevice(id);
            
            // Add the connection to the device
            device.addConnection(connection);
            
            // Subscribe to all events
            subscribeAll(device, connection, messageStore);
            
            // Close the dialog
            console.log("Connection successful, closing dialog");
            closeDialog();
        } catch (error) {
            console.error("Connection error:", error);
            setConnectionError({ host: ip, secure: tls });
            setConnectionInProgress(false);
        }
    };

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

            <form onSubmit={handleSubmit} className="space-y-4">
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
                        disabled={window.location.protocol === 'https:'}
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