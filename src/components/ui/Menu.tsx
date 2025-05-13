import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiRadio, FiUsers, FiShield, FiMenu, FiX, FiGlobe, FiSun, FiMoon } from "react-icons/fi";
import LanguageSelector from "./LanguageSelector";
import ThemeToggle from "./ThemeToggle";
import { useLanguage } from "../../i18n/LanguageContext";
import { useTheme } from "../../hooks/useTheme";

interface MenuProps {
    appTitle: string;
    userDashboardText: string;
    adminDashboardText: string;
}

const Menu: React.FC<MenuProps> = ({
    appTitle,
    userDashboardText,
    adminDashboardText
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { language, changeLanguage, availableLanguages } = useLanguage();
    const { isDarkMode, toggleTheme } = useTheme();
    const { t } = useLanguage();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="py-4 px-4 bg-blue-100 dark:bg-blue-900 relative">
            <div className="flex justify-between items-center">
                {/* Logo and title */}
                <div className="flex items-center gap-2">
                    <FiRadio className="w-6 h-6 text-blue-700 dark:text-blue-400" />
                    <h1 className="text-md md:text-lg font-bold text-blue-700 dark:text-blue-400">
                        {appTitle}
                    </h1>
                </div>

                {/* Spacer */}
                <div className="flex-1"></div>

                {/* Navigation links - desktop */}
                <div className="hidden md:flex gap-6 items-center mr-6">
                    <Link
                        to="/user"
                        className="font-medium text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:no-underline flex items-center transition-colors"
                    >
                        <FiUsers className="w-4 h-4 mr-2" />
                        {userDashboardText}
                    </Link>

                    <Link
                        to="/admin"
                        className="font-medium text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:no-underline flex items-center transition-colors"
                    >
                        <FiShield className="w-4 h-4 mr-2" />
                        {adminDashboardText}
                    </Link>

                    <LanguageSelector />
                    <ThemeToggle /> 
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={toggleMobileMenu}
                    className="md:hidden p-2 rounded-md text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    aria-label="Toggle mobile menu"
                >
                    {isMobileMenuOpen ? (
                        <FiX className="w-6 h-6" />
                    ) : (
                        <FiMenu className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Mobile menu overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={closeMobileMenu} />
            )}

            {/* Mobile menu panel */}
            <div
                className={`
                    fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 
                    transform transition-transform duration-300 ease-in-out z-50
                    shadow-lg border-l border-gray-200 dark:border-gray-700
                    ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
                    md:hidden
                `}
            >
                <div className="p-4">
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={closeMobileMenu}
                            className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Close mobile menu"
                        >
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="flex flex-col space-y-4">
                        <Link
                            to="/user"
                            onClick={closeMobileMenu}
                            className="flex items-center p-2 rounded-md text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                        >
                            <FiUsers className="w-5 h-5 mr-3" />
                            {userDashboardText}
                        </Link>

                        <Link
                            to="/admin"
                            onClick={closeMobileMenu}
                            className="flex items-center p-2 rounded-md text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors"
                        >
                            <FiShield className="w-5 h-5 mr-3" />
                            {adminDashboardText}
                        </Link>

                        {/* Mobile controls */}
                        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col space-y-4">
                                {/* Language Selector */}
                                <div className="flex items-center">
                                    <select
                                        value={language}
                                        onChange={(e) => changeLanguage(e.target.value)}
                                        className="flex-1 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    >
                                        {availableLanguages.map((lang) => (
                                            <option key={lang.code} value={lang.code}>
                                                {lang.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Theme Toggle */}
                                <div className="flex items-center">
                                    <button
                                        onClick={toggleTheme}
                                        className="flex-1 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        {isDarkMode ? t("darkMode") : t("lightMode")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Menu; 