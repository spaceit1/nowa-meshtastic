import React from "react";
import { FiX } from "react-icons/fi";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
                <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                            <FiX size={20} />
                        </button>
                    </div>
                    <div className="p-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dialog; 