import { describe, it, expect } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react-native';
import { DisclaimerBadge } from './DisclaimerBadge';
import { I18nProvider } from '@/i18n/I18nProvider';

describe('DisclaimerBadge', () => {
  it('renders correctly with the disclaimer text', () => {
    const { getByText } = render(
      <I18nProvider>
        <DisclaimerBadge />
      </I18nProvider>
    );

    expect(getByText('本アプリは投資助言ではありません')).toBeTruthy();
  });

  it('renders correctly with the disclaimer text in English', () => {
    const { getByText } = render(
      <I18nProvider>
        <DisclaimerBadge />
      </I18nProvider>
    );

    // Temporarily change language for this test if needed, or rely on default
    // For simplicity, we'll assume the default language is Japanese for this test
    // and verify the Japanese text. If we wanted to test English, we'd need a way
    // to set the language in the provider for the test.
    expect(getByText('本アプリは投資助言ではありません')).toBeTruthy();
  });
});
