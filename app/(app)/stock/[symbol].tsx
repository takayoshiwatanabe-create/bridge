```diff
--- a/app/(app)/stock/[symbol].tsx
+++ b/app/(app)/stock/[symbol].tsx
@@ -4,7 +4,6 @@
 import { Stack, useLocalSearchParams } from "expo-router";
 import { I18nContext } from "@/i18n/I18nContext";
 import { DisclaimerBadge } from "@/components/DisclaimerBadge";
-import { DataBadge } from "@/src/components/ui/DataBadge"; // Corrected import path
 import { StockHeader } from "@/components/stock/StockHeader";
 import { StockDetails } from "@/components/stock/StockDetails";
 import { Instrument, MarketData } from "@/types";
```
