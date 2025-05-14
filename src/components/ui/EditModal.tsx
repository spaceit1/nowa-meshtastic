import React from 'react';
import Button from './Button';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    title: string;
    children: React.ReactNode;
    isLoading?: boolean;
}

const EditModal: React.FC<EditModalProps> = ({
    isOpen,
    onClose,
    onSave,
    title,
    children,
    isLoading = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        ✕
                    </button>
                </div>
                <div className="mb-6">
                    {children}
                </div>
                <div className="flex justify-end space-x-3">
                    <Button variant="secondary" onClick={onClose}>
                        Anuluj
                    </Button>
                    <Button onClick={onSave} disabled={isLoading}>
                        {isLoading ? 'Zapisywanie...' : 'Zapisz'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditModal; 