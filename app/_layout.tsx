import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nProvider } from "@/i18n/I18nProvider";
import { StyleSheet, View } from "react-native";
import { useContext } from "react";
import { I18nContext } from "@/i18n/I18nContext";

function RootLayoutContent() {
  const { isRTL, t } = useContext(I18nContext);

  return (
    <View style={[styles.container, isRTL && styles.rtlContainer]}>
      <Stack>
        <Stack.Screen name="index" options={{ title: t("home.title") }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
        <Stack.Screen name="(app)/portfolio" options={{ title: t("portfolio.title") }} />
        {/* Add other screens here as they are created */}
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <RootLayoutContent />
      </I18nProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rtlContainer: {
    direction: "rtl",
  },
});
