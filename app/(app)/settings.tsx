import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Stack } from "expo-router";
import { I18nContext } from "@/i18n/I18nContext";
import { DisclaimerBadge } from "@/components/DisclaimerBadge";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import Constants from "expo-constants"; // Import Constants

export default function SettingsScreen() {
  const { t, isRTL } = useContext(I18nContext);

  const appVersion = Constants.manifest?.version || "N/A"; // Get app version from Constants

  const handleLinkPress = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error(`Don't know how to open this URL: ${url}`);
      // Optionally, show an alert to the user
    }
  };

  return (
    <ScrollView style={[styles.container, isRTL && styles.rtlContainer]}>
      <Stack.Screen options={{ title: t("settings.title") }} />
      <DisclaimerBadge />

      <Text style={styles.header}>{t("settings.title")}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>{t("settings.language_settings")}</Text>
        <LanguageSelector />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>{t("settings.legal_info")}</Text>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => handleLinkPress("https://www.example.com/privacy")} // Placeholder URL
        >
          <Text style={styles.linkText}>{t("settings.privacy_policy")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => handleLinkPress("https://www.example.com/terms")} // Placeholder URL
        >
          <Text style={styles.linkText}>{t("settings.terms_of_service")}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>{t("settings.app_version")}</Text>
        <Text style={styles.versionText}>{appVersion}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  rtlContainer: {
    direction: "rtl",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  section: {
    marginBottom: 25,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  linkButton: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  linkText: {
    fontSize: 16,
    color: "#007bff",
  },
  versionText: {
    fontSize: 16,
    color: "#555",
  },
});

