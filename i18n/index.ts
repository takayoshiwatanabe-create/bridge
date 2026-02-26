import * as Localization from "expo-localization";
import { translations, type Language, SUPPORTED_LANGUAGES } from "./translations"; // Import SUPPORTED_LANGUAGES

// This function will be called from LanguageSelector to change the app language
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
    // Use `languageCode` for BCP 47 language tag without region, e.g., "en" from "en-US"
    const deviceLang = locales[0]?.languageCode;
    if (deviceLang && (SUPPORTED_LANGUAGES as readonly string[]).includes(deviceLang)) {
      return deviceLang as Language;
    }
    return "ja";
  } catch {
    return "ja";
  }
}

export function createTranslator(currentLang: Language) {
  return (key: string, vars?: Record<string, string | number>): string => {
    const dict = translations[currentLang] ?? translations.ja;
    let text = dict[key] ?? translations.ja[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        // Use a more robust regex to ensure only whole words are replaced,
        // or specific placeholders like {{key}}
        text = text.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), String(v));
      }
    }
    return text;
  };
}

// Export Intl objects for number and date formatting
// Ensure these are initialized with the determined 'lang'
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
  });
}

// For direct use in non-React contexts or for initial setup if needed,
// though I18nProvider is the primary way to get these.
// These exports are for initial setup/default values, the context provides dynamic ones.
export const lang = getDeviceLanguage();
export const isRTL = ["ar"].includes(lang);
export const t = createTranslator(lang);
export const numberFormatter = createNumberFormatter(lang);
export const dateTimeFormatter = createDateTimeFormatter(lang);


