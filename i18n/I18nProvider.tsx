import React, { ReactNode, useState, useEffect } from "react";
import { I18nContext } from "./I18nContext";
import * as Localization from "expo-localization";
import { translations, type Language } from "./translations";
import { createTranslator, createNumberFormatter, createDateTimeFormatter } from "./index";

const SUPPORTED: Language[] = ["ja", "en", "zh", "ko", "es", "fr", "de", "pt", "ar", "hi"];

function getInitialLanguage(): Language {
  try {
    const locales = Localization.getLocales();
    // Ensure languageCode is treated as a string and checked against SUPPORTED
    const deviceLang = locales[0]?.languageCode;
    if (deviceLang && SUPPORTED.includes(deviceLang as Language)) {
      return deviceLang as Language;
    }
    return "ja";
  } catch {
    return "ja";
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(getInitialLanguage());

  useEffect(() => {
    // This effect handles initial language setting and could be extended for dynamic changes.
    // For now, it ensures the initial language is set.
    const handleLocalizationChange = () => {
      setLang(getInitialLanguage());
    };

    // In a real app, you might listen to Localization.addEventListener for dynamic changes
    // For this project, we assume language is set once on app load or user preference.
    // Localization.addEventListener('change', handleLocalizationChange); // Uncomment for dynamic updates
    // return () => Localization.removeEventListener('change', handleLocalizationChange);
  }, []);

  const t = createTranslator(lang);
  const isRTL = ["ar"].includes(lang);
  const numberFormatter = createNumberFormatter(lang);
  const dateTimeFormatter = createDateTimeFormatter(lang);

  return (
    <I18nContext.Provider value={{ lang, t, isRTL, numberFormatter, dateTimeFormatter }}>
      {children}
    </I18nContext.Provider>
  );
}
