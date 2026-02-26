import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { I18nContext } from "@/i18n/I18nContext";
import { useRouter } from "expo-router";

export function UpgradePrompt() {
  const { t, isRTL } = useContext(I18nContext);
  const router = useRouter();

  const handleUpgradePress = () => {
    // Navigate to a dedicated upgrade screen or subscription management page
    console.log("Navigating to upgrade screen...");
    // router.push("/(app)/upgrade"); // Example route
  };

  return (
    <View style={[styles.container, isRTL && styles.rtlContainer]}>
      <Text style={styles.title}>{t("premium.upgrade_prompt.title")}</Text>
      <Text style={styles.description}>{t("premium.upgrade_prompt.description")}</Text>
      <TouchableOpacity style={styles.button} onPress={handleUpgradePress}>
        <Text style={styles.buttonText}>{t("premium.upgrade_prompt.button_text")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e6f2ff", // Light blue background
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  rtlContainer: {
    direction: "rtl",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0056b3", // Darker blue
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#007bff", // Primary color
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

