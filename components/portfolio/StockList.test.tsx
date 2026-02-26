import { describe, it, expect, jest } from '@jest/globals';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StockList } from './StockList';
import { I18nProvider } from '@/i18n/I18nProvider';
import { PortfolioItem, MarketData } from '@/types';
import { useRouter } from 'expo-router';

// Mock useRouter
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('StockList', () => {
  const mockPush = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  });

  const mockPortfolioItems: PortfolioItem[] = [
    {
      instrument: { id: "AAPL_ID", symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", currency: "USD" },
      quantity: 10,
      averagePrice: 160.00,
    },
    {
      instrument: { id: "MSFT_ID", symbol: "MSFT", name: "Microsoft Corp.", exchange: "NASDAQ", currency: "USD" },
      quantity: 5,
      averagePrice: 300.00,
    },
  ];

  const mockMarketData: MarketData[] = [
    {
      instrumentId: "AAPL_ID",
      price: 175.00,
      change: 1.50,
      changePercent: 0.86,
      timestamp: new Date().toISOString(),
      dataSource: "Quick",
      delayMinutes: 15,
    },
    {
      instrumentId: "MSFT_ID",
      price: 320.00,
      change: -2.00,
      changePercent: -0.62,
      timestamp: new Date().toISOString(),
      dataSource: "Quick",
      delayMinutes: 15,
    },
  ];

  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders stock list items correctly', () => {
    const { getByText } = render(
      <I18nProvider>
        <StockList items={mockPortfolioItems} marketData={mockMarketData} />
      </I18nProvider>
    );

    // Check for Apple Inc.
    expect(getByText('AAPL')).toBeTruthy();
    expect(getByText('Apple Inc.')).toBeTruthy();
    expect(getByText('数量:')).toBeTruthy();
    expect(getByText('10')).toBeTruthy();
    expect(getByText('平均取得価格:')).toBeTruthy();
    expect(getByText('¥160')).toBeTruthy();
    expect(getByText('現在価格:')).toBeTruthy();
    expect(getByText('¥175')).toBeTruthy();
    expect(getByText('損益:')).toBeTruthy();
    expect(getByText('¥150 (9.38%)')).toBeTruthy(); // (175-160)*10 = 150, 150/(160*10)*100 = 9.375%

    // Check for Microsoft Corp.
    expect(getByText('MSFT')).toBeTruthy();
    expect(getByText('Microsoft Corp.')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
    expect(getByText('¥300')).toBeTruthy();
    expect(getByText('¥320')).toBeTruthy();
    expect(getByText('¥100 (6.67%)')).toBeTruthy(); // (320-300)*5 = 100, 100/(300*5)*100 = 6.666%
  });

  it('displays "N/A" for missing market data', () => {
    const itemsWithMissingData: PortfolioItem[] = [
      {
        instrument: { id: "GOOG_ID", symbol: "GOOG", name: "Alphabet Inc.", exchange: "NASDAQ", currency: "USD" },
        quantity: 1,
        averagePrice: 100.00,
      },
    ];
    const emptyMarketData: MarketData[] = [];

    const { getByText } = render(
      <I18nProvider>
        <StockList items={itemsWithMissingData} marketData={emptyMarketData} />
      </I18nProvider>
    );

    expect(getByText('GOOG')).toBeTruthy();
    expect(getByText('Alphabet Inc.')).toBeTruthy();
    expect(getByText('現在価格:')).toBeTruthy();
    expect(getByText('N/A')).toBeTruthy();
    expect(getByText('損益:')).toBeTruthy();
    expect(getByText('N/A (0%)')).toBeTruthy(); // Gain/Loss will be 0 if current value is 0
  });

  it('navigates to stock detail screen on item press', () => {
    const { getByText } = render(
      <I18nProvider>
        <StockList items={mockPortfolioItems} marketData={mockMarketData} />
      </I18nProvider>
    );

    fireEvent.press(getByText('AAPL'));
    expect(mockPush).toHaveBeenCalledWith('/(app)/stock/AAPL');

    fireEvent.press(getByText('MSFT'));
    expect(mockPush).toHaveBeenCalledWith('/(app)/stock/MSFT');
  });

  it('renders empty list message when no items', () => {
    const { getByText } = render(
      <I18nProvider>
        <StockList items={[]} marketData={[]} />
      </I18nProvider>
    );

    expect(getByText('ポートフォリオに銘柄がありません。')).toBeTruthy();
  });
});

