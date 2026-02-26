import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { I18nContext } from "@/i18n/I18nContext";
import { DisclaimerBadge } from "@/components/DisclaimerBadge";
import { DataBadge } from "@/components/ui/DataBadge"; // Corrected import path
import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary";
import { StockList } from "@/components/portfolio/StockList";
import { PortfolioItem, MarketData, PortfolioSummary as PortfolioSummaryType } from "@/types";

export default function PortfolioScreen() {
  const { t, isRTL } = useContext(I18nContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummaryType | null>(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
        {
          instrument: { id: "GOOGL_ID", symbol: "GOOGL", name: "Alphabet Inc. (Class A)", exchange: "NASDAQ", currency: "USD" },
          quantity: 2,
          averagePrice: 120.00,
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
        {
          instrumentId: "GOOGL_ID",
          price: 125.00,
          change: 0.75,
          changePercent: 0.60,
          timestamp: new Date().toISOString(),
          dataSource: "Quick",
          delayMinutes: 15,
        },
      ];

      // Calculate summary
      let totalValue = 0;
      let totalCostBasis = 0;

      mockPortfolioItems.forEach((item) => {
        const currentMarketData = mockMarketData.find(
          (data) => data.instrumentId === item.instrument.id
        );
        if (currentMarketData) {
          totalValue += item.quantity * currentMarketData.price;
        }
        totalCostBasis += item.quantity * item.averagePrice;
      });

      const totalGainLoss = totalValue - totalCostBasis;
      const totalGainLossPercent = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;

      setPortfolioItems(mockPortfolioItems);
      setMarketData(mockMarketData);
      setPortfolioSummary({
        totalValue,
        totalGainLoss,
        totalGainLossPercent,
      });
      setLoading(false);
    };

    fetchPortfolioData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>{t("common.loading")}</Text>
      </View>
    );
  }

  if (!portfolioSummary) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: t("portfolio.title") }} />
        <Text style={styles.errorText}>{t("common.error_loading_data")}</Text>
        <DisclaimerBadge />
      </View>
    );
  }

  return (
    <View style={[styles.container, isRTL && styles.rtlContainer]}>
      <Stack.Screen options={{ title: t("portfolio.title") }} />
      <DisclaimerBadge />

      <Text style={styles.header}>{t("portfolio.my_portfolio")}</Text>

      <PortfolioSummary summary={portfolioSummary} />

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>{t("portfolio.holdings")}</Text>
        {/* DataBadge is required for all price displays */}
        <DataBadge // Corrected component name
          source="Quick"
          timestamp={marketData[0]?.timestamp || new Date().toISOString()} // Use actual market data timestamp
          delayMinutes={marketData[0]?.delayMinutes || 15}
        />
        <StockList items={portfolioItems} marketData={marketData} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  rtlContainer: {
    direction: "rtl",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "red",
  },
  header: {
    fontSize: 28, // H1: 32px, Bold - Adjusted to H1 spec
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333", // Text Primary
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20, // H3: 20px, Semi-Bold
    fontWeight: "bold", // Using bold for now, as semi-bold might require custom font loading
    marginBottom: 10,
    color: "#333", // Text Primary
  },
});
