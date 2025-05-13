import React from 'react';
import { FiAlertTriangle, FiInfo, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Badge from './Badge';

interface AlertProps {
    variant: 'danger' | 'warning' | 'info' | 'success';
    title?: string;
    description?: string;
    date?: string;
    className?: string;
    children?: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({
    variant,
    title,
    description,
    date,
    className = '',
    children
}) => {
    const variantStyles = {
        danger: {
            container: 'bg-red-700 text-white dark:bg-red-800',
            icon: FiAlertTriangle,
            badgeVariant: 'red' as const,
            lineColor: 'bg-red-400 dark:bg-red-500'
        },
        warning: {
            container: 'bg-yellow-600 text-white dark:bg-yellow-700',
            icon: FiAlertCircle,
            badgeVariant: 'yellow' as const,
            lineColor: 'bg-yellow-400 dark:bg-yellow-500'
        },
        info: {
            container: 'bg-blue-700 text-white dark:bg-blue-800',
            icon: FiInfo,
            badgeVariant: 'blue' as const,
            lineColor: 'bg-blue-400 dark:bg-blue-500'
        },
        success: {
            container: 'bg-green-700 text-white dark:bg-green-800',
            icon: FiCheckCircle,
            badgeVariant: 'emerald' as const,
            lineColor: 'bg-green-400 dark:bg-green-500'
        }
    };

    const styles = variantStyles[variant];
    const Icon = styles.icon;

    return (
        <div className={`w-full p-3 md:p-5 rounded-lg shadow-lg relative overflow-hidden ${styles.container} ${className}`}>
            <div className={`absolute top-0 left-0 right-0 h-1 ${styles.lineColor}`}></div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <Icon className="w-8 h-8 md:w-10 md:h-10 mr-0 sm:mr-4 mb-2 sm:mb-0" />
                <div className="text-center sm:text-left">
                    {(title || date) && (
                        <div className="flex flex-col sm:flex-row mb-1 gap-2 items-center sm:items-start">
                            {title && (
                                <Badge variant={styles.badgeVariant} size="md">
                                    {title}
                                </Badge>
                            )}
                            {date && (
                                <Badge variant={styles.badgeVariant} size="md">
                                    {date}
                                </Badge>
                            )}
                        </div>
                    )}
                    {description && (
                        <p className="font-bold text-md md:text-lg mb-1 leading-relaxed">
                            {description}
                        </p>
                    )}
                    {children && (
                        <div className="text-xs md:text-sm leading-relaxed">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Alert; 