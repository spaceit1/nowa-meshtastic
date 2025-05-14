import React from 'react';
import { FiInbox } from 'react-icons/fi';

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    icon = <FiInbox className="w-12 h-12 text-gray-400" />
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {description}
                </p>
            )}
        </div>
    );
};

export default EmptyState; 