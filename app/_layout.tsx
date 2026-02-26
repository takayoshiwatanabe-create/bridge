import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nProvider } from "@/i18n/I18nProvider";
import { isRTL } from "@/i18n";
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <View style={[styles.container, isRTL && styles.rtlContainer]}>
          <Stack>
            <Stack.Screen name="index" options={{ title: "Bridge" }} />
            {/* Add other screens here as they are created */}
          </Stack>
        </View>
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
