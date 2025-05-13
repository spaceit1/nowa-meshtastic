import React, { useState } from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { MdContrast, MdFormatSize } from "react-icons/md";

type ContrastMode = 'normal' | 'high-contrast' | 'yellow-black';

const AccessibilityControls: React.FC = () => {
    const [contrastMode, setContrastMode] = useState<ContrastMode>('normal');
    const [fontSize, setFontSize] = useState(16);

    const handleContrastChange = () => {
        const modes: ContrastMode[] = ['normal', 'high-contrast', 'yellow-black'];
        const currentIndex = modes.indexOf(contrastMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setContrastMode(modes[nextIndex]);

        // Zastosuj style kontrastu
        const root = document.documentElement;
        switch (modes[nextIndex]) {
            case 'high-contrast':
                root.style.setProperty('--text-color', '#ffffff');
                root.style.setProperty('--bg-color', '#000000');
                break;
            case 'yellow-black':
                root.style.setProperty('--text-color', '#000000');
                root.style.setProperty('--bg-color', '#ffff00');
                break;
            default:
                root.style.removeProperty('--text-color');
                root.style.removeProperty('--bg-color');
        }
    };

    const handleFontSizeChange = (increase: boolean) => {
        const newSize = increase ? fontSize + 2 : fontSize - 2;
        if (newSize >= 12 && newSize <= 24) {
            setFontSize(newSize);
            document.documentElement.style.fontSize = `${newSize}px`;
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleContrastChange}
                className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                aria-label="Zmień kontrast"
            >
                <MdContrast className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            </button>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => handleFontSizeChange(false)}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Zmniejsz rozmiar czcionki"
                >
                    <MdFormatSize className="size-4 text-blue-700 dark:text-blue-400" />
                    <FiArrowDown className="size-4 text-blue-700 dark:text-blue-400" />
                </button>
                <button
                    onClick={() => handleFontSizeChange(true)}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Zwiększ rozmiar czcionki"
                >
                    <MdFormatSize className="size-5 text-blue-700 dark:text-blue-400" />
                    <FiArrowUp className="size-5 text-blue-700 dark:text-blue-400" />
                </button>
            </div>
        </div>
    );
};

export default AccessibilityControls; 