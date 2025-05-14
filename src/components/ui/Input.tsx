import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'error';
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, variant = 'default', helperText, className = '', ...props }, ref) => {
        const baseInputClasses = "w-full px-4 py-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200";
        const variantClasses = {
            default: "border border-gray-200 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white",
            error: "border border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
        };

        return (
            <div className="space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute inset-y-1 left-1 pl-3 flex items-center pointer-events-none bg-none">
                            <span className="text-gray-400 dark:text-gray-500">{icon}</span>
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`
                            ${baseInputClasses}
                            ${variantClasses[variant]}
                            ${icon ? 'pl-10' : ''}
                            ${error ? variantClasses.error : ''}
                            ${className}
                        `}
                        {...props}
                    />
                    {error && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <FiAlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                    )}
                </div>
                {(error || helperText) && (
                    <p className={`text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input; 