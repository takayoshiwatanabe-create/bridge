import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { I18nContext } from "@/i18n/I18nContext";
import { PortfolioSummary as PortfolioSummaryType } from "@/types";

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
}

export function PortfolioSummary({ summary }: PortfolioSummaryProps) {
  const { t, numberFormatter, isRTL } = useContext(I18nContext);

  const gainLossColor = summary.totalGainLoss >= 0 ? "#28a745" : "#dc3545"; // Green for gain, red for loss

  return (
    <View style={[styles.container, isRTL && styles.rtlContainer]}>
      <Text style={styles.label}>{t("portfolio.summary.total_value")}</Text>
      <Text style={styles.value}>
        {numberFormatter.format(summary.totalValue)}
      </Text>

      <View style={styles.row}>
        <Text style={styles.label}>{t("portfolio.summary.total_gain_loss")}</Text>
        <Text style={[styles.valueSmall, { color: gainLossColor }]}>
          {numberFormatter.format(summary.totalGainLoss)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>{t("portfolio.summary.total_gain_loss_percent")}</Text>
        <Text style={[styles.valueSmall, { color: gainLossColor }]}>
          {numberFormatter.format(summary.totalGainLossPercent)}%
        </Text>
      </View>
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
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  value: {
    fontSize: 24, // H2 style
    fontWeight: "bold",
    color: "#333", // Primary Text Color
    marginBottom: 15,
  },
  valueSmall: {
    fontSize: 20, // H3 style
    fontWeight: "bold", // Using bold for now, as semi-bold might require custom font loading
    color: "#333", // Primary Text Color (will be overridden by gainLossColor)
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});
