import React from "react";
import { useLanguage } from "../../i18n/LanguageContext";

const Footer: React.FC = () => {
    const { t } = useLanguage();

    return (
        <footer className="py-4 px-4 text-center bg-blue-100 dark:bg-blue-900 text-gray-800 dark:text-gray-200 relative">
            <p className="text-sm text-center">{t("footerText")}</p>
            <p 
                className="text-sm text-center"
                dangerouslySetInnerHTML={{ __html: t("footerHackathonInfo") }}
            />
        </footer>
    );
};

export default Footer;