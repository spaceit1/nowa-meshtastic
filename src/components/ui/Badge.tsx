import React from 'react';

export type BadgeVariant = 
    | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
    | 'red' | 'orange' | 'amber' | 'yellow' | 'lime'
    | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky'
    | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia'
    | 'pink' | 'rose';

interface BadgeProps {
    variant?: BadgeVariant;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
    variant = 'blue',
    size = 'md',
    className = '',
    children
}) => {
    const variantStyles = {
        // Neutral colors
        slate: 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100',
        gray: 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100',
        zinc: 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100',
        neutral: 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100',
        stone: 'bg-stone-200 text-stone-900 dark:bg-stone-700 dark:text-stone-100',
        
        // Warm colors
        red: 'bg-red-200 text-red-900 dark:bg-red-700 dark:text-red-100',
        orange: 'bg-orange-200 text-orange-900 dark:bg-orange-700 dark:text-orange-100',
        amber: 'bg-amber-200 text-amber-900 dark:bg-amber-700 dark:text-amber-100',
        yellow: 'bg-yellow-200 text-yellow-900 dark:bg-yellow-700 dark:text-yellow-100',
        lime: 'bg-lime-200 text-lime-900 dark:bg-lime-700 dark:text-lime-100',
        
        // Green colors
        green: 'bg-green-200 text-green-900 dark:bg-green-700 dark:text-green-100',
        emerald: 'bg-emerald-200 text-emerald-900 dark:bg-emerald-700 dark:text-emerald-100',
        teal: 'bg-teal-200 text-teal-900 dark:bg-teal-700 dark:text-teal-100',
        cyan: 'bg-cyan-200 text-cyan-900 dark:bg-cyan-700 dark:text-cyan-100',
        sky: 'bg-sky-200 text-sky-900 dark:bg-sky-700 dark:text-sky-100',
        
        // Blue colors
        blue: 'bg-blue-200 text-blue-900 dark:bg-blue-700 dark:text-blue-100',
        indigo: 'bg-indigo-200 text-indigo-900 dark:bg-indigo-700 dark:text-indigo-100',
        violet: 'bg-violet-200 text-violet-900 dark:bg-violet-700 dark:text-violet-100',
        purple: 'bg-purple-200 text-purple-900 dark:bg-purple-700 dark:text-purple-100',
        fuchsia: 'bg-fuchsia-200 text-fuchsia-900 dark:bg-fuchsia-700 dark:text-fuchsia-100',
        
        // Pink colors
        pink: 'bg-pink-200 text-pink-900 dark:bg-pink-700 dark:text-pink-100',
        rose: 'bg-rose-200 text-rose-900 dark:bg-rose-700 dark:text-rose-100',
    };

    const sizeStyles = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1',
    };

    return (
        <span className={`
            inline-flex items-center font-medium rounded-full
            ${variantStyles[variant]}
            ${sizeStyles[size]}
            ${className}
        `}>
            {children}
        </span>
    );
};

export default Badge; 