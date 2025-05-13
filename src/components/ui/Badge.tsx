import React from 'react';

type BadgeVariant = 
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
        slate: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100',
        gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
        zinc: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100',
        neutral: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100',
        stone: 'bg-stone-100 text-stone-800 dark:bg-stone-700 dark:text-stone-100',
        
        // Warm colors
        red: 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100',
        orange: 'bg-orange-100 text-orange-800 dark:bg-orange-700 dark:text-orange-100',
        amber: 'bg-amber-100 text-amber-800 dark:bg-amber-700 dark:text-amber-100',
        yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100',
        lime: 'bg-lime-100 text-lime-800 dark:bg-lime-700 dark:text-lime-100',
        
        // Green colors
        green: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100',
        emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-700 dark:text-emerald-100',
        teal: 'bg-teal-100 text-teal-800 dark:bg-teal-700 dark:text-teal-100',
        cyan: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-700 dark:text-cyan-100',
        sky: 'bg-sky-100 text-sky-800 dark:bg-sky-700 dark:text-sky-100',
        
        // Blue colors
        blue: 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100',
        indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-700 dark:text-indigo-100',
        violet: 'bg-violet-100 text-violet-800 dark:bg-violet-700 dark:text-violet-100',
        purple: 'bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-700 dark:text-fuchsia-100',
        
        // Pink colors
        pink: 'bg-pink-100 text-pink-800 dark:bg-pink-700 dark:text-pink-100',
        rose: 'bg-rose-100 text-rose-800 dark:bg-rose-700 dark:text-rose-100',
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