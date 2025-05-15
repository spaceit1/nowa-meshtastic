import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import Button from '../../ui/Button';
import { FiRefreshCw } from 'react-icons/fi';

interface BLEProps {
    closeDialog: () => void;
}

const BLE: React.FC<BLEProps> = ({ closeDialog }) => {
    const { t } = useLanguage();
    const [availableDevices, setAvailableDevices] = useState<BluetoothDevice[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const scanDevices = async () => {
        if (!navigator.bluetooth) {
            setError(t('bleNotSupported'));
            return;
        }

        setIsScanning(true);
        setError(null);

        try {
            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ['battery_service']
            });

            setSelectedDevice(device);
            setAvailableDevices(prev => {
                if (!prev.find(d => d.id === device.id)) {
                    return [...prev, device];
                }
                return prev;
            });
        } catch (err) {
            if (err.name !== 'NotFoundError') {
                setError(t('errorScanningDevices'));
                console.error('Błąd podczas skanowania urządzeń:', err);
            }
        } finally {
            setIsScanning(false);
        }
    };

    const handleConnect = async () => {
        if (!selectedDevice) return;

        setIsConnecting(true);
        setError(null);

        try {
            const server = await selectedDevice.gatt?.connect();
            if (server) {
                closeDialog();
            }
        } catch (err) {
            setError(t('errorConnectingToDevice'));
            console.error('Błąd podczas łączenia z urządzeniem:', err);
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{t('bleConnection')}</h3>
                <Button
                    variant="secondary"
                    icon={FiRefreshCw}
                    onClick={scanDevices}
                    loading={isScanning}
                >
                    {t('scan')}
                </Button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('selectDevice')}
                </label>
                <select
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                    value={selectedDevice?.id || ''}
                    onChange={(e) => {
                        const device = availableDevices.find(d => d.id === e.target.value);
                        setSelectedDevice(device || null);
                    }}
                >
                    <option value="">{t('selectDevice')}</option>
                    {availableDevices.map((device) => (
                        <option key={device.id} value={device.id}>
                            {device.name || `Urządzenie ${device.id}`}
                        </option>
                    ))}
                </select>
            </div>

            <Button
                onClick={handleConnect}
                disabled={!selectedDevice || isConnecting}
                loading={isConnecting}
            >
                {t('connect')}
            </Button>
        </div>
    );
};

export default BLE; 