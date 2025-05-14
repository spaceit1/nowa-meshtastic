import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    required?: boolean;
    error?: string;
    variant?: 'default' | 'error';
    helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, variant = 'default', helperText, required = false, className = '', ...props }, ref) => {
        const baseTextareaClasses = "w-full px-4 py-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200";
        const variantClasses = {
            default: "border border-gray-200 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white",
            error: "border border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
        };

        return (
            <div className="space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    <textarea
                        ref={ref}
                        className={`
                            ${baseTextareaClasses}
                            ${variantClasses[variant]}
                            ${error ? variantClasses.error : ''}
                            ${className}
                        `}
                        {...props}
                    />
                    {error && (
                        <div className="absolute top-2 right-2 flex items-center pointer-events-none">
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

Textarea.displayName = 'Textarea';

export default Textarea; 