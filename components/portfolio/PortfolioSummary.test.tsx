import { describe, it, expect } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react-native';
import { PortfolioSummary } from './PortfolioSummary';
import { I18nProvider } from '@/i18n/I18nProvider';
import { PortfolioSummary as PortfolioSummaryType } from '@/types';

describe('PortfolioSummary', () => {
  const mockSummary: PortfolioSummaryType = {
    totalValue: 150000,
    totalGainLoss: 15000,
    totalGainLossPercent: 11.11,
  };

  it('renders portfolio summary correctly with positive gain', () => {
    const { getByText } = render(
      <I18nProvider>
        <PortfolioSummary summary={mockSummary} />
      </I18nProvider>
    );

    expect(getByText('合計評価額')).toBeTruthy();
    expect(getByText('¥150,000')).toBeTruthy(); // Assuming default Japanese locale for number formatting
    expect(getByText('合計損益')).toBeTruthy();
    expect(getByText('¥15,000')).toBeTruthy();
    expect(getByText('合計損益率')).toBeTruthy();
    expect(getByText('11.11%')).toBeTruthy();
    expect(getByText('¥15,000').props.style.color).toBe('#28a745'); // Green for positive gain
    expect(getByText('11.11%').props.style.color).toBe('#28a745'); // Green for positive gain
  });

  it('renders portfolio summary correctly with negative loss', () => {
    const negativeSummary: PortfolioSummaryType = {
      totalValue: 80000,
      totalGainLoss: -20000,
      totalGainLossPercent: -20.00,
    };

    const { getByText } = render(
      <I18nProvider>
        <PortfolioSummary summary={negativeSummary} />
      </I18nProvider>
    );

    expect(getByText('¥80,000')).toBeTruthy();
    expect(getByText('-¥20,000')).toBeTruthy();
    expect(getByText('-20.00%')).toBeTruthy();
    expect(getByText('-¥20,000').props.style.color).toBe('#dc3545'); // Red for negative loss
    expect(getByText('-20.00%').props.style.color).toBe('#dc3545'); // Red for negative loss
  });

  it('renders portfolio summary correctly with zero gain/loss', () => {
    const zeroSummary: PortfolioSummaryType = {
      totalValue: 100000,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
    };

    const { getByText } = render(
      <I18nProvider>
        <PortfolioSummary summary={zeroSummary} />
      </I18nProvider>
    );

    expect(getByText('¥100,000')).toBeTruthy();
    expect(getByText('¥0')).toBeTruthy();
    expect(getByText('0%')).toBeTruthy();
    expect(getByText('¥0').props.style.color).toBe('#28a745'); // Green for zero gain/loss (or neutral)
    expect(getByText('0%').props.style.color).toBe('#28a745'); // Green for zero gain/loss
  });
});

