import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { I18nContext } from "@/i18n/I18nContext";
import { Instrument, MarketData } from "@/types";

interface StockHeaderProps {
  instrument: Instrument;
  marketData: MarketData;
}

export function StockHeader({ instrument, marketData }: StockHeaderProps) {
  const { t, numberFormatter, isRTL } = useContext(I18nContext);

  const changeColor = marketData.change >= 0 ? "#28a745" : "#dc3545"; // Green for gain, red for loss

  return (
    <View style={[styles.container, isRTL && styles.rtlContainer]}>
      <Text style={styles.symbol}>{instrument.symbol}</Text>
      <Text style={styles.name}>{instrument.name}</Text>
      <Text style={styles.price}>{numberFormatter.format(marketData.price)} {instrument.currency}</Text>
      <Text style={[styles.change, { color: changeColor }]}>
        {numberFormatter.format(marketData.change)} ({numberFormatter.format(marketData.changePercent)}%)
      </Text>
      {/* DataBadge is rendered separately in the parent component, as per the original structure.
          If it should be part of the header, it needs to be moved here.
          For now, keeping it as is to match the provided structure. */}
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
    color: "#666",
    marginBottom: 10,
  },
  price: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  change: {
    fontSize: 20,
    fontWeight: "600",
  },
});
