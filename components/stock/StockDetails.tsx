import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { I18nContext } from "@/i18n/I18nContext";
import { CompanyInfo } from "@/types"; // Import CompanyInfo from types

interface StockDetailsProps {
  companyInfo: CompanyInfo;
}

export function StockDetails({ companyInfo }: StockDetailsProps) {
  const { t, numberFormatter, isRTL } = useContext(I18nContext);

  const formatMarketCap = (value: number): string => {
    if (value >= 1_000_000_000_000) {
      return `${numberFormatter.format(value / 1_000_000_000_000)} ${t("common.trillion")}`;
    }
    if (value >= 1_000_000_000) {
      return `${numberFormatter.format(value / 1_000_000_000)} ${t("common.billion")}`;
    }
    if (value >= 1_000_000) {
      return `${numberFormatter.format(value / 1_000_000)} ${t("common.million")}`;
    }
    return numberFormatter.format(value);
  };

  return (
    <View style={[styles.container, isRTL && styles.rtlContainer]}>
      <Text style={styles.description}>{companyInfo.description}</Text>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t("stock_detail.company_info.sector")}:</Text>
        <Text style={styles.detailValue}>{companyInfo.sector}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t("stock_detail.company_info.industry")}:</Text>
        <Text style={styles.detailValue}>{companyInfo.industry}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t("stock_detail.company_info.market_cap")}:</Text>
        <Text style={styles.detailValue}>{formatMarketCap(companyInfo.marketCap)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t("stock_detail.company_info.pe_ratio")}:</Text>
        <Text style={styles.detailValue}>{numberFormatter.format(companyInfo.peRatio)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t("stock_detail.company_info.dividend_yield")}:</Text>
        <Text style={styles.detailValue}>{numberFormatter.format(companyInfo.dividendYield)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  rtlContainer: {
    direction: "rtl",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
  },
});
