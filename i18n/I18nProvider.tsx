import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import * as Localization from "expo-localization";
import { I18nContext } from "./I18nContext"; // Import the context type
import {
  translations,
  Language,
  SUPPORTED_LANGUAGES,
  RTL_LANGUAGES,
} from "./translations";

interface I18nProviderProps {
  children: ReactNode;
}

// Global variable to hold the current language, used by setAppLanguage
let appLanguage: Language = "ja"; // Default to Japanese

// Function to set the app language from outside the component
export const setAppLanguage = (lang: Language) => {
  appLanguage = lang;
  // In a real app, you might want to trigger a re-render or update a global state here
  // For now, components relying on `useContext(I18nContext)` will re-render
  // when the `I18nProvider`'s state changes.
};

export function I18nProvider({ children }: I18nProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(appLanguage);

  useEffect(() => {
    // Attempt to get device language, fallback to 'ja'
    const deviceLanguage = Localization.getLocales()[0]?.languageCode as Language;
    const initialLanguage =
      (deviceLanguage && SUPPORTED_LANGUAGES.includes(deviceLanguage))
        ? deviceLanguage
        : "ja";
    setCurrentLanguage(initialLanguage);
    appLanguage = initialLanguage; // Update global variable
  }, []);

  // Update the global appLanguage when currentLanguage state changes
  useEffect(() => {
    appLanguage = currentLanguage;
  }, [currentLanguage]);

  const t = useMemo(
    () =>
      (key: string, vars?: Record<string, string | number>): string => {
        let translated = translations[currentLanguage]?.[key] || key;
        if (vars) {
          for (const [varKey, varValue] of Object.entries(vars)) {
            translated = translated.replace(`{{${varKey}}}`, String(varValue));
          }
        }
        return translated;
      },
    [currentLanguage]
  );

  const isRTL = useMemo(
    () => RTL_LANGUAGES.includes(currentLanguage),
    [currentLanguage]
  );

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(currentLanguage, {
        style: "currency",
        currency: currentLanguage === "ja" ? "JPY" : "USD", // Example: JPY for Japanese, USD for others
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    [currentLanguage]
  );

  const dateTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(currentLanguage, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
        timeZone: "Asia/Tokyo", // Always display in JST as per spec
      }),
    [currentLanguage]
  );

  const contextValue = useMemo(
    () => ({
      currentLanguage,
      t,
      setLanguage: setCurrentLanguage,
      isRTL,
      numberFormatter,
      dateTimeFormatter,
    }),
    [currentLanguage, t, isRTL, numberFormatter, dateTimeFormatter]
  );

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
}

