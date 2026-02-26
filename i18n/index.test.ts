import { describe, it, expect, jest } from '@jest/globals';
import * as Localization from 'expo-localization';
import {
  getDeviceLanguage,
  createTranslator,
  createNumberFormatter,
  createDateTimeFormatter,
  setAppLanguage,
} from './index';
import { SUPPORTED_LANGUAGES } from './translations';
import { I18nManager } from 'react-native';
import { I18nProvider } from './I18nProvider';
import React from 'react';
import { render } from '@testing-library/react-native';

// Mock Localization
jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [{ languageCode: 'ja' }]),
}));

// Mock I18nManager
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  I18nManager: {
    forceRTL: jest.fn(),
    isRTL: false,
  },
}));

describe('i18n utility functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Localization.getLocales as jest.Mock).mockReturnValue([{ languageCode: 'ja' }]);
  });

  describe('getDeviceLanguage', () => {
    it('returns the device language if supported', () => {
      (Localization.getLocales as jest.Mock).mockReturnValue([{ languageCode: 'en' }]);
      expect(getDeviceLanguage()).toBe('en');
    });

    it('returns default "ja" if device language is not supported', () => {
      (Localization.getLocales as jest.Mock).mockReturnValue([{ languageCode: 'fr-CA' }]);
      expect(getDeviceLanguage()).toBe('ja');
    });

    it('returns default "ja" if no device language is found', () => {
      (Localization.getLocales as jest.Mock).mockReturnValue([]);
      expect(getDeviceLanguage()).toBe('ja');
    });
  });

  describe('createTranslator', () => {
    it('translates a key for a given language', () => {
      const t = createTranslator('en');
      expect(t('common.hello')).toBe('Hello');
    });

    it('replaces variables in translation', () => {
      const t = createTranslator('en');
      expect(t('premium.feature_locked', { feature: 'Realtime Data' })).toBe('Realtime Data is a premium feature.');
    });

    it('falls back to key if translation not found', () => {
      const t = createTranslator('en');
      expect(t('nonexistent.key')).toBe('nonexistent.key');
    });

    it('falls back to Japanese if language not found', () => {
      const t = createTranslator('unsupported' as any);
      expect(t('common.hello')).toBe('こんにちは');
    });
  });

  describe('createNumberFormatter', () => {
    it('creates a number formatter for a given language', () => {
      const formatter = createNumberFormatter('en');
      expect(formatter.format(12345.67)).toBe('12,345.67');
      const jaFormatter = createNumberFormatter('ja');
      expect(jaFormatter.format(12345.67)).toBe('12,345.67'); // Japanese uses comma as thousands separator too
    });
  });

  describe('createDateTimeFormatter', () => {
    it('creates a date time formatter for a given language', () => {
      const date = new Date('2023-01-15T14:30:00Z'); // UTC
      const enFormatter = createDateTimeFormatter('en');
      // This will depend on the test runner's timezone, but should be consistent with English format
      expect(enFormatter.format(date)).toMatch(/Jan 15, 2023 at \d{1,2}:\d{2} (AM|PM)/);

      const jaFormatter = createDateTimeFormatter('ja');
      // This will depend on the test runner's timezone, but should be consistent with Japanese format
      // Assuming JST (UTC+9) for 'ja'
      expect(jaFormatter.format(date)).toMatch(/2023年1月15日 \d{1,2}:\d{2}/);
    });
  });

  describe('setAppLanguage', () => {
    it('updates the language in the I18nProvider context', async () => {
      const TestComponent = () => {
        const { currentLanguage } = React.useContext(I18nContext);
        return <text testID="lang">{currentLanguage}</text>;
      };

      const { getByTestId, rerender } = render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      expect(getByTestId('lang').props.children).toBe('ja');

      setAppLanguage('en');

      // Re-render the provider to reflect the state change
      rerender(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      expect(getByTestId('lang').props.children).toBe('en');
    });
  });
});
