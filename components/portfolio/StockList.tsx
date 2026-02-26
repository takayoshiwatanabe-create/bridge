import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { I18nContext } from "@/i18n/I18nContext";
import { PortfolioItem, MarketData } from "@/types";

interface StockListProps {
  items: PortfolioItem[];
  marketData: MarketData[];
}

export function StockList({ items, marketData }: StockListProps) {
  const { t, numberFormatter, isRTL } = useContext(I18nContext);

  const renderItem = ({ item }: { item: PortfolioItem }) => {
    const currentMarketData = marketData.find(
      (data) => data.instrumentId === item.instrument.id
    );

    const currentValue = currentMarketData
      ? item.quantity * currentMarketData.price
      : 0;
    const costBasis = item.quantity * item.averagePrice;
    const gainLoss = currentValue - costBasis;
    const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

    const gainLossColor = gainLoss >= 0 ? "#28a745" : "#dc3545"; // Green for gain, red for loss
    const changeColor = currentMarketData && currentMarketData.change >= 0 ? "#28a745" : "#dc3545";

    return (
      <View style={[styles.stockItem, isRTL && styles.rtlStockItem]}>
        <View style={styles.stockInfo}>
          <Text style={styles.stockSymbol}>{item.instrument.symbol}</Text>
          <Text style={styles.stockName}>{item.instrument.name}</Text>
        </View>

        <View style={styles.stockDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("portfolio.stock_list.quantity")}:</Text>
            <Text style={styles.detailValue}>{item.quantity}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("portfolio.stock_list.avg_price")}:</Text>
            <Text style={styles.detailValue}>
              {numberFormatter.format(item.averagePrice)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("portfolio.stock_list.current_price")}:</Text>
            <Text style={styles.detailValue}>
              {currentMarketData ? numberFormatter.format(currentMarketData.price) : t("common.na")}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("portfolio.stock_list.change")}:</Text>
            <Text style={[styles.detailValue, { color: changeColor }]}>
              {currentMarketData ? `${numberFormatter.format(currentMarketData.change)} (${numberFormatter.format(currentMarketData.changePercent)}%)` : t("common.na")}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("portfolio.stock_list.market_value")}:</Text>
            <Text style={styles.detailValue}>
              {numberFormatter.format(currentValue)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("portfolio.stock_list.gain_loss")}:</Text>
            <Text style={[styles.detailValue, { color: gainLossColor }]}>
              {numberFormatter.format(gainLoss)} ({numberFormatter.format(gainLossPercent)}%)
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.instrument.id}
      renderItem={renderItem}
      ListEmptyComponent={
        <Text style={styles.emptyListText}>{t("portfolio.stock_list.empty")}</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  stockItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  rtlStockItem: {
    direction: "rtl",
  },
  stockInfo: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  stockSymbol: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  stockName: {
    fontSize: 14,
    color: "#666",
  },
  stockDetails: {},
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: "#555",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});

