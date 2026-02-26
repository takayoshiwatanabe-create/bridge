/**
 * Shared types for the Bridge project.
 */

/**
 * Represents a financial instrument (e.g., stock, ETF).
 */
export interface Instrument {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  // Add more relevant fields as needed
}

/**
 * Represents a user's portfolio item.
 */
export interface PortfolioItem {
  instrument: Instrument;
  quantity: number;
  averagePrice: number; // Average purchase price
  // Add more relevant fields like purchase date, etc.
}

/**
 * Represents real-time or delayed market data for an instrument.
 */
export interface MarketData {
  instrumentId: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: Date;
  dataSource: string;
  delayMinutes: number;
  // Add more market data fields like volume, high, low, etc.
}

/**
 * Represents a user's portfolio summary.
 */
export interface PortfolioSummary {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  // Add more summary fields like dividends, cash, etc.
}

/**
 * Represents a user's profile.
 */
export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  language: string;
  isPremium: boolean;
  // Add more user-related fields
}

/**
 * Represents a feature flag for controlling premium features.
 */
export type FeatureFlag = "unlimited_stocks" | "realtime_data" | "consensus_score" | "target_price_analysis" | "post_tax_simulation" | "portfolio_health_check" | "csv_pdf_import" | "night_notifications" | "api_integration";

/**
 * Represents the status of a data fetch operation.
 */
export type DataStatus = "loading" | "success" | "error";
