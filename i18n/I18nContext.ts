import React from "react";
import { Language } from "./translations";

interface I18nContextType {
  currentLanguage: Language;
  t: (key: string, vars?: Record<string, string | number>) => string;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  numberFormatter: Intl.NumberFormat;
  dateTimeFormatter: Intl.DateTimeFormat;
}

export const I18nContext = React.createContext<I18nContextType>({
  currentLanguage: "ja",
  t: (key) => key,
  setLanguage: () => {},
  isRTL: false,
  numberFormatter: new Intl.NumberFormat("ja"),
  dateTimeFormatter: new Intl.DateTimeFormat("ja", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false, // Ensure consistency with I18nProvider
  }),
});

