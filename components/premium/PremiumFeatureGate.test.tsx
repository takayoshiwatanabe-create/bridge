import { describe, it, expect } from '@jest/globals';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PremiumFeatureGate } from './PremiumFeatureGate';
import { I18nProvider } from '@/i18n/I18nProvider';

describe('PremiumFeatureGate', () => {
  it('renders children when user is premium', () => {
    const { getByText, queryByText } = render(
      <I18nProvider>
        <PremiumFeatureGate featureKey="realtime_data" isPremiumUser={true}>
          <TestComponent text="Realtime data content" />
        </PremiumFeatureGate>
      </I18nProvider>
    );

    expect(getByText('Realtime data content')).toBeTruthy();
    expect(queryByText('プレミアム機能')).toBeNull(); // Should not show upgrade prompt
  });

  it('renders children when feature is not premium', () => {
    const { getByText, queryByText } = render(
      <I18nProvider>
        <PremiumFeatureGate featureKey="non_premium_feature" isPremiumUser={false}>
          <TestComponent text="Free feature content" />
        </PremiumFeatureGate>
      </I18nProvider>
    );

    expect(getByText('Free feature content')).toBeTruthy();
    expect(queryByText('プレミアム機能')).toBeNull(); // Should not show upgrade prompt
  });

  it('renders upgrade prompt when user is not premium and feature is premium', () => {
    const { getByText, queryByText } = render(
      <I18nProvider>
        <PremiumFeatureGate featureKey="realtime_data" isPremiumUser={false}>
          <TestComponent text="Realtime data content" />
        </PremiumFeatureGate>
      </I18nProvider>
    );

    expect(queryByText('Realtime data content')).toBeNull(); // Should not render children
    expect(getByText('プレミアム機能')).toBeTruthy();
    expect(getByText('リアルタイムデータはプレミアム機能です。')).toBeTruthy();
    expect(getByText('プレミアムにアップグレードして、すべての機能にアクセスしましょう！')).toBeTruthy();
    expect(getByText('アップグレード')).toBeTruthy();
  });

  it('renders upgrade prompt for another premium feature', () => {
    const { getByText, queryByText } = render(
      <I18nProvider>
        <PremiumFeatureGate featureKey="unlimited_stocks" isPremiumUser={false}>
          <TestComponent text="Unlimited stocks content" />
        </PremiumFeatureGate>
      </I18nProvider>
    );

    expect(queryByText('Unlimited stocks content')).toBeNull();
    expect(getByText('プレミアム機能')).toBeTruthy();
    expect(getByText('無制限銘柄はプレミアム機能です。')).toBeTruthy();
  });
});

// Helper component for testing children rendering
const TestComponent = ({ text }: { text: string }) => <Text>{text}</Text>;

