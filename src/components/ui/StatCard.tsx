import React from 'react';
import type { IconType } from 'react-icons';

interface StatCardProps {
    icon: IconType;
    label: string;
    value: string | number;
    helpText: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, helpText }) => {
    return (
        <div className="p-4 shadow-sm rounded-lg bg-blue-50 dark:bg-blue-900">
            <div className="flex items-center mb-1">
                <Icon className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
            </div>
            <div className="text-2xl text-gray-800 dark:text-gray-300 font-bold mb-1">{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{helpText}</div>
        </div>
    );
};

export default StatCard;