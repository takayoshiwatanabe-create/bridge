import * as Localization from "expo-localization";
import { translations, type Language, SUPPORTED_LANGUAGES } from "./translations";
import { I18nContext } from "./I18nContext"; // Import I18nContext

// This function is intended to be called from outside the provider to change language
// It needs to interact with the provider's state.
// A more robust solution might involve a global state manager or a custom hook
// that exposes this function from the provider.
// For now, we'll keep the `_setAppLanguage` pattern as it was in the original code,
// but acknowledge its limitations and potential for being called before initialization.
let _setAppLanguage: ((lang: Language) => void) | null = null;
export function setAppLanguage(lang: Language) {
  if (_setAppLanguage) {
    _setAppLanguage(lang);
  } else {
    console.warn("setAppLanguage called before I18nProvider was fully initialized.");
  }
}

export function getDeviceLanguage(): Language {
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

// These functions are generally not needed if using the I18nContext hook directly
// in components. They might be useful for server-side rendering or non-React contexts.
// However, given this is an Expo React Native project, the Context API is the primary way.
// Keeping them for now as they were part of the original structure, but they are
// effectively superseded by the context values.
export function createTranslator(currentLang: Language) {
  return (key: string, vars?: Record<string, string | number>): string => {
    const dict = translations[currentLang] ?? translations.ja;
    let text = dict[key] ?? translations.ja[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        text = text.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), String(v));
      }
    }
    return text;
  };
}

export function createNumberFormatter(currentLang: Language): Intl.NumberFormat {
  return new Intl.NumberFormat(currentLang);
}

export function createDateTimeFormatter(currentLang: Language): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(currentLang, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
}

// Re-export I18nContext and I18nProvider for easier access
export { I18nContext } from "./I18nContext";
export { I18nProvider } from "./I18nProvider";
export type { Language } from "./translations";
