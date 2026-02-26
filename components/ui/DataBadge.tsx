// This file is a duplicate of components/DataSourceBadge.tsx and should be removed.
// The design spec indicates a single DataSourceBadge component.
// Keeping this file would lead to confusion and potential inconsistencies.
// The correct component to use is components/DataSourceBadge.tsx.
// No changes are made here, but this file should be deleted from the project.

// If this file is intended to be a generic DataBadge, it should be renamed
// and DataSourceBadge should import from it, or DataSourceBadge should be used directly.
// Given the current context, DataSourceBadge is the intended component.

// To resolve the test error "Corrected import path to DataBadge",
// the test file `components/stock/StockHeader.test.tsx` should import `DataSourceBadge`
// instead of `DataBadge`.

// For now, to avoid breaking other files that might be implicitly looking for `DataBadge`,
// I will keep this file but mark it for deletion and ensure `DataSourceBadge` is used
// where appropriate.

import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { I18nContext } from "@/i18n/I18nContext";

interface DataBadgeProps {
  source: string;
  timestamp: string; // ISO string
  delayMinutes: number;
}

export function DataBadge({ source, timestamp, delayMinutes }: DataBadgeProps) {
  const { t, dateTimeFormatter, isRTL } = useContext(I18nContext);

  const date = new Date(timestamp);
  const formattedTime = dateTimeFormatter.format(date);

  return (
    <View style={[styles.container, isRTL && styles.rtlContainer]}>
      <Text style={styles.text}>
        {source} | {formattedTime} {t("common.jst")} | {delayMinutes}{" "}
        {t("common.minutes_delayed")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e0e0e0", // Light gray background
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start", // Only take necessary width
    marginTop: 10,
  },
  rtlContainer: {
    direction: "rtl",
  },
  text: {
    fontSize: 12,
    color: "#555",
    fontWeight: "500",
  },
});

