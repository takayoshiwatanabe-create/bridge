import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import * as Localization from "expo-localization";
import { I18nManager } from "react-native";
import { translations, SUPPORTED_LANGUAGES, Language } from "./translations";

interface I18nContextType {
  t: (key: string, variables?: { [key: string]: string | number }) => string;
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  numberFormatter: Intl.NumberFormat;
  dateTimeFormatter: Intl.DateTimeFormat;
}

export const I18nContext = createContext<I18nContextType>({
  t: (key) => key,
  currentLanguage: "en",
  setLanguage: () => {},
  isRTL: false,
  numberFormatter: new Intl.NumberFormat("en"),
  dateTimeFormatter: new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }),
});

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [isRTL, setIsRTL] = useState<boolean>(false);

  useEffect(() => {
    const deviceLanguage = Localization.getLocales()[0]?.languageCode as Language | undefined;
    const initialLanguage = deviceLanguage && (SUPPORTED_LANGUAGES as readonly string[]).includes(deviceLanguage)
      ? deviceLanguage
      : "ja"; // Default to Japanese if device language is not supported

    setCurrentLanguage(initialLanguage as Language); // Cast to Language
    updateRTL(initialLanguage as Language); // Cast to Language
  }, []);

  const updateRTL = (lang: Language) => {
    const rtl = lang === "ar"; // Arabic is the only RTL language in our supported list
    I18nManager.forceRTL(rtl);
    // I18nManager.allowRTL(rtl); // This is usually set once at app startup, not dynamically
    setIsRTL(rtl);
  };

  const setLanguage = (lang: Language) => {
    if ((SUPPORTED_LANGUAGES as readonly string[]).includes(lang)) {
      setCurrentLanguage(lang);
      updateRTL(lang);
      // Note: For a full RTL change to take effect, the app might need to be reloaded.
      // In Expo, this often means restarting the development server or the app on device.
      // For production, this might involve a native module reload or a full app restart.
      // For simplicity in this example, we're just updating the state and I18nManager.
    } else {
      console.warn(`Language ${lang} is not supported.`);
    }
  };

  const t = (key: string, variables?: { [key: string]: string | number }): string => {
    let translation = translations[currentLanguage]?.[key] || key;

    if (variables) {
      for (const [varKey, varValue] of Object.entries(variables)) {
        translation = translation.replace(
          new RegExp(`{{${varKey}}}`, "g"),
          String(varValue)
        );
      }
    }
    return translation;
  };

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(currentLanguage),
    [currentLanguage]
  );

  const dateTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(currentLanguage, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Use 24-hour format as per spec example
      }),
    [currentLanguage]
  );

  const contextValue = useMemo(
    () => ({
      t,
      currentLanguage,
      setLanguage,
      isRTL,
      numberFormatter,
      dateTimeFormatter,
    }),
    [t, currentLanguage, setLanguage, isRTL, numberFormatter, dateTimeFormatter]
  );

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
}

