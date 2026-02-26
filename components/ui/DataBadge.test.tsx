import { describe, it, expect } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react-native';
import { DataSourceBadge } from '../DataSourceBadge'; // Corrected import path
import { I18nProvider } from '@/i18n/I18nProvider';
import { I18nContext } from '@/i18n/I18nContext'; // Import I18nContext for testing language changes

describe('DataSourceBadge', () => {
  it('renders correctly with provided data in Japanese (default)', () => {
    const mockTimestamp = "2023-10-27T10:30:00Z"; // UTC time
    const { getByText } = render(
      <I18nProvider>
        <DataSourceBadge source="Quick" timestamp={mockTimestamp} delayMinutes={15} />
      </I18nProvider>
    );

    // Assuming default locale is 'ja' and timezone is JST (+9 hours)
    // 2023-10-27T10:30:00Z => 2023/10/27 19:30
    expect(getByText('Quick | 2023/10/27 19:30 JST | 15分遅延')).toBeTruthy();
  });

  it('renders correctly with different delay minutes', () => {
    const mockTimestamp = "2023-10-27T10:30:00Z";
    const { getByText } = render(
      <I18nProvider>
        <DataSourceBadge source="Quick" timestamp={mockTimestamp} delayMinutes={5} />
      </I18nProvider>
    );

    expect(getByText('Quick | 2023/10/27 19:30 JST | 5分遅延')).toBeTruthy();
  });

  it('renders correctly for RTL language (Arabic)', () => {
    const mockTimestamp = "2023-10-27T10:30:00Z";
    const { getByText } = render(
      <I18nContext.Provider value={{
        currentLanguage: 'ar',
        t: (key, vars) => {
          const translations: Record<string, string> = {
            "common.jst": "بتوقيت اليابان",
            "common.minutes_delayed": "دقيقة تأخير",
          };
          let translated = translations[key] || key;
          if (vars) {
            for (const [varKey, varValue] of Object.entries(vars)) {
              translated = translated.replace(`{{${varKey}}}`, String(varValue));
            }
          }
          return translated;
        },
        setLanguage: () => {},
        isRTL: true,
        numberFormatter: new Intl.NumberFormat('ar'),
        dateTimeFormatter: new Intl.DateTimeFormat('ar', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: false,
          timeZone: 'Asia/Tokyo',
        }),
      }}>
        <DataSourceBadge source="Quick" timestamp={mockTimestamp} delayMinutes={15} />
      </I18nContext.Provider>
    );

    // 2023-10-27T10:30:00Z => 27‏/10‏/2023 19:30 (Arabic format)
    expect(getByText('Quick | 27‏/10‏/2023 19:30 بتوقيت اليابان | 15 دقيقة تأخير')).toBeTruthy();
  });
});
