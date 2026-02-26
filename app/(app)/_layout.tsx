import { Tabs } from "expo-router";
import React, { useContext } from "react";
import { I18nContext } from "@/i18n/I18nContext";
import { FontAwesome } from "@expo/vector-icons";
import { Platform } from "react-native";

export default function AppLayout() {
  const { t, isRTL } = useContext(I18nContext);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          direction: isRTL ? "rtl" : "ltr",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "#888",
      }}
    >
      <Tabs.Screen
        name="portfolio"
        options={{
          title: t("portfolio.title"),
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="briefcase"
              size={24}
              color={color}
              style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings.title"),
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="cog"
              size={24}
              color={color}
              style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stock/[symbol]"
        options={{
          href: null, // Hide this tab, it's for dynamic routing
          title: t("stock_detail.title"),
        }}
      />
    </Tabs>
  );
}

