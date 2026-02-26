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
        <Stack.Screen name="(app)" options={{ headerShown: false }} /> {/* This is the Tabs layout */}
      </Stack>
      <StatusBar style="auto" />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <RootLayoutContent />
      </I18nProvider>
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
