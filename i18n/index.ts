import * as Localization from "expo-localization";
import { translations, type Language } from "./translations";

const SUPPORTED: Language[] = ["ja", "en", "zh", "ko", "es", "fr", "de", "pt", "ar", "hi"];

function getLanguage(): Language {
  try {
    const locales = Localization.getLocales();
    // Use `languageCode` for BCP 47 language tag without region, e.g., "en" from "en-US"
    const deviceLang = locales[0]?.languageCode ?? "ja";
    if (SUPPORTED.includes(deviceLang as Language)) return deviceLang as Language;
    return "ja";
  } catch {
    return "ja";
  }
}

export const lang = getLanguage();
export const isRTL = ["ar"].includes(lang);

export function t(key: string, vars?: Record<string, string | number>): string {
  const dict = translations[lang] ?? translations.ja;
  let text = dict[key] ?? translations.ja[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      // Use a more robust regex to ensure only whole words are replaced,
      // or specific placeholders like {{key}}
      text = text.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), String(v));
    }
  }
  return text;
}

// Export Intl objects for number and date formatting
// Ensure these are initialized with the determined 'lang'
export const numberFormatter = new Intl.NumberFormat(lang);
export const dateTimeFormatter = new Intl.DateTimeFormat(lang, {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

