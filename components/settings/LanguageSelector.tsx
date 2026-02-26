import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { I18nContext } from "@/i18n/I18nContext";
import { SUPPORTED_LANGUAGES, Language } from "@/i18n/translations";
import { FontAwesome } from "@expo/vector-icons";

export function LanguageSelector() {
  const { t, currentLanguage, setLanguage, isRTL } = useContext(I18nContext);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <View style={[styles.container, isRTL && styles.rtlContainer]}>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <TouchableOpacity
          key={lang}
          style={[
            styles.languageButton,
            currentLanguage === lang && styles.selectedLanguageButton,
            // Remove borderBottomWidth for the last item to prevent double border
            lang === SUPPORTED_LANGUAGES[SUPPORTED_LANGUAGES.length - 1] && styles.lastLanguageButton,
          ]}
          onPress={() => handleLanguageChange(lang)}
        >
          <Text
            style={[
              styles.languageButtonText,
              currentLanguage === lang && styles.selectedLanguageButtonText,
            ]}
          >
            {t(`language.${lang}`)}
          </Text>
          {currentLanguage === lang && (
            <FontAwesome
              name="check-circle"
              size={18}
              color="#007bff"
              style={isRTL ? styles.checkIconRTL : styles.checkIcon}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden", // Ensures borderRadius clips children borders
  },
  rtlContainer: {
    direction: "rtl",
  },
  languageButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastLanguageButton: {
    borderBottomWidth: 0, // No border for the last item
  },
  selectedLanguageButton: {
    backgroundColor: "#e6f2ff", // Light blue for selected
  },
  languageButtonText: {
    fontSize: 16,
    color: "#333",
  },
  selectedLanguageButtonText: {
    fontWeight: "bold",
    color: "#007bff",
  },
  checkIcon: {
    marginLeft: 10,
  },
  checkIconRTL: {
    marginRight: 10,
  },
});

