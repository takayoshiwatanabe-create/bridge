import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { I18nContext } from "@/i18n/I18nContext";

interface DataSourceBadgeProps {
  source: string;
  timestamp: string; // ISO string
  delayMinutes: number;
}

export function DataSourceBadge({ source, timestamp, delayMinutes }: DataSourceBadgeProps) {
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
    marginBottom: 10, // Added margin bottom for better spacing
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
