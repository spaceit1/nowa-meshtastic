import React from "react";
import { FiGlobe } from "react-icons/fi";
import { useLanguage } from "../../i18n/LanguageContext.tsx";

const LanguageSelector: React.FC = () => {
    const { language, changeLanguage, availableLanguages } = useLanguage();

    return (
        <div className="relative">
            <button
                className="flex items-center p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Change language"
            >
                <FiGlobe className="w-5 h-5 text-blue-500" />
                <span className="ml-1 text-sm font-medium uppercase">{language}</span>
            </button>
            <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                {availableLanguages.map((lang) => (
                    <button
                        key={lang.code}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${language === lang.code ? "font-bold bg-blue-50 dark:bg-blue-900" : ""
                            }`}
                        onClick={() => changeLanguage(lang.code)}
                    >
                        {lang.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LanguageSelector;