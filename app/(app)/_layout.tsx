import { Tabs } from "expo-router";
import React, { useContext } from "react";
import { I18nContext } from "@/i18n/I18nContext";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { StyleSheet } from "react-native";

export default function AppLayout() {
  const { t, isRTL } = useContext(I18nContext);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, isRTL && styles.tabBarRTL],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: "#007bff", // Primary color
        tabBarInactiveTintColor: "#6c757d", // Secondary color
        tabBarItemStyle: isRTL ? { flexDirection: 'row-reverse' } : undefined, // Adjust item direction for RTL
      }}
    >
      <Tabs.Screen
        name="portfolio"
        options={{
          title: t("portfolio.title"),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="briefcase" color={color} isRTL={isRTL} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t("search.title"),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="search" color={color} isRTL={isRTL} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings.title"),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="cog" color={color} isRTL={isRTL} />
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

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#f8f9fa", // Light background
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    height: 90, // Increased height for better touch targets and label visibility
    paddingBottom: 20, // Padding for safe area on newer phones
    paddingTop: 10,
  },
  tabBarRTL: {
    // For RTL, we need to ensure the direction is set on the tab bar itself
    // and individual items are handled by TabBarIcon if needed.
    // React Native's StyleSheet.create handles `direction` property correctly.
    direction: "rtl",
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
