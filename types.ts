export interface Instrument {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
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

export interface PortfolioItem {
  instrument: Instrument;
  quantity: number;
  averagePrice: number;
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
  marketCap: number;
  peRatio: number;
  dividendYield: number;
}

