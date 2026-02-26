import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { I18nContext } from "@/i18n/I18nContext";

interface DataSourceBadgeProps {
  source: string;
  timestamp: string; // Changed to string (ISO format)
  delayMinutes: number;
}

export function DataSourceBadge({ source, timestamp, delayMinutes }: DataSourceBadgeProps) {
  const { t, dateTimeFormatter } = useContext(I18nContext);

  // Parse the ISO string back to a Date object for formatting
  const dateObject = new Date(timestamp);
  const formattedTime = dateTimeFormatter.format(dateObject);
  const delayText = delayMinutes > 0 ? t("common.delay_minutes", { minutes: delayMinutes }) : t("common.realtime");

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {t("common.data_source", {
          source: source,
          time: formattedTime,
          delay: delayText,
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e0e0e0", // Light grey background
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginVertical: 8,
  },
  text: {
    fontSize: 12,
    color: "#555",
  },
});

