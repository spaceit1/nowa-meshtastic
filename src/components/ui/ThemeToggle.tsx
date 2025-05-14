import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../hooks/useTheme";
import { useLanguage } from "../../i18n/LanguageContext";

const ThemeToggle: React.FC = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { t } = useLanguage();

    return (
        <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            aria-label={isDarkMode ? t("lightMode") : t("darkMode")}
            title={isDarkMode ? t("lightMode") : t("darkMode")}
        >
            {isDarkMode ? (
                <FiSun className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            ) : (
                <FiMoon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            )}
        </button>
    );
};

export default ThemeToggle;