import React from 'react';
import { Link } from 'react-router-dom';
import type { IconType } from 'react-icons';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    icon?: IconType;
    iconPosition?: 'left' | 'right';
    to?: string;
    onClick?: () => void;
    className?: string;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    icon: Icon,
    iconPosition = 'left',
    to,
    onClick,
    className = '',
    children,
}) => {
    const baseStyles = 'flex items-center justify-center font-bold rounded-md shadow-md transition-all duration-200';
    
    const variantStyles = {
        primary: 'bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform active:translate-y-0',
        secondary: 'bg-purple-700 text-white hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform active:translate-y-0',
        danger: 'bg-red-700 text-white hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform active:translate-y-0',
    };

    const sizeStyles = {
        sm: 'h-8 px-4 text-sm',
        md: 'h-12 px-6 text-base',
        lg: 'h-16 px-8 text-lg',
    };

    const widthStyles = fullWidth ? 'w-full' : '';
    
    const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;

    const content = (
        <>
            {Icon && iconPosition === 'left' && <Icon className="w-5 h-5 mr-2" />}
            {children}
            {Icon && iconPosition === 'right' && <Icon className="w-5 h-5 ml-2" />}
        </>
    );

    if (to) {
        return (
            <Link to={to} className={buttonStyles}>
                {content}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={buttonStyles}>
            {content}
        </button>
    );
};

export default Button; 