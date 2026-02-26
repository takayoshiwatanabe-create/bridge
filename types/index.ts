// types/index.ts
export interface Instrument {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
}

export interface PortfolioItem {
  instrument: Instrument;
  quantity: number;
  averagePrice: number;
}

export interface MarketData {
  instrumentId: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: string; // ISO string
  dataSource: string;
  delayMinutes: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
}

export interface CompanyInfo {
  description: string;
  sector: string;
  industry: string;
  marketCap: number; // In base currency, e.g., USD
  peRatio: number;
  dividendYield: number; // As a percentage, e.g., 0.56 for 0.56%
}

