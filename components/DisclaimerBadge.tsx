import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { I18nContext } from "@/i18n/I18nContext"; // Import I18nContext

export function DisclaimerBadge() {
  const { t } = useContext(I18nContext); // Use useContext to get t

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

