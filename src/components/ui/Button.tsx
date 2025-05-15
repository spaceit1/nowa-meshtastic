import React from 'react';
import { Link } from 'react-router-dom';
import type { IconType } from 'react-icons';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'default';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    icon?: IconType;
    iconPosition?: 'left' | 'right';
    to?: string;
    onClick?: () => void;
    className?: string;
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
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
    type = 'button',
    disabled = false,
    loading = false,
}) => {
    const baseStyles = 'flex items-center justify-center font-bold rounded-md shadow-md transition-all duration-200';
    
    const variantStyles = {
        primary: 'bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform active:translate-y-0',
        secondary: 'bg-purple-700 text-white hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform active:translate-y-0',
        danger: 'bg-red-700 text-white hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform active:translate-y-0',
        default: 'bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-400',
    };

    const sizeStyles = {
        sm: 'h-8 px-4 text-sm',
        md: 'h-12 px-6 text-base',
        lg: 'h-16 px-8 text-lg',
    };

    const widthStyles = fullWidth ? 'w-full' : '';
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none' : '';
    
    const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${className}`;

    const content = (
        <>
            {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : Icon && iconPosition === 'left' && <Icon className="w-5 h-5 mr-2" />}
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
        <button type={type} onClick={onClick} className={buttonStyles} disabled={disabled || loading}>
            {content}
        </button>
    );
};

export default Button; 