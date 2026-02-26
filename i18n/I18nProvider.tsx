import React, { ReactNode } from "react";
import { I18nContext } from "./I18nContext";
import { lang, t } from "./index";

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  return <I18nContext.Provider value={{ lang, t }}>{children}</I18nContext.Provider>;
}
