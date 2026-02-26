import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ title: "分の資産と市場の評価を最短距離でつなぐ "Bridge" (ブリッジ)" }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
