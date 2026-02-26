import { describe, it, expect } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react-native';
import { StockHeader } from './StockHeader';
import { I18nProvider } from '@/i18n/I18nProvider';
import { Instrument, MarketData } from '@/types';

describe('StockHeader', () => {
  const mockInstrument: Instrument = {
    id: "AAPL_ID",
    symbol: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    currency: "USD",
  };

  const mockMarketDataPositive: MarketData = {
    instrumentId: "AAPL_ID",
    price: 175.00,
    change: 1.50,
    changePercent: 0.86,
    timestamp: new Date().toISOString(),
    dataSource: "Quick",
    delayMinutes: 15,
  };

  const mockMarketDataNegative: MarketData = {
    instrumentId: "AAPL_ID",
    price: 170.00,
    change: -2.00,
    changePercent: -1.16,
    timestamp: new Date().toISOString(),
    dataSource: "Quick",
    delayMinutes: 15,
  };

  const mockMarketDataZero: MarketData = {
    instrumentId: "AAPL_ID",
    price: 172.00,
    change: 0.00,
    changePercent: 0.00,
    timestamp: new Date().toISOString(),
    dataSource: "Quick",
    delayMinutes: 15,
  };

  it('renders stock header correctly with positive change', () => {
    const { getByText } = render(
      <I18nProvider>
        <StockHeader instrument={mockInstrument} marketData={mockMarketDataPositive} />
      </I18nProvider>
    );

    expect(getByText('AAPL')).toBeTruthy();
    expect(getByText('Apple Inc.')).toBeTruthy();
    expect(getByText('175 USD')).toBeTruthy();
    expect(getByText('1.5 (0.86%)').props.style.color).toBe('#28a745'); // Green for positive change
  });

  it('renders stock header correctly with negative change', () => {
    const { getByText } = render(
      <I18nProvider>
        <StockHeader instrument={mockInstrument} marketData={mockMarketDataNegative} />
      </I18nProvider>
    );

    expect(getByText('AAPL')).toBeTruthy();
    expect(getByText('Apple Inc.')).toBeTruthy();
    expect(getByText('170 USD')).toBeTruthy();
    expect(getByText('-2 (-1.16%)').props.style.color).toBe('#dc3545'); // Red for negative change
  });

  it('renders stock header correctly with zero change', () => {
    const { getByText } = render(
      <I18nProvider>
        <StockHeader instrument={mockInstrument} marketData={mockMarketDataZero} />
      </I18nProvider>
    );

    expect(getByText('AAPL')).toBeTruthy();
    expect(getByText('Apple Inc.')).toBeTruthy();
    expect(getByText('172 USD')).toBeTruthy();
    expect(getByText('0 (0%)').props.style.color).toBe('#28a745'); // Green for zero change (or neutral)
  });
});
