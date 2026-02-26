import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Stack } from "expo-router";
import { I18nContext } from "@/i18n/I18nContext";
import { DisclaimerBadge } from "@/components/DisclaimerBadge";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import Constants from "expo-constants";

export default function SettingsScreen() {
  const { t, isRTL } = useContext(I18nContext);

  // Accessing `manifest` directly from `Constants` is deprecated in Expo SDK 49+.
  // Use `Constants.expoConfig?.version` for Expo Go or `Application.nativeApplicationVersion` for bare workflow.
  // For simplicity and to avoid adding `expo-application` dependency for this task,
  // we'll use `Constants.expoConfig?.version` which works in Expo Go.
  const appVersion = Constants.expoConfig?.version || "N/A";

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
    fontSize: 28, // H1: 32px, Bold - Adjusted to H1 spec
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333", // Text Primary
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
    fontSize: 20, // H3: 20px, Semi-Bold
    fontWeight: "bold", // Using bold for now, as semi-bold might require custom font loading
    marginBottom: 15,
    color: "#333", // Text Primary
  },
  linkButton: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  linkText: {
    fontSize: 16,
    color: "#007bff", // Primary color
  },
  versionText: {
    fontSize: 16,
    color: "#555",
  },
});

