import React, { ReactNode, useState, useEffect, useCallback, useMemo } from "react";
import { I18nContext } from "./I18nContext";
import * as Localization from "expo-localization";
import { translations, type Language, SUPPORTED_LANGUAGES } from "./translations";
import { I18nManager } from "react-native";

function getInitialLanguage(): Language {
  try {
    const locales = Localization.getLocales();
    const deviceLang = locales[0]?.languageCode;
    if (deviceLang && (SUPPORTED_LANGUAGES as readonly string[]).includes(deviceLang)) {
      return deviceLang as Language;
    }
    return "ja";
  } catch {
    return "ja";
  }
}

let _setAppLanguage: ((lang: Language) => void) | null = null;
export function setAppLanguage(lang: Language) {
  if (_setAppLanguage) {
    _setAppLanguage(lang);
  } else {
    console.warn("setAppLanguage called before I18nProvider was fully initialized.");
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage());
  const [isRTL, setIsRTL] = useState<boolean>(false);

  // Memoize setLanguage to avoid unnecessary re-renders in children
  const memoizedSetLanguage = useCallback((lang: Language) => {
    if ((SUPPORTED_LANGUAGES as readonly string[]).includes(lang)) {
      setCurrentLanguage(lang);
    } else {
      console.warn(`Language ${lang} is not supported.`);
    }
  }, []);

  useEffect(() => {
    _setAppLanguage = memoizedSetLanguage;
    return () => {
      _setAppLanguage = null;
    };
  }, [memoizedSetLanguage]);

  useEffect(() => {
    updateRTL(currentLanguage);
  }, [currentLanguage]);

  const updateRTL = (lang: Language) => {
    const rtl = lang === "ar";
    I18nManager.forceRTL(rtl);
    // Forcing RTL might require a reload to fully apply in some native contexts.
    // For React Native components, setting `direction: 'rtl'` in styles is often sufficient
    // after `I18nManager.forceRTL` has been called at app startup.
    setIsRTL(rtl);
  };

  const t = useCallback((key: string, variables?: { [key: string]: string | number }): string => {
    let translation = translations[currentLanguage]?.[key] || key;

    if (variables) {
      for (const [varKey, varValue] of Object.entries(variables)) {
        translation = translation.replace(
          new RegExp(`{{\\s*${varKey}\\s*}}`, "g"),
          String(varValue)
        );
      }
    }
    return translation;
  }, [currentLanguage]);

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(currentLanguage),
    [currentLanguage]
  );

  const dateTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(currentLanguage, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }),
    [currentLanguage]
  );

  const contextValue = useMemo(
    () => ({
      t,
      currentLanguage,
      setLanguage: memoizedSetLanguage, // Use the memoized setter
      isRTL,
      numberFormatter,
      dateTimeFormatter,
    }),
    [t, currentLanguage, memoizedSetLanguage, isRTL, numberFormatter, dateTimeFormatter]
  );

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
}

