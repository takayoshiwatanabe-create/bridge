import React, { ReactNode, useState, useEffect, useContext } from "react";
import { I18nContext } from "./I18nContext";
import * as Localization from "expo-localization";
import { translations, type Language } from "./translations";
import { t, lang, isRTL, numberFormatter, dateTimeFormatter } from "./index"; // Import all exports from index

const SUPPORTED: Language[] = ["ja", "en", "zh", "ko", "es", "fr", "de", "pt", "ar", "hi"];

function getInitialLanguage(): Language {
  try {
    const locales = Localization.getLocales();
    const deviceLang = locales[0]?.languageCode ?? "ja";
    if (SUPPORTED.includes(deviceLang as Language)) return deviceLang as Language;
    return "ja";
  } catch {
    return "ja";
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState<Language>(getInitialLanguage());

  useEffect(() => {
    // In a real app, you might want to allow users to change language
    // and persist it, or react to system language changes.
    // For now, we just set it once on mount.
  }, []);

  // The `t` function and other i18n utilities are now provided by the `i18n/index.ts` module
  // and are directly imported. The context provider should just pass these values.
  // This ensures consistency and avoids re-implementing `t` here.
  return (
    <I18nContext.Provider value={{ lang: currentLang, t, isRTL, numberFormatter, dateTimeFormatter }}>
      {children}
    </I18nContext.Provider>
  );
}
