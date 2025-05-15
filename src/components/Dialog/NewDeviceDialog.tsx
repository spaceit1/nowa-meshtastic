import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import Modal from '../ui/Modal';
import Serial from '../PageComponents/Connect/Serial';
import BLE from '../PageComponents/Connect/BLE';
import HTTP from '../PageComponents/Connect/HTTP';
import { FiWifi, FiRadio, FiGlobe } from 'react-icons/fi';

interface NewDeviceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConnect: (device: any) => void;
}

const NewDeviceDialog: React.FC<NewDeviceDialogProps> = ({
    isOpen,
    onClose,
    onConnect,
}) => {
    const { t } = useLanguage();
    const [connectionType, setConnectionType] = useState<'serial' | 'ble' | 'http'>('serial');

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('connectNewDevice')}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                    <button
                        className={`p-4 rounded-lg border-2 transition-colors ${
                            connectionType === 'serial'
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800'
                        }`}
                        onClick={() => setConnectionType('serial')}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <FiRadio className="w-6 h-6" />
                            <span className="font-medium">{t('serialConnection')}</span>
                        </div>
                    </button>
                    <button
                        className={`p-4 rounded-lg border-2 transition-colors ${
                            connectionType === 'ble'
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800'
                        }`}
                        onClick={() => setConnectionType('ble')}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <FiWifi className="w-6 h-6" />
                            <span className="font-medium">{t('bleConnection')}</span>
                        </div>
                    </button>
                    <button
                        className={`p-4 rounded-lg border-2 transition-colors ${
                            connectionType === 'http'
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800'
                        }`}
                        onClick={() => setConnectionType('http')}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <FiGlobe className="w-6 h-6" />
                            <span className="font-medium">{t('httpConnection')}</span>
                        </div>
                    </button>
                </div>

                {connectionType === 'serial' ? (
                    <Serial onConnect={onConnect} />
                ) : connectionType === 'ble' ? (
                    <BLE onConnect={onConnect} />
                ) : (
                    <HTTP onConnect={onConnect} />
                )}
            </div>
        </Modal>
    );
};

export default NewDeviceDialog; 