import React, { useContext, ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { I18nContext } from "@/i18n/I18nContext";
import { UpgradePrompt } from "./UpgradePrompt";

interface PremiumFeatureGateProps {
  featureKey: string; // A key representing the feature, e.g., "realtime_data", "unlimited_stocks"
  children: ReactNode;
  isPremiumUser: boolean; // This would typically come from a user context or API
}

export function PremiumFeatureGate({
  featureKey,
  children,
  isPremiumUser,
}: PremiumFeatureGateProps) {
  const { t, isRTL } = useContext(I18nContext);

  // In a real application, this logic would be more sophisticated,
  // potentially checking a feature flag map from the server.
  // For now, we'll use a simple hardcoded check based on featureKey.
  const isFeaturePremium = (key: string): boolean => {
    switch (key) {
      case "unlimited_stocks":
      case "realtime_data":
      case "consensus_score":
      case "target_price_analysis":
      case "tax_simulation":
      case "portfolio_health_check":
      case "csv_pdf_import":
      case "night_notifications":
      case "api_integration":
        return true;
      default:
        return false;
    }
  };

  if (isPremiumUser || !isFeaturePremium(featureKey)) {
    return <>{children}</>;
  }

  return (
    <View style={[styles.container, isRTL && styles.rtlContainer]}>
      <Text style={styles.lockedText}>
        <Text style={styles.premiumBadge}>{t("premium.badge")}</Text>{" "}
        {t("premium.feature_locked", { feature: t(`premium.features.${featureKey}`) })}
      </Text>
      <UpgradePrompt />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff3cd", // Light yellow background for warning
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ffeeba",
    alignItems: "center",
  },
  rtlContainer: {
    direction: "rtl",
  },
  lockedText: {
    fontSize: 16,
    color: "#856404", // Dark yellow text
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  premiumBadge: {
    backgroundColor: "#007bff",
    color: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 5,
    overflow: "hidden", // Ensures borderRadius is visible
  },
});

