import React from "react";
import { Language } from "./translations";

interface I18nContextType {
  lang: Language;
  t: (key: string, vars?: Record<string, string | number>) => string;
  isRTL: boolean;
  numberFormatter: Intl.NumberFormat;
  dateTimeFormatter: Intl.DateTimeFormat;
}

export const I18nContext = React.createContext<I18nContextType>({
  lang: "ja", // Default language
  t: (key) => key, // Default translation function
  isRTL: false,
  numberFormatter: new Intl.NumberFormat("ja"),
  dateTimeFormatter: new Intl.DateTimeFormat("ja"),
});
