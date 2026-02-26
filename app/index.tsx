import { StyleSheet, Text, View } from "react-native";
import { useContext } from "react";
import { I18nContext } from "@/i18n/I18nContext"; // Import I18nContext

export default function HomeScreen() {
  const { t } = useContext(I18nContext); // Use useContext to get t

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("home.title")}</Text>
      <Text style={styles.subtitle}>{t("home.subtitle")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 16,
    fontSize: 18,
    color: "#666",
  },
});
