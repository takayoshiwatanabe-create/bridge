import React, { ReactNode, useState, useEffect, useCallback } from "react";
import { I18nContext } from "./I18nContext";
import * as Localization from "expo-localization";
import { translations, type Language, SUPPORTED_LANGUAGES } from "./translations"; // Import SUPPORTED_LANGUAGES
import { createTranslator, createNumberFormatter, createDateTimeFormatter } from "./index";

function getInitialLanguage(): Language {
  try {
    const locales = Localization.getLocales();
    // Ensure languageCode is treated as a string and checked against SUPPORTED_LANGUAGES
    const deviceLang = locales[0]?.languageCode;
    if (deviceLang && (SUPPORTED_LANGUAGES as readonly string[]).includes(deviceLang)) {
      return deviceLang as Language;
    }
    return "ja";
  } catch {
    return "ja";
  }
}

// This function will be called from LanguageSelector to change the app language
let _setAppLanguage: ((lang: Language) => void) | null = null;
export function setAppLanguage(lang: Language) {
  if (_setAppLanguage) {
    _setAppLanguage(lang);
  } else {
    console.warn("setAppLanguage called before I18nProvider was fully initialized.");
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(getInitialLanguage());

  // Expose setLang function to the global scope or a module-level variable
  // so it can be called from outside the component tree (e.g., LanguageSelector)
  useEffect(() => {
    _setAppLanguage = setLang;
    return () => {
      _setAppLanguage = null; // Clean up on unmount
    };
  }, []);

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

  const t = useCallback(createTranslator(lang), [lang]);
  const isRTL = ["ar"].includes(lang);
  const numberFormatter = useCallback(createNumberFormatter(lang), [lang]);
  const dateTimeFormatter = useCallback(createDateTimeFormatter(lang), [lang]);

  return (
    <I18nContext.Provider value={{ lang, t, isRTL, numberFormatter, dateTimeFormatter }}>
      {children}
    </I18nContext.Provider>
  );
}


