import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { I18nContext } from "@/i18n/I18nContext"; // Import I18nContext

interface DataSourceBadgeProps {
  source: string;
  timestamp: Date;
  delayMinutes: number;
}

export function DataSourceBadge({ source, timestamp, delayMinutes }: DataSourceBadgeProps) {
  const { t, lang } = useContext(I18nContext); // Use useContext to get t and lang

  // Ensure the locale for toLocaleTimeString is consistent or derived from i18n
  // Using the dynamically determined 'lang' for consistency.
  const formattedTime = timestamp.toLocaleTimeString(lang, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const delayText = delayMinutes > 0 ? `${delayMinutes}分` : t("common.realtime");

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
