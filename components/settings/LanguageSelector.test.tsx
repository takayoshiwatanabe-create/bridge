import { describe, it, expect, jest } from '@jest/globals';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LanguageSelector } from './LanguageSelector';
import { I18nProvider, setAppLanguage } from '@/i18n/I18nProvider';
import { SUPPORTED_LANGUAGES } from '@/i18n/translations';

// Mock FontAwesome to avoid native module issues in tests
jest.mock('@expo/vector-icons', () => ({
  FontAwesome: 'FontAwesome',
}));

describe('LanguageSelector', () => {
  it('renders all supported languages', () => {
    const { getByText } = render(
      <I18nProvider>
        <LanguageSelector />
      </I18nProvider>
    );

    expect(getByText('日本語')).toBeTruthy();
    expect(getByText('English')).toBeTruthy();
    expect(getByText('中文')).toBeTruthy();
    expect(getByText('한국어')).toBeTruthy();
    expect(getByText('Español')).toBeTruthy();
    expect(getByText('Français')).toBeTruthy();
    expect(getByText('Deutsch')).toBeTruthy();
    expect(getByText('Português')).toBeTruthy();
    expect(getByText('العربية')).toBeTruthy();
    expect(getByText('हिन्दी')).toBeTruthy();
  });

  it('highlights the current language', () => {
    const { getByText } = render(
      <I18nProvider>
        <LanguageSelector />
      </I18nProvider>
    );

    // Default language is 'ja'
    const japaneseButton = getByText('日本語');
    expect(japaneseButton.props.style).toContainEqual(expect.objectContaining({ fontWeight: 'bold' }));
    expect(japaneseButton.props.style).toContainEqual(expect.objectContaining({ color: '#007bff' }));

    const englishButton = getByText('English');
    expect(englishButton.props.style).not.toContainEqual(expect.objectContaining({ fontWeight: 'bold' }));
  });

  it('changes language when a button is pressed', async () => {
    const { getByText, rerender } = render(
      <I18nProvider>
        <LanguageSelector />
      </I18nProvider>
    );

    // Initial language is Japanese
    expect(getByText('日本語').props.style).toContainEqual(expect.objectContaining({ fontWeight: 'bold' }));

    // Press English button
    fireEvent.press(getByText('English'));

    // Re-render the component to reflect the state change from the provider
    rerender(
      <I18nProvider>
        <LanguageSelector />
      </I18nProvider>
    );

    // Now English should be highlighted
    expect(getByText('English').props.style).toContainEqual(expect.objectContaining({ fontWeight: 'bold' }));
    expect(getByText('日本語').props.style).not.toContainEqual(expect.objectContaining({ fontWeight: 'bold' }));

    // Verify that the global setAppLanguage was called (indirectly through the provider)
    // This requires a more direct mock of setAppLanguage if we want to check its calls.
    // For now, checking the UI state change is sufficient.
  });

  it('displays check icon for the selected language', () => {
    const { getByText, queryByText } = render(
      <I18nProvider>
        <LanguageSelector />
      </I18nProvider>
    );

    // Default language is 'ja'
    expect(getByText('日本語').parent?.findByType('FontAwesome')).toBeTruthy();
    expect(queryByText('English').parent?.findByType('FontAwesome')).toBeFalsy();
  });
});

