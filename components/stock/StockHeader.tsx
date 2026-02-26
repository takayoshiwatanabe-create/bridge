import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { I18nContext } from "@/i18n/I18nContext";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { Instrument, MarketData } from "@/types";

interface StockHeaderProps {
  instrument: Instrument;
  marketData: MarketData;
}

export function StockHeader({ instrument, marketData }: StockHeaderProps) {
  const { t, numberFormatter, isRTL } = useContext(I18nContext);

  const priceColor = marketData.change >= 0 ? "#28a745" : "#dc3545"; // Green for gain, red for loss

  return (
    <View style={[styles.container, isRTL && styles.rtlContainer]}>
      <Text style={styles.symbol}>{instrument.symbol}</Text>
      <Text style={styles.name}>{instrument.name}</Text>
      <Text style={styles.exchange}>{instrument.exchange}</Text>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>{numberFormatter.format(marketData.price)}</Text>
        <Text style={[styles.change, { color: priceColor }]}>
          {marketData.change >= 0 ? "+" : ""}
          {numberFormatter.format(marketData.change)} (
          {marketData.changePercent >= 0 ? "+" : ""}
          {numberFormatter.format(marketData.changePercent)}%)
        </Text>
      </View>

      <DataSourceBadge
        source={marketData.dataSource}
        timestamp={marketData.timestamp}
        delayMinutes={marketData.delayMinutes}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  rtlContainer: {
    direction: "rtl",
  },
  symbol: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  name: {
    fontSize: 18,
    color: "#555",
    marginBottom: 5,
  },
  exchange: {
    fontSize: 14,
    color: "#888",
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginRight: 10,
  },
  change: {
    fontSize: 18,
    fontWeight: "600",
  },
});
