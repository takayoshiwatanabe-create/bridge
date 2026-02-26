import { describe, it, expect } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react-native';
import { StockDetails } from './StockDetails';
import { I18nProvider } from '@/i18n/I18nProvider';
import { CompanyInfo } from '@/types';

describe('StockDetails', () => {
  const mockCompanyInfo: CompanyInfo = {
    description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
    sector: "Technology",
    industry: "Consumer Electronics",
    marketCap: 2800000000000, // 2.8 Trillion
    peRatio: 28.5,
    dividendYield: 0.56,
  };

  it('renders company details correctly', () => {
    const { getByText } = render(
      <I18nProvider>
        <StockDetails companyInfo={mockCompanyInfo} />
      </I18nProvider>
    );

    expect(getByText(mockCompanyInfo.description)).toBeTruthy();
    expect(getByText('セクター:')).toBeTruthy();
    expect(getByText('Technology')).toBeTruthy();
    expect(getByText('業種:')).toBeTruthy();
    expect(getByText('Consumer Electronics')).toBeTruthy();
    expect(getByText('時価総額:')).toBeTruthy();
    expect(getByText('2.8兆')).toBeTruthy(); // Formatted market cap
    expect(getByText('PER:')).toBeTruthy();
    expect(getByText('28.5')).toBeTruthy();
    expect(getByText('配当利回り:')).toBeTruthy();
    expect(getByText('0.56%')).toBeTruthy();
  });

  it('handles missing data gracefully with "N/A"', () => {
    const incompleteCompanyInfo: CompanyInfo = {
      description: "A company with incomplete data.",
      sector: null,
      industry: undefined,
      marketCap: null,
      peRatio: undefined,
      dividendYield: null,
    };

    const { getByText, queryByText } = render(
      <I18nProvider>
        <StockDetails companyInfo={incompleteCompanyInfo} />
      </I18nProvider>
    );

    expect(getByText(incompleteCompanyInfo.description)).toBeTruthy();
    expect(getByText('セクター:')).toBeTruthy();
    expect(getByText('N/A')).toBeTruthy();
    expect(getByText('業種:')).toBeTruthy();
    expect(getByText('N/A')).toBeTruthy();
    expect(getByText('時価総額:')).toBeTruthy();
    expect(getByText('N/A')).toBeTruthy();
    expect(getByText('PER:')).toBeTruthy();
    expect(getByText('N/A')).toBeTruthy();
    expect(getByText('配当利回り:')).toBeTruthy();
    expect(getByText('N/A')).toBeTruthy();
  });

  it('formats market cap correctly for billions', () => {
    const billionCompanyInfo: CompanyInfo = {
      ...mockCompanyInfo,
      marketCap: 123456789000, // 123.456 Billion
    };
    const { getByText } = render(
      <I18nProvider>
        <StockDetails companyInfo={billionCompanyInfo} />
      </I18nProvider>
    );
    expect(getByText('123.46億')).toBeTruthy();
  });

  it('formats market cap correctly for millions', () => {
    const millionCompanyInfo: CompanyInfo = {
      ...mockCompanyInfo,
      marketCap: 98765432, // 98.76 Million
    };
    const { getByText } = render(
      <I18nProvider>
        <StockDetails companyInfo={millionCompanyInfo} />
      </I18nProvider>
    );
    expect(getByText('9,876.54万')).toBeTruthy();
  });
});
