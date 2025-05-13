import React, { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

interface Language {
   code: string;
   name: string;
}

interface LanguageContextType {
   language: string;
   changeLanguage: (lang: string) => void;
   t: (key: string) => string;
   availableLanguages: Language[];
}

interface LanguageProviderProps {
   children: ReactNode;
}

// Przykładowe translations - w prawdziwej aplikacji byłyby one bardziej rozbudowane
const translations: Record<string, Record<string, string>> = {
   en: {
      appTitle: "Emergency Mesh Communication",
      userDashboard: "User Dashboard",
      adminDashboard: "Admin Dashboard",
      // ... inne tłumaczenia
   },
   pl: {
      appTitle: "System Komunikacji Awaryjnej",
      userDashboard: "Panel Użytkownika",
      adminDashboard: "Panel Administratora",
      // ... inne tłumaczenia
   },
   uk: {
      appTitle: "Система Аварійного Зв'язку",
      userDashboard: "Панель Користувача",
      adminDashboard: "Панель Адміністратора",
      // ... inne tłumaczenia
   },
   ru: {
      appTitle: "Система Аварийной Связи",
      userDashboard: "Панель Пользователя",
      adminDashboard: "Панель Администратора",
      // ... inne tłumaczenia
   },
};

const availableLanguages: Language[] = [
   { code: "en", name: "English" },
   { code: "pl", name: "Polski" },
   { code: "uk", name: "Українська" },
   { code: "ru", name: "Русский" },
];

const LanguageContext = createContext<LanguageContextType | undefined>(
   undefined
);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
   children,
}) => {
   // Get browser language or default to English
   const getBrowserLanguage = (): string => {
      const savedLanguage = localStorage.getItem("language");
      if (
         savedLanguage &&
         availableLanguages.some((lang) => lang.code === savedLanguage)
      ) {
         return savedLanguage;
      }

      const browserLang = navigator.language.split("-")[0];
      return availableLanguages.some((lang) => lang.code === browserLang)
         ? browserLang
         : "en";
   };

   const [language, setLanguage] = useState<string>(getBrowserLanguage());

   const changeLanguage = (lang: string) => {
      setLanguage(lang);
      localStorage.setItem("language", lang);
   };

   const t = (key: string): string => {
      return translations[language]?.[key] || translations["en"]?.[key] || key;
   };

   const value = {
      language,
      changeLanguage,
      t,
      availableLanguages,
   };

   return (
      <LanguageContext.Provider value={value}>
         {children}
      </LanguageContext.Provider>
   );
};

export const useLanguage = (): LanguageContextType => {
   const context = useContext(LanguageContext);
   if (context === undefined) {
      throw new Error("useLanguage must be used within a LanguageProvider");
   }
   return context;
};
