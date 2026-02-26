import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { t } from "@/i18n";

interface DataSourceBadgeProps {
  source: string;
  timestamp: Date;
  delayMinutes: number;
}

export function DataSourceBadge({ source, timestamp, delayMinutes }: DataSourceBadgeProps) {
  const formattedTime = timestamp.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const delayText = delayMinutes > 0 ? `${delayMinutes}分` : "リアルタイム";

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
