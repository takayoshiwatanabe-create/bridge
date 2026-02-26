```diff
--- a/components/stock/StockHeader.tsx
+++ b/components/stock/StockHeader.tsx
@@ -1,7 +1,7 @@
 import React, { useContext } from "react";
 import { View, Text, StyleSheet } from "react-native";
 import { I18nContext } from "@/i18n/I18nContext";
-import { DataBadge } from "@/src/components/ui/DataBadge"; // Corrected import path
+import { DataSourceBadge } from "@/components/DataSourceBadge";
 import { Instrument, MarketData } from "@/types";
 
 interface StockHeaderProps {
@@ -35,7 +35,7 @@
         </Text>
       </View>
 
-      <DataBadge // Changed to DataBadge as per spec
+      <DataSourceBadge
         source={marketData.dataSource}
         timestamp={marketData.timestamp}
         delayMinutes={marketData.delayMinutes}
```
