import { useState, useEffect } from "react";

interface UseThemeReturn {
   isDarkMode: boolean;
   toggleTheme: () => void;
}

export const useTheme = (): UseThemeReturn => {
   // Check if user prefers dark mode or has previously set preference
   const getUserPreference = (): boolean => {
      const savedPreference = localStorage.getItem("darkMode");
      if (savedPreference !== null) {
         return savedPreference === "true";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
   };

   const [isDarkMode, setIsDarkMode] = useState<boolean>(getUserPreference());

   // Apply theme class to document
   useEffect(() => {
      if (isDarkMode) {
         document.documentElement.classList.add("dark");
      } else {
         document.documentElement.classList.remove("dark");
      }
      // Save preference to localStorage
      localStorage.setItem("darkMode", isDarkMode.toString());
   }, [isDarkMode]);

   const toggleTheme = () => {
      setIsDarkMode(!isDarkMode);
   };

   // Listen for system preference changes
   useEffect(() => {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
         if (localStorage.getItem("darkMode") === null) {
            setIsDarkMode(mediaQuery.matches);
         }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
   }, []);

   return { isDarkMode, toggleTheme };
};
