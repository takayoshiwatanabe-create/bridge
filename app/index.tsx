import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { useContext } from "react";
import { I18nContext } from "@/i18n/I18nContext";

export default function IndexScreen() {
  const { t } = useContext(I18nContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("home.title")}</Text>
      <Text style={styles.subtitle}>{t("home.subtitle")}</Text>

      <Link href="/(auth)/login" style={styles.link}>
        <Text style={styles.linkText}>{t("auth.login.title")}</Text>
      </Link>
      <Link href="/(auth)/signup" style={styles.link}>
        <Text style={styles.linkText}>{t("auth.signup.title")}</Text>
      </Link>
      <Link href="/(app)/portfolio" style={styles.link}>
        <Text style={styles.linkText}>{t("portfolio.title")}</Text>
      </Link>
      <Link href="/(app)/stock/AAPL" style={styles.link}>
        <Text style={styles.linkText}>{t("stock_detail.title")} (AAPL)</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f5f5f5", // Light background
  },
  title: {
    fontSize: 32, // H1: 32px, Bold
    fontWeight: "bold",
    marginBottom: 10,
    color: "#212529", // Text Primary
  },
  subtitle: {
    marginTop: 16,
    fontSize: 18,
    color: "#6c757d", // Text Secondary
    marginBottom: 30,
  },
  link: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007bff", // Primary color
    borderRadius: 8,
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

