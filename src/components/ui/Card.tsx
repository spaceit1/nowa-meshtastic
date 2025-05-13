import React from "react";

interface CardProps {
    icon?: React.ElementType;
    title: string;
    description?: string;
    steps?: string[];
    variant?: 'default' | 'feature' | 'instructions';
    className?: string;
    children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ 
    icon: Icon,
    title, 
    description, 
    steps,
    variant = 'default',
    className = '',
    children 
}) => {
    const renderHeader = () => {
        if (!Icon) return null;

        if (variant === 'feature') {
            return (
                <div className="flex flex-col items-center mb-4">
                    <Icon className="w-10 h-10 text-blue-700 dark:text-blue-400 mb-4" />
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                        {title}
                    </h3>
                </div>
            );
        }

        return (
            <div className="flex items-center mb-4">
                <Icon className="w-8 h-8 text-blue-700 dark:text-blue-400 mr-3" />
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {title}
                </h3>
            </div>
        );
    };

    const renderContent = () => {
        if (variant === 'feature') {
            return (
                <p className="text-gray-800 dark:text-gray-200">{description}</p>
            );
        }

        return (
            <>
                {description && (
                    <p className="text-gray-800 dark:text-gray-200 mb-4">
                        {description}
                    </p>
                )}
                {steps && (
                    <div className="space-y-2">
                        {steps.map((step, index) => (
                            <p key={index} className="text-gray-800 dark:text-gray-200">
                                • {step}
                            </p>
                        ))}
                    </div>
                )}
                {children}
            </>
        );
    };

    return (
        <div className={`
            p-5 rounded-lg shadow-md 
            bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700
            ${variant === 'feature' ? 'text-center' : ''}
            ${className}
        `}>
            {renderHeader()}
            {renderContent()}
        </div>
    );
};

export default Card; 