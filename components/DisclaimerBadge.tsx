import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { t } from "@/i18n";

export function DisclaimerBadge() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t("common.disclaimer_badge")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffeb3b", // Yellow background for visibility
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start", // Only take necessary width
    marginVertical: 8,
  },
  text: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
});
