import { useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export const useDocumentLanguage = () => {
    const { language } = useLanguage();

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);
}; 