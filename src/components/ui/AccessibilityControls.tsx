import React, { useState, useEffect } from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { MdContrast, MdFormatSize } from "react-icons/md";

type ContrastMode = 'normal' | 'high-contrast' | 'yellow-black';

const AccessibilityControls: React.FC = () => {
    const [contrastMode, setContrastMode] = useState<ContrastMode>('normal');
    const [fontSize, setFontSize] = useState(16);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            // Alt + C dla kontrastu
            if (event.altKey && event.key === 'c') {
                handleContrastChange();
            }
            // Alt + + dla zwiększenia czcionki
            if (event.altKey && event.key === '+') {
                handleFontSizeChange(true);
            }
            // Alt + - dla zmniejszenia czcionki
            if (event.altKey && event.key === '-') {
                handleFontSizeChange(false);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [contrastMode, fontSize]);

    const handleContrastChange = () => {
        const modes: ContrastMode[] = ['normal', 'high-contrast', 'yellow-black'];
        const currentIndex = modes.indexOf(contrastMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        const newMode = modes[nextIndex];
        setContrastMode(newMode);

        // Zastosuj tryb kontrastu poprzez atrybut data-contrast
        document.documentElement.setAttribute('data-contrast', newMode);
    };

    const handleFontSizeChange = (increase: boolean) => {
        const newSize = increase ? fontSize + 2 : fontSize - 2;
        if (newSize >= 12 && newSize <= 24) {
            setFontSize(newSize);
            document.documentElement.style.fontSize = `${newSize}px`;
        }
    };

    return (
        <div className="flex items-center gap-3" role="toolbar" aria-label="Kontrolki dostępności">
            <button
                onClick={handleContrastChange}
                className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label="Zmień kontrast"
                aria-pressed={contrastMode !== 'normal'}
                title="Zmień kontrast (Alt + C)"
            >
                <MdContrast className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            </button>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => handleFontSizeChange(false)}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    aria-label="Zmniejsz rozmiar czcionki"
                    title="Zmniejsz rozmiar czcionki (Alt + -)"
                >
                    <MdFormatSize className="size-4 text-blue-700 dark:text-blue-400" />
                    <FiArrowDown className="size-4 text-blue-700 dark:text-blue-400" />
                </button>
                <button
                    onClick={() => handleFontSizeChange(true)}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    aria-label="Zwiększ rozmiar czcionki"
                    title="Zwiększ rozmiar czcionki (Alt + +)"
                >
                    <MdFormatSize className="size-5 text-blue-700 dark:text-blue-400" />
                    <FiArrowUp className="size-5 text-blue-700 dark:text-blue-400" />
                </button>
            </div>
        </div>
    );
};

export default AccessibilityControls; 