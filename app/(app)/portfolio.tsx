import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { I18nContext } from "@/i18n/I18nContext";
import { DisclaimerBadge } from "@/components/DisclaimerBadge";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary";
import { StockList } from "@/components/portfolio/StockList";
import { PortfolioItem, MarketData, PortfolioSummary as PortfolioSummaryType } from "@/types";

export default function PortfolioScreen() {
  const { t } = useContext(I18nContext);

  // --- Placeholder Data ---
  // In a real application, this data would come from an API.
  // For now, we use mock data to build the UI.

  const mockPortfolioItems: PortfolioItem[] = [
    {
      instrument: {
        id: "1",
        symbol: "AAPL",
        name: "Apple Inc.",
        exchange: "NASDAQ",
        currency: "USD",
      },
      quantity: 10,
      averagePrice: 150.00,
    },
    {
      instrument: {
        id: "2",
        symbol: "MSFT",
        name: "Microsoft Corp.",
        exchange: "NASDAQ",
        currency: "USD",
      },
      quantity: 5,
      averagePrice: 280.00,
    },
    {
      instrument: {
        id: "3",
        symbol: "TSLA",
        name: "Tesla Inc.",
        exchange: "NASDAQ",
        currency: "USD",
      },
      quantity: 2,
      averagePrice: 700.00,
    },
  ];

  const mockMarketData: MarketData[] = [
    {
      instrumentId: "1",
      price: 175.50,
      change: 2.50,
      changePercent: 1.45,
      timestamp: new Date(), // Changed to Date object
      dataSource: "Quick",
      delayMinutes: 15,
    },
    {
      instrumentId: "2",
      price: 305.20,
      change: -1.80,
      changePercent: -0.59,
      timestamp: new Date(), // Changed to Date object
      dataSource: "Quick",
      delayMinutes: 15,
    },
    {
      instrumentId: "3",
      price: 710.00,
      change: 10.00,
      changePercent: 1.43,
      timestamp: new Date(), // Changed to Date object
      dataSource: "Quick",
      delayMinutes: 15,
    },
  ];

  // Calculate mock portfolio summary
  const calculatePortfolioSummary = (
    items: PortfolioItem[],
    marketData: MarketData[]
  ): PortfolioSummaryType => {
    let totalValue = 0;
    let totalCost = 0;

    items.forEach((item) => {
      const currentMarketData = marketData.find(
        (data) => data.instrumentId === item.instrument.id
      );
      if (currentMarketData) {
        totalValue += item.quantity * currentMarketData.price;
      }
      totalCost += item.quantity * item.averagePrice;
    });

    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

    return {
      totalValue,
      totalGainLoss,
      totalGainLossPercent,
    };
  };

  const mockPortfolioSummary = calculatePortfolioSummary(
    mockPortfolioItems,
    mockMarketData
  );
  // --- End Placeholder Data ---

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: t("portfolio.title") }} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>{t("portfolio.my_portfolio")}</Text>

        <PortfolioSummary summary={mockPortfolioSummary} />

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>{t("portfolio.holdings")}</Text>
          <DataSourceBadge
            source="Quick"
            timestamp={new Date()} // Pass Date object for display
            delayMinutes={15}
          />
          <StockList items={mockPortfolioItems} marketData={mockMarketData} />
        </View>

        {/* Add more sections as needed, e.g., charts, news, etc. */}

        <View style={styles.disclaimerContainer}>
          <DisclaimerBadge />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollViewContent: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  section: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  disclaimerContainer: {
    marginTop: 30,
    alignItems: "center",
  },
});
