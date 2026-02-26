import { describe, it, expect, jest } from '@jest/globals';
import React, { useContext } from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { I18nProvider, setAppLanguage } from './I18nProvider';
import { I18nContext } from './I18nContext';
import { I18nManager } from 'react-native';
import * as Localization from 'expo-localization';

// Mock Localization
jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [{ languageCode: 'ja' }]),
}));

// Mock I18nManager
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  I18nManager: {
    forceRTL: jest.fn(),
    isRTL: false, // Default to false for tests
  },
}));

// A test component to consume the context
const TestComponent = () => {
  const { t, currentLanguage, isRTL, numberFormatter, dateTimeFormatter } = useContext(I18nContext);
  const formattedNumber = numberFormatter.format(12345.67);
  const formattedDateTime = dateTimeFormatter.format(new Date('2023-10-27T10:30:00Z'));
  return (
    <>
      <text testID="currentLanguage">{currentLanguage}</text>
      <text testID="isRTL">{isRTL ? 'true' : 'false'}</text>
      <text testID="hello">{t('common.hello')}</text>
      <text testID="formattedNumber">{formattedNumber}</text>
      <text testID="formattedDateTime">{formattedDateTime}</text>
      <text testID="portfolioTitle">{t('portfolio.title')}</text>
    </>
  );
};

describe('I18nProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Localization.getLocales as jest.Mock).mockReturnValue([{ languageCode: 'ja' }]);
    (I18nManager.forceRTL as jest.Mock).mockClear();
  });

  it('provides default language (Japanese) and translations', async () => {
    const { getByTestId } = render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(getByTestId('currentLanguage').props.children).toBe('ja');
      expect(getByTestId('isRTL').props.children).toBe('false');
      expect(getByTestId('hello').props.children).toBe('こんにちは');
      expect(getByTestId('portfolioTitle').props.children).toBe('ポートフォリオ');
      expect(getByTestId('formattedNumber').props.children).toBe('12,345.67');
      // Date formatting depends on locale and timezone, so it's a bit tricky to assert exact string
      // We'll check for parts that are consistent with Japanese locale and UTC+9
      expect(getByTestId('formattedDateTime').props.children).toMatch(/2023年10月27日 19:30/);
    });
  });

  it('allows changing language via setAppLanguage', async () => {
    const { getByTestId, rerender } = render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(getByTestId('currentLanguage').props.children).toBe('ja');
    });

    setAppLanguage('en');

    rerender(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(getByTestId('currentLanguage').props.children).toBe('en');
      expect(getByTestId('hello').props.children).toBe('Hello');
      expect(getByTestId('portfolioTitle').props.children).toBe('Portfolio');
      expect(getByTestId('formattedNumber').props.children).toBe('12,345.67'); // English format
      expect(getByTestId('formattedDateTime').props.children).toMatch(/Oct 27, 2023 at 7:30 PM/); // English format
    });
  });

  it('handles RTL language correctly', async () => {
    (Localization.getLocales as jest.Mock).mockReturnValue([{ languageCode: 'ar' }]);

    const { getByTestId, rerender } = render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(getByTestId('currentLanguage').props.children).toBe('ar');
      expect(getByTestId('isRTL').props.children).toBe('true');
      expect(getByTestId('hello').props.children).toBe('مرحبا');
      expect(I18nManager.forceRTL).toHaveBeenCalledWith(true);
    });

    setAppLanguage('en');

    rerender(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(getByTestId('currentLanguage').props.children).toBe('en');
      expect(getByTestId('isRTL').props.children).toBe('false');
      expect(I18nManager.forceRTL).toHaveBeenCalledWith(false);
    });
  });

  it('falls back to default language if device language is not supported', async () => {
    (Localization.getLocales as jest.Mock).mockReturnValue([{ languageCode: 'fr-CA' }]); // Unsupported variant

    const { getByTestId } = render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(getByTestId('currentLanguage').props.children).toBe('ja');
      expect(getByTestId('hello').props.children).toBe('こんにちは');
    });
  });

  it('warns if an unsupported language is set', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    setAppLanguage('unsupported' as any); // Cast to any to test unsupported language

    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith('Language unsupported is not supported.');
    });

    consoleWarnSpy.mockRestore();
  });
});
