import React from "react";
import { FiWifiOff } from "react-icons/fi";

interface OfflineInstructionsCardProps {
    title: string;
    description: string;
    steps: string[];
}

const OfflineInstructionsCard: React.FC<OfflineInstructionsCardProps> = ({ 
    title, 
    description, 
    steps 
}) => {
    return (
        <div className="p-5 rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
                <FiWifiOff className="w-8 h-8 text-blue-700 dark:text-blue-400 mr-3" />
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {title}
                </h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 mb-4">
                {description}
            </p>
            <div className="space-y-2">
                {steps.map((step, index) => (
                    <p key={index} className="text-gray-800 dark:text-gray-200">
                        • {step}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default OfflineInstructionsCard; 