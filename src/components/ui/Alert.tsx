import React from 'react';
import { FiAlertTriangle, FiInfo, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Badge from './Badge';

interface AlertProps {
    variant: 'danger' | 'warning' | 'info' | 'success';
    size?: 'sm' | 'md' | 'lg';
    badgeTitle?: string;
    title?: string;
    date?: string;
    className?: string;
    children?: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({
    variant,
    size = 'md',
    badgeTitle,
    title,
    date,
    className = '',
    children
}) => {
    const sizeStyles = {
        sm: {
            padding: 'p-2 md:p-3',
            icon: 'w-6 h-6 md:w-8 md:h-8',
            text: 'text-sm md:text-base',
            title: 'text-sm md:text-base',
            children: 'text-xs md:text-sm'
        },
        md: {
            padding: 'p-3 md:p-5',
            icon: 'w-8 h-8 md:w-10 md:h-10',
            text: 'text-md md:text-lg',
            title: 'text-md md:text-lg',
            children: 'text-xs md:text-sm'
        },
        lg: {
            padding: 'p-4 md:p-6',
            icon: 'w-10 h-10 md:w-12 md:h-12',
            text: 'text-lg md:text-xl',
            title: 'text-lg md:text-xl',
            children: 'text-sm md:text-base'
        }
    };

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
    const sizeStyle = sizeStyles[size];
    const Icon = styles.icon;

    return (
        <div className={`w-full ${sizeStyle.padding} rounded-lg shadow-lg relative overflow-hidden ${styles.container} ${className}`}>
            <div className={`absolute top-0 left-0 right-0 h-1 ${styles.lineColor}`}></div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <Icon className={`${sizeStyle.icon} mr-0 sm:mr-4 mb-2 sm:mb-0`} />
                <div className="text-center sm:text-left  self-center">
                    {(badgeTitle || date) && (
                        <div className="flex flex-col sm:flex-row mb-1 gap-2 items-center sm:items-start">
                            {badgeTitle && (
                                <Badge variant={styles.badgeVariant} size={size}>
                                    {badgeTitle}
                                </Badge>
                            )}
                            {date && (
                                <Badge variant={styles.badgeVariant} size={size}>
                                    {date}
                                </Badge>
                            )}
                        </div>
                    )}
                    {title && (
                        <p className={`font-bold ${sizeStyle.title} leading-relaxed`}>
                            {title}
                        </p>
                    )}
                    {children && (
                        <div className={`${sizeStyle.children} leading-relaxed mt-1`}>
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Alert; 