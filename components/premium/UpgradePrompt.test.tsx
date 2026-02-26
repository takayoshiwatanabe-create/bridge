import { describe, it, expect, jest } from '@jest/globals';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { UpgradePrompt } from './UpgradePrompt';
import { I18nProvider } from '@/i18n/I18nProvider';
import { useRouter } from 'expo-router';

// Mock useRouter
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('UpgradePrompt', () => {
  const mockPush = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  });

  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders upgrade prompt correctly', () => {
    const { getByText } = render(
      <I18nProvider>
        <UpgradePrompt />
      </I18nProvider>
    );

    expect(getByText('プレミアムにアップグレード')).toBeTruthy();
    expect(getByText('プレミアムにアップグレードして、すべての機能にアクセスしましょう！')).toBeTruthy();
    expect(getByText('アップグレード')).toBeTruthy();
  });

  it('calls console.log when upgrade button is pressed', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const { getByText } = render(
      <I18nProvider>
        <UpgradePrompt />
      </I18nProvider>
    );

    fireEvent.press(getByText('アップグレード'));
    expect(consoleSpy).toHaveBeenCalledWith('Initiating in-app purchase flow for premium upgrade...');
    consoleSpy.mockRestore();
  });

  // If navigation was implemented, test it like this:
  // it('navigates to upgrade screen when button is pressed', () => {
  //   const { getByText } = render(
  //     <I18nProvider>
  //       <UpgradePrompt />
  //     </I18nProvider>
  //   );
  //
  //   fireEvent.press(getByText('アップグレード'));
  //   expect(mockPush).toHaveBeenCalledWith('/(app)/upgrade');
  // });
});
