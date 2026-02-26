import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { I18nContext } from "@/i18n/I18nContext";
import { DisclaimerBadge } from "@/components/DisclaimerBadge";
import { DataSourceBadge } from "@/components/DataSourceBadge"; // Corrected import
import { StockHeader } from "@/components/stock/StockHeader";
import { StockDetails } from "@/components/stock/StockDetails";
import { Instrument, MarketData, CompanyInfo } from "@/types"; // Import CompanyInfo

export default function StockDetailScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const { t, isRTL } = useContext(I18nContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null); // Use CompanyInfo type

  useEffect(() => {
    if (!symbol) {
      setLoading(false);
      return;
    }

    const fetchStockData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data for AAPL
      if (symbol === "AAPL") {
        setInstrument({
          id: "AAPL_ID",
          symbol: "AAPL",
          name: "Apple Inc.",
          exchange: "NASDAQ",
          currency: "USD",
        });
        setMarketData({
          instrumentId: "AAPL_ID",
          price: 175.00,
          change: 1.50,
          changePercent: 0.86,
          timestamp: new Date().toISOString(),
          dataSource: "Quick",
          delayMinutes: 15,
        });
        setCompanyInfo({
          description: t("stock_detail.company_description_placeholder", { symbol: "Apple Inc." }),
          sector: "Technology",
          industry: "Consumer Electronics",
          marketCap: 2800000000000, // 2.8 Trillion
          peRatio: 28.5,
          dividendYield: 0.56,
        });
      } else {
        // Generic mock data for other symbols
        setInstrument({
          id: `${symbol}_ID`,
          symbol: symbol,
          name: `${symbol} Company`,
          exchange: "NYSE",
          currency: "USD",
        });
        setMarketData({
          instrumentId: `${symbol}_ID`,
          price: 100.00,
          change: 0.75,
          changePercent: 0.75,
          timestamp: new Date().toISOString(),
          dataSource: "Quick",
          delayMinutes: 15,
        });
        setCompanyInfo({
          description: t("stock_detail.company_description_placeholder", { symbol: `${symbol} Company` }),
          sector: "Diversified",
          industry: "General",
          marketCap: 100000000000, // 100 Billion
          peRatio: 15.0,
          dividendYield: 2.0,
        });
      }
      setLoading(false);
    };

    fetchStockData();
  }, [symbol, t]);

  if (!symbol) {
    return (
      <View style={[styles.container, isRTL && styles.rtlContainer]}>
        <Stack.Screen options={{ title: t("stock_detail.title") }} />
        <Text style={[styles.errorText, isRTL && styles.rtlText]}>{t("stock_detail.error.no_symbol")}</Text>
        <DisclaimerBadge />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>{t("common.loading")}</Text>
      </View>
    );
  }

  if (!instrument || !marketData || !companyInfo) {
    return (
      <View style={[styles.container, isRTL && styles.rtlContainer]}>
        <Stack.Screen options={{ title: t("stock_detail.title") }} />
        <Text style={[styles.errorText, isRTL && styles.rtlText]}>{t("common.error_loading_data")}</Text>
        <DisclaimerBadge />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, isRTL && styles.rtlContainer]}>
      <Stack.Screen options={{ title: instrument.name }} />

      <View style={styles.section}>
        <StockHeader instrument={instrument} marketData={marketData} />
        {/* DataBadge is required for all price displays */}
        <DataSourceBadge
          source={marketData.dataSource}
          timestamp={marketData.timestamp}
          delayMinutes={marketData.delayMinutes}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionHeader, isRTL && styles.rtlText]}>{t("stock_detail.chart_title")}</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>{t("stock_detail.chart_placeholder")}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionHeader, isRTL && styles.rtlText]}>{t("stock_detail.company_info_title")}</Text>
        <StockDetails companyInfo={companyInfo} />
      </View>

      <View style={styles.disclaimerContainer}>
        <DisclaimerBadge />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  rtlContainer: {
    direction: "rtl",
  },
  rtlText: {
    textAlign: "right",
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
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20, // H3: 20px, Semi-Bold
    fontWeight: "bold", // Using bold for now, as semi-bold might require custom font loading
    marginBottom: 10,
    color: "#333", // Text Primary
  },
  chartPlaceholder: {
    backgroundColor: "#e0e0e0",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  chartPlaceholderText: {
    fontSize: 16,
    color: "#777",
  },
  disclaimerContainer: {
    marginTop: 20,
    marginBottom: 40, // Give some space at the bottom
  },
});

