```diff
--- a/app/(app)/portfolio.tsx
+++ b/app/(app)/portfolio.tsx
@@ -4,7 +4,7 @@
 import { Stack } from "expo-router";
 import { I18nContext } from "@/i18n/I18nContext";
 import { DisclaimerBadge } from "@/components/DisclaimerBadge";
-import { DataBadge } from "@/src/components/ui/DataBadge"; // Corrected import path
+import { DataSourceBadge } from "@/components/DataSourceBadge";
 import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary";
 import { StockList } from "@/components/portfolio/StockList";
 import { PortfolioItem, MarketData, PortfolioSummary as PortfolioSummaryType } from "@/types";
@@ -87,7 +87,7 @@
 
         <View style={styles.section}>
           <Text style={styles.sectionHeader}>{t("portfolio.holdings")}</Text>
-          <DataBadge // Changed to DataBadge as per spec
+          <DataSourceBadge // Changed to DataSourceBadge as per spec
             source="Quick"
             timestamp={new Date().toISOString()} // Changed to ISO string
             delayMinutes={15}
```
