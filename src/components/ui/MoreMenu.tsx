import { useState, useRef, useEffect } from 'react';
import { FiMoreVertical, FiX } from 'react-icons/fi';

export interface MenuItem {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'default' | 'danger';
}

interface MoreMenuProps {
    items: MenuItem[];
    className?: string;
}

const MoreMenu: React.FC<MoreMenuProps> = ({ items, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={menuRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
                <FiMoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                        {items.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.onClick();
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200
                                    ${item.variant === 'danger' 
                                        ? 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300' 
                                        : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoreMenu; 