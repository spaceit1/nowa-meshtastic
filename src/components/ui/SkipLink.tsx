import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

interface SkipLinkProps {
    targetId: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({ targetId }) => {
    const { t } = useLanguage();

    return (
        <a
            href={`#${targetId}`}
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white"
        >
            {t("skipToContent") || "Skip to content"}
        </a>
    );
};

export default SkipLink;