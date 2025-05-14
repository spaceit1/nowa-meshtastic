import React, { useState, useEffect } from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { MdContrast, MdFormatSize } from "react-icons/md";
import { useLanguage } from "../../i18n/LanguageContext";
type ContrastMode = 'normal' | 'high-contrast' | 'yellow-black';

const AccessibilityControls: React.FC = () => {
    const { t } = useLanguage();
    const [contrastMode, setContrastMode] = useState<ContrastMode>('normal');
    const [fontSize, setFontSize] = useState(16);
    const [isMac, setIsMac] = useState(false);

    useEffect(() => {
        // Sprawdź czy użytkownik jest na Macu
        setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
    }, []);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            // Dla Windows/Linux: Alt + C
            // Dla Mac: Control + C
            const isContrastShortcut = isMac 
                ? (event.ctrlKey && event.key === 'c')
                : (event.altKey && event.key === 'c');

            // Dla Windows/Linux: Alt + +
            // Dla Mac: Control + +
            const isIncreaseFontShortcut = isMac
                ? (event.ctrlKey && event.key === '+')
                : (event.altKey && event.key === '+');

            // Dla Windows/Linux: Alt + -
            // Dla Mac: Control + -
            const isDecreaseFontShortcut = isMac
                ? (event.ctrlKey && event.key === '-')
                : (event.altKey && event.key === '-');

            if (isContrastShortcut) {
                event.preventDefault(); // Zapobiegaj domyślnej akcji (np. kopiowaniu)
                handleContrastChange();
            }
            if (isIncreaseFontShortcut) {
                event.preventDefault();
                handleFontSizeChange(true);
            }
            if (isDecreaseFontShortcut) {
                event.preventDefault();
                handleFontSizeChange(false);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [contrastMode, fontSize, isMac]);

    const handleContrastChange = () => {
        const modes: ContrastMode[] = ['normal', 'high-contrast', 'yellow-black'];
        const currentIndex = modes.indexOf(contrastMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        const newMode = modes[nextIndex];
        setContrastMode(newMode);

        document.documentElement.setAttribute('data-contrast', newMode);
    };

    const handleFontSizeChange = (increase: boolean) => {
        const newSize = increase ? fontSize + 2 : fontSize - 2;
        if (newSize >= 12 && newSize <= 24) {
            setFontSize(newSize);
            document.documentElement.style.fontSize = `${newSize}px`;
        }
    };

    const getShortcutText = (key: string) => {
        return isMac ? `⌃${key}` : `Alt + ${key}`;
    };

    return (
        <div className="flex items-center gap-3" role="toolbar" aria-label="Kontrolki dostępności">
            <button
                onClick={handleContrastChange}
                className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label={t("contrast")}
                aria-pressed={contrastMode !== 'normal'}
                title={`${t("contrast")} (${getShortcutText('C')})`}
            >
                <MdContrast className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            </button>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => handleFontSizeChange(false)}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    aria-label={t("decreaseFontSize")}
                    title={`${t("decreaseFontSize")} (${getShortcutText('-')})`}
                >
                    <MdFormatSize className="size-4 text-blue-700 dark:text-blue-400" />
                    <FiArrowDown className="size-4 text-blue-700 dark:text-blue-400" />
                </button>
                <button
                    onClick={() => handleFontSizeChange(true)}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    aria-label={t("increaseFontSize")}
                    title={`${t("increaseFontSize")} (${getShortcutText('+')})`}
                >
                    <MdFormatSize className="size-5 text-blue-700 dark:text-blue-400" />
                    <FiArrowUp className="size-5 text-blue-700 dark:text-blue-400" />
                </button>
            </div>
        </div>
    );
};

export default AccessibilityControls; 