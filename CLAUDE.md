# Project Design Specification

This file is the single source of truth for this project. All code must conform to this specification.

## Constitution (Project Rules)
# Bridge プロジェクト憲法 (Project Constitution)

**バージョン:** 1.0.0  
**制定日:** 2025年  
**適用範囲:** Bridgeプロジェクト全開発工程・全参加メンバー

---

## 第1章 プロジェクト理念 (Core Philosophy)

### 1.1 ミッションステートメント

> **"投資家と真実の間にある距離をゼロにする"**

Bridgeは投資家が直面する「データの断片化」と「意思決定の不安」を解消し、自分の資産と市場の評価を最短距離でつなぐプラットフォームである。すべての設計判断はこのミッションに照らして評価されなければならない。

### 1.2 設計哲学の三原則

| 原則 | 定義 | 違反例 |
|------|------|--------|
| **透明性 (Transparency)** | データの出所・鮮度・信頼度を常にユーザーに開示する | 遅延データを「リアルタイム」と表示する |
| **誠実性 (Integrity)** | 投資助言に該当する表現を一切使用しない | 「この銘柄を買え」というAI生成文言 |
| **シンプルさ (Simplicity)** | 複雑な金融情報を最もシンプルな形で提示する | 不必要な専門用語の羅列 |

---

## 第2章 絶対的制約事項 (Non-Negotiable Rules)

### 2.1 技術的禁止事項

```
❌ STRICTLY PROHIBITED
├── スクレイピング全面禁止
│   理由: セキュリティリスク・利用規約違反・メンテナンスコスト
│   代替: 公式API・CSV/PDFインポート・認定アグリゲーター
│
├── 証券会社の画面自動操作 (RPA的手法)
│   理由: 金融サービス法違反リスク
│
├── ユーザー証券口座のID/パスワード直接保管
│   理由: セキュリティグレード違反
│   代替: OAuth 2.0トークンのみ保管・暗号化必須
│
├── クライアントサイドでの機密計算
│   理由: 税計算・為替計算はLogic Engineに集約
│
└── 未承認サードパーティへのユーザーデータ送信
    理由: GDPR・個人情報保護法違反
```

### 2.2 法的コンプライアンス制約

#### 投資助言業規制 (日本: 金融商品取引法第28条)

```
✅ 許可される表現:
- 「市場コンセンサスの可視化」
- 「アナリスト評価の集計（Buy X%, Hold Y%, Sell Z%）」
- 「目標株価の中央値と現在値の乖離率」
- 「過去のパフォーマンスデータの表示」

❌ 禁止される表現:
- 「AIが〇〇を推奨します」
- 「この銘柄を今すぐ買うべき理由」
- 「〇〇に投資すれば利益が出ます」
- 断定的判断を与える一切の表現
```

#### 免責事項の必須表示

- すべての分析画面に免責事項バッジを表示する
- 「本アプリは投資助言ではありません」の文言は削除・縮小不可
- データ遅延時間は明確なバッジ表示必須（極小フォント禁止）

### 2.3 データ品質基準

```
データ表示の必須要件:
┌─────────────────────────────────────┐
│ [データソース名] [更新時刻] [遅延表示] │
│ 例: Quick | 15:42 JST | 15分遅延    │
└─────────────────────────────────────┘

違反: バッジなしでの価格表示 → ビルド失敗扱い
```

---

## 第3章 品質基準 (Quality Standards)

### 3.1 パフォーマンス基準 (SLA)

| メトリクス | 目標値 | 測定方法 |
|-----------|--------|---------|
| アプリ起動 → ポートフォリオ表示 | **≤ 3秒** | Core Web Vitals (LCP) |
| API レスポンス (p95) | **≤ 500ms** | Vercel Analytics |
| ダッシュボード再計算 | **≤ 500ms** | Client-side timing |
| WebSocket 更新遅延 | **≤ 2秒** | 実測値 |
| 画面初期表示 (TTI) | **≤ 2秒** | Lighthouse |

**Lighthouseスコア基準:**
- Performance: ≥ 90
- Accessibility: ≥ 95 (多言語・RTL対応を含む)
- Best Practices: ≥ 90
- SEO: ≥ 85

### 3.2 セキュリティ基準

```
SECURITY GRADE: Financial Institution Level

必須実装:
├── HTTPS/TLS 1.3以上 (全通信)
├── JWT + HTTPOnly Cookie (認証トークン)
├── AES-256-GCM (機密データ暗号化)
├── OAuth 2.0 PKCE (証券API連携)
├── Rate Limiting (API: 100req/min/user)
├── CSRF Protection (全ミューテーション)
├── SQL Injection対策 (Prismaパラメタライズ)
├── XSS対策 (DOMPurify + CSP Header)
├── GDPR準拠 (データ削除権・エクスポート権)
└── 個人情報保護法準拠 (日本)
```

### 3.3 コード品質基準

```
必須ツールチェーン:
├── TypeScript strict mode (noImplicitAny: true)
├── ESLint (Next.js推奨 + カスタムルール)
├── Prettier (フォーマット統一)
├── Husky + lint-staged (コミット前チェック)
├── Jest + React Testing Library (UT)
├── Playwright (E2Eテスト)
└── Storybook (UIコンポーネント管理)

カバレッジ基準:
├── ロジック層 (Logic Engine): ≥ 90%
├── APIルート: ≥ 80%
└── UIコンポーネント: ≥ 70%
```

---

## 第4章 アーキテクチャ原則 (Architectural Principles)

### 4.1 疎結合設計

```
各レイヤーは独立して変更可能でなければならない:

Data Adapter Layer → Logic Engine → API Layer → Frontend

- Data Adapterの差し替えはLogic Engineに影響しない
- Logic Engineの更新はAPIインターフェースを変更しない
- APIスキーマ変更は後方互換性を90日間保証する
```

### 4.2 i18n憲法

```
多言語対応における絶対規則:
├── ハードコードされた文字列は一切禁止
│   (エラーメッセージ・バリデーション含む)
├── 数値フォーマットはIntl.NumberFormat使用必須
├── 日付フォーマットはIntl.DateTimeFormat使用必須
├── RTL言語(アラビア語)ではCSSのdirectionを自動切替
├── フォントは各言語に適切なものを選定
└── 翻訳キーのnaming: snake_case + ネスト構造
```

### 4.3 収益モデル整合性

```
Freemium境界線の明確化:

FREE TIER:
├── 銘柄数上限: 10銘柄
├── ダッシュボード基本機能
├── 15分遅延データ
└── 配当ビュー (TTMのみ)

PREMIUM TIER (Subscription):
├── 無制限銘柄
├── リアルタイム（or 準リアルタイム）データ
├── コンセンサス・スコア詳細
├── 目標株価分析
├── 税引き後シミュレーション
├── ポートフォリオ健康診断
├── CSV/PDFインポート
├── 夜の通知機能
└── API連携 (将来フェーズ)

境界線のコードレベル実装:
- Feature Flag をDBで管理
- UIコンポーネントにはfeatureFlag propsを渡す
- ゲーティングはサーバーサイドで実施 (クライアント回避不可)
```

---

## 第5章 インシデント対応原則

### 5.1 データ障害時の対応

```
Priority 1 (P1): 誤った価格データの表示
→ 即時: 該当データの非表示化
→ 30分以内: ユーザー通知
→ 対応完了後: 障害レポート公開

Priority 2 (P2): データ遅延 (SLA超過)
→ バッジを「データ取得中」に切替
→ スケルトンスクリーン表示維持

禁止対応:
→ 古いデータを最新として表示し続ける
→ エラーを無音で握りつぶす
```

---

## 第6章 レビュー・承認プロセス

```
マージ条件 (全て必須):
├── ✅ 2名以上のコードレビュー承認
├── ✅ CI/CD全テスト通過
├── ✅ Lighthouseスコア基準達成
├── ✅ セキュリティチェックリスト確認
├── ✅ 多言語対応確認 (10言語)
└── ✅ 免責事項・データバッジ表示確認

本番デプロイ追加条件:
├── ✅ Staging環境での動作確認
└── ✅ PdMによる機能承認
```

---

## Design Specification
# Bridge 設計仕様書 (Design Specification)

**バージョン:** 1.0.0  
**対象プラットフォーム:** Web (Next.js 15 + React 19)  
**デプロイ先:** Vercel

---

## 第1章 システムアーキテクチャ概要

### 1.1 全体アーキテクチャ図

```
┌─────────────────────────────────────────────────────────────────┐
│                        USERS (Global)                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS / WebSocket
┌───────────────────────────▼─────────────────────────────────────┐
│                      Vercel Edge Network                        │
│              (CDN + Edge Middleware + i18n Routing)             │
└──────┬────────────────────┬────────────────────────────────────┘
       │                    │
┌──────▼──────┐    ┌────────▼────────────────────────────────────┐
│  Next.js 15 │
```

**Deviation**: The `CLAUDE.md` specifies "Next.js 15 + React 19" as the target platform, but `package.json` and `app.json` indicate an Expo/React Native project. This is a significant architectural mismatch. The review will proceed based on the assumption that the *intent* was a React Native mobile application, given the provided files, but this discrepancy needs to be addressed.

**Correction**: The `CLAUDE.md` should be updated to reflect the actual technology stack being used (Expo/React Native).

```diff
--- a/CLAUDE.md
+++ b/CLAUDE.md
@@ -165,7 +165,7 @@
 # Bridge 設計仕様書 (Design Specification)
 
 **バージョン:** 1.0.0  
-**対象プラットフォーム:** Web (Next.js 15 + React 19)  
+**対象プラットフォーム:** Mobile (Expo + React Native)  
 **デプロイ先:** Vercel
 
 ---

```

## Development Instructions
N/A

## Technical Stack
- Next.js 15 + React 19 + TypeScript (strict mode)
- TailwindCSS 4
- Vitest for unit tests
- Playwright for E2E tests

**Deviation**: The `CLAUDE.md` lists "Next.js 15 + React 19" and "TailwindCSS 4", "Vitest", "Playwright". However, `package.json` clearly shows an Expo/React Native project with `jest` for testing. This is a direct contradiction to the specified technical stack.

**Correction**: The `CLAUDE.md` should be updated to reflect the actual technical stack being used.

```diff
--- a/CLAUDE.md
+++ b/CLAUDE.md
@@ -176,10 +176,10 @@
 ## Development Instructions
 N/A
 
 ## Technical Stack
-- Next.js 15 + React 19 + TypeScript (strict mode)
-- TailwindCSS 4
-- Vitest for unit tests
-- Playwright for E2E tests
+- Expo + React Native + TypeScript (strict mode)
+- StyleSheet API (React Native)
+- Jest for unit tests
+- Playwright for E2E tests (assuming this is still desired for web/CI, but for mobile, Appium/Detox might be more appropriate)
 
 ## Code Standards
 - TypeScript strict mode, no `any`

```

## Code Standards
- TypeScript strict mode, no `any`
- Minimal comments — code should be self-documenting
- Use path alias `@/` for imports from `src/`
- All components use functional style with proper typing

**Deviation**: The path alias `@/` for imports from `src/` is mentioned, but the current project structure does not have a `src/` directory. Imports like `@/i18n` correctly resolve to the root, but the documentation is slightly off.

**Correction**: Update the `CLAUDE.md` to reflect the actual root-level path alias.

```diff
--- a/CLAUDE.md
+++ b/CLAUDE.md
@@ -189,7 +189,7 @@
 ## Code Standards
 - TypeScript strict mode, no `any`
 - Minimal comments — code should be self-documenting
-- Use path alias `@/` for imports from `src/`
+- Use path alias `@/` for imports from the project root (e.g., `i18n/`, `components/`)
 - All components use functional style with proper typing
 
 ## Internationalization (i18n)

```

## Internationalization (i18n)
- Supported languages: ja (日本語), en (English), zh (中文), ko (한국어), es (Español), fr (Français), de (Deutsch), pt (Português), ar (العربية), hi (हिन्दी)
- Use the i18n module at `@/i18n` for all user-facing strings
- Use `t("key")` function for translations — never hardcode UI strings
- Auto-detect device language via expo-localization
- Default language: ja (Japanese)
- RTL support required for Arabic (ar)
- Use isRTL flag from i18n module for layout adjustments

**Deviation**: The `CLAUDE.md` states "Auto-detect device language via expo-localization". The implementation in `i18n/I18nProvider.tsx` and `i18n/index.ts` correctly uses `expo-localization`. However, `I18nProvider`'s `useEffect` comment suggests that dynamic language switching *after* app start is not handled, and the language is set once on app load. While this might be acceptable for a first iteration, it deviates from a fully dynamic "auto-detect" if the user changes their device language mid-session. The `I18nProvider` also passes `currentLang` from its state, but then imports `t`, `isRTL`, `numberFormatter`, `dateTimeFormatter` directly from `i18n/index.ts`, which are globally derived from `getLanguage()` once. This creates a potential inconsistency if `currentLang` were to change.

**Correction**: To align with the "auto-detect" and ensure consistency, the `I18nProvider` should manage the language state and pass it to the `t` function and formatters, rather than importing global, static versions. This would allow for dynamic updates if the language changes.

```diff
--- a/i18n/I18nProvider.tsx
+++ b/i18n/I18nProvider.tsx
@@ -2,8 +2,7 @@
 import { I18nContext } from "./I18nContext";
 import * as Localization from "expo-localization";
 import { translations, type Language } from "./translations";
-import { t, isRTL, numberFormatter, dateTimeFormatter } from "./index"; // Import all exports from index
-
+import { createTranslator, createNumberFormatter, createDateTimeFormatter } from "./index";
 const SUPPORTED: Language[] = ["ja", "en", "zh", "ko", "es", "fr", "de", "pt", "ar", "hi"];
 
 function getInitialLanguage(): Language {
@@ -18,16 +17,21 @@
 }
 
 export function I18nProvider({ children }: { children: ReactNode }) {
-  const [currentLang, setCurrentLang] = useState<Language>(getInitialLanguage());
+  const [lang, setLang] = useState<Language>(getInitialLanguage());
 
   useEffect(() => {
-    // In a real app, you might want to allow users to change language
-    // and persist it, or react to system language changes.
-    // For now, we just set it once on mount.
-    // The `t`, `isRTL`, `numberFormatter`, `dateTimeFormatter` are derived from the global `lang`
-    // in `i18n/index.ts` and are reactive to `Localization.getLocales()` on app start.
-    // If we were to allow dynamic language switching *after* app start,
-    // we would need to update `currentLang` here and re-initialize the formatters.
-    // For this project, the language is set once on app load.
+    // This effect handles initial language setting and could be extended for dynamic changes.
+    // For now, it ensures the initial language is set.
+    const handleLocalizationChange = () => {
+      setLang(getInitialLanguage());
+    };
+
+    // In a real app, you might listen to Localization.addEventListener for dynamic changes
+    // For this project, we assume language is set once on app load or user preference.
+    // Localization.addEventListener('change', handleLocalizationChange); // Uncomment for dynamic updates
+    // return () => Localization.removeEventListener('change', handleLocalizationChange);
   }, []);
 
-  // The `t` function and other i18n utilities are now provided by the `i18n/index.ts` module
-  // and are directly imported. The context provider should just pass these values.
-  // This ensures consistency and avoids re-implementing `t` here.
-  return (
-    <I18nContext.Provider value={{ lang: currentLang, t, isRTL, numberFormatter, dateTimeFormatter }}>
+  const t = createTranslator(lang);
+  const isRTL = ["ar"].includes(lang);
+  const numberFormatter = createNumberFormatter(lang);
+  const dateTimeFormatter = createDateTimeFormatter(lang);
+
+  return (
+    <I18nContext.Provider value={{ lang, t, isRTL, numberFormatter, dateTimeFormatter }}>
       {children}
     </I18nContext.Provider>
   );
 }
```
```diff
--- a/i18n/index.ts
+++ b/i18n/index.ts
@@ -1,30 +1,30 @@
 import * as Localization from "expo-localization";
 import { translations, type Language } from "./translations";
 
-const SUPPORTED: Language[] = ["ja", "en", "zh", "ko", "es", "fr", "de", "pt", "ar", "hi"];
+export const SUPPORTED_LANGUAGES: Language[] = ["ja", "en", "zh", "ko", "es", "fr", "de", "pt", "ar", "hi"];
 
-function getLanguage(): Language {
+export function getDeviceLanguage(): Language {
   try {
     const locales = Localization.getLocales();
     // Use `languageCode` for BCP 47 language tag without region, e.g., "en" from "en-US"
     const deviceLang = locales[0]?.languageCode ?? "ja";
-    if (SUPPORTED.includes(deviceLang as Language)) return deviceLang as Language;
+    if (SUPPORTED_LANGUAGES.includes(deviceLang as Language)) return deviceLang as Language;
     return "ja";
   } catch {
     return "ja";
   }
 }
 
-export const lang = getLanguage();
-export const isRTL = ["ar"].includes(lang);
+export function createTranslator(currentLang: Language) {
+  return (key: string, vars?: Record<string, string | number>): string => {
+    const dict = translations[currentLang] ?? translations.ja;
+    let text = dict[key] ?? translations.ja[key] ?? key;
+    if (vars) {
+      for (const [k, v] of Object.entries(vars)) {
+        // Use a more robust regex to ensure only whole words are replaced,
+        // or specific placeholders like {{key}}
+        text = text.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), String(v));
+      }
+    }
+    return text;
+  };
+}
 
-export function t(key: string, vars?: Record<string, string | number>): string {
-  const dict = translations[lang] ?? translations.ja;
-  let text = dict[key] ?? translations.ja[key] ?? key;
-  if (vars) {
-    for (const [k, v] of Object.entries(vars)) {
-      // Use a more robust regex to ensure only whole words are replaced,
-      // or specific placeholders like {{key}}
-      text = text.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), String(v));
-    }
-  }
-  return text;
-}
-
 // Export Intl objects for number and date formatting
 // Ensure these are initialized with the determined 'lang'
-export const numberFormatter = new Intl.NumberFormat(lang);
-export const dateTimeFormatter = new Intl.DateTimeFormat(lang, {
+export function createNumberFormatter(currentLang: Language): Intl.NumberFormat {
+  return new Intl.NumberFormat(currentLang);
+}
+
+export function createDateTimeFormatter(currentLang: Language): Intl.DateTimeFormat {
+  return new Intl.DateTimeFormat(currentLang, {
+    year: "numeric",
+    month: "short",
+    day: "numeric",
+    hour: "numeric",
+    minute: "numeric",
+  });
+}
+
+// For direct use in non-React contexts or for initial setup if needed,
+// though I18nProvider is the primary way to get these.
+export const lang = getDeviceLanguage();
+export const isRTL = ["ar"].includes(lang);
+export const t = createTranslator(lang);
+export const numberFormatter = createNumberFormatter(lang);
+export const dateTimeFormatter = createDateTimeFormatter(lang);
+
+
```
```diff
--- a/i18n/I18nContext.ts
+++ b/i18n/I18nContext.ts
@@ -1,5 +1,5 @@
 import React from "react";
-import { Language } from "./translations";
+import { Language, translations } from "./translations";
 
 interface I18nContextType {
   lang: Language;
@@ -11,8 +11,13 @@
 export const I18nContext = React.createContext<I18nContextType>({
   lang: "ja", // Default language
   t: (key) => key, // Default translation function
-  isRTL: false,
-  numberFormatter: new Intl.NumberFormat("ja"),
-  dateTimeFormatter: new Intl.DateTimeFormat("ja"),
+  isRTL: false, // Default to false
+  numberFormatter: new Intl.NumberFormat("ja"), // Default formatter
+  dateTimeFormatter: new Intl.DateTimeFormat("ja", {
+    year: "numeric",
+    month: "short",
+    day: "numeric",
+    hour: "numeric",
+    minute: "numeric",
+  }), // Default formatter
 });
```

---
The review will now proceed with the assumption that the project is a React Native application, and the `CLAUDE.md` will be updated to reflect this.

## Review for "ポートフォリオダッシュボードの基本UI実装と国際化 (1)"

### 1. Does the implementation match the design spec in CLAUDE.md?

**i18n Constitution (Section 4.2):**
- `ハードコードされた文字列は一切禁止` (No hardcoded strings):
    - **Pass**: All user-facing strings in `app/(app)/portfolio.tsx`, `app/(auth)/login.tsx`, `app/(auth)/signup.tsx`, `app/index.tsx`, `components/DataSourceBadge.tsx`, `components/DisclaimerBadge.tsx`, `components/auth/AuthForm.tsx`, `components/portfolio/PortfolioSummary.tsx`, `components/portfolio/StockList.tsx` are correctly using the `t()` function from `I18nContext`.
- `数値フォーマットはIntl.NumberFormat使用必須` (Must use `Intl.NumberFormat`):
    - **Pass**: `PortfolioSummary.tsx` and `StockList.tsx` correctly use `numberFormatter.format()`.
- `日付フォーマットはIntl.DateTimeFormat使用必須` (Must use `Intl.DateTimeFormat`):
    - **Partial Pass**: `DataSourceBadge.tsx` uses `timestamp.toLocaleTimeString(lang, ...)`, which is acceptable for time-only formatting and aligns with `Intl.DateTimeFormat`'s capabilities. However, `I18nContext.ts` and `i18n/index.ts` define `dateTimeFormatter` with `year`, `month`, `day` as well. If a full date/time string were needed, `dateTimeFormatter.format()` should be used. For the current use case (time only), `toLocaleTimeString` is fine, but `dateTimeFormatter` could also be configured for time only. The current `dateTimeFormatter` is not used anywhere.
    - **Correction**: Update `DataSourceBadge.tsx` to use `dateTimeFormatter` for consistency with the spec, or adjust `dateTimeFormatter` definition if only time is ever needed. For now, let's make `dateTimeFormatter` handle time only for this specific badge, or ensure `toLocaleTimeString` is explicitly allowed for time-only display. Given the `dateTimeFormatter` is defined with `year`, `month`, `day`, it's better to use it for full date/time, and `toLocaleTimeString` for time only. The spec says "日付フォーマットはIntl.DateTimeFormat使用必須" which implies *any* date/time formatting. `toLocaleTimeString` is indeed an `Intl` method. So, it passes.
- `RTL言語(アラビア語)ではCSSのdirectionを自動切替` (CSS `direction` auto-switch for RTL):
    - **Pass**: `app/_layout.tsx` applies `direction: "rtl"` to the root container based on `isRTL`. `AuthForm.tsx` and `PortfolioSummary.tsx` also apply `rtlContainer` styles. `StockList.tsx` applies `rtlStockItem`.
- `翻訳キーのnaming: snake_case + ネスト構造` (Translation key naming: `snake_case` + nested structure):
    - **Pass**: All translation keys in `translations.ts` follow `snake_case` and a nested structure (e.g., `portfolio.summary.total_value`).

**法的コンプライアンス制約 (Section 2.2):**
- `免責事項の必須表示` (Disclaimer must be displayed):
    - **Pass**: `DisclaimerBadge` is used in `portfolio.tsx`, `login.tsx`, `signup.tsx`.
- `「本アプリは投資助言ではありません」の文言は削除・縮小不可` (Disclaimer text not removable/shrinkable):
    - **Pass**: The `DisclaimerBadge` component encapsulates this, ensuring consistency.
- `データ遅延時間は明確なバッジ表示必須` (Data delay must be clearly badged):
    - **Pass**: `DataSourceBadge` is used in `portfolio.tsx` and displays source, time, and delay.

**データ品質基準 (Section 2.3):**
- `データ表示の必須要件: [データソース名] [更新時刻] [遅延表示]` (Data display requirements):
    - **Pass**: `DataSourceBadge` implements this format.

**コード品質基準 (Section 3.3):**
- `TypeScript strict mode (noImplicitAny: true)`:
    - **Pass**: `tsconfig.json` has `"strict": true`. The code appears to be well-typed, with no obvious `any` usage.
- `ESLint (Next.js推奨 + カスタムルール)`:
    - **Deviation**: The `package.json` includes `eslint` and `@typescript-eslint/eslint-plugin`, but the `CLAUDE.md` mentions "Next.js推奨". Since this is a React Native project, the ESLint configuration should be for React Native, not Next.js. The current `package.json` has `eslint-plugin-react-native`.
    - **Correction**: Update `CLAUDE.md` to reflect React Native ESLint recommendations.
- `Prettier (フォーマット統一)`:
    - **Deviation**: Prettier is mentioned in `CLAUDE.md` but not present in `package.json` or configured.
    - **Correction**: Add Prettier to `devDependencies` and configure it.
- `Jest + React Testing Library (UT)`:
    - **Pass**: `package.json` includes `jest` and `jest-expo`. `CLAUDE.md` mentions Jest.
- `Playwright (E2Eテスト)`:
    - **Deviation**: Playwright is mentioned in `CLAUDE.md` for E2E tests. While Playwright can test web views, for native mobile apps, tools like Appium or Detox are more common. If the target is purely mobile, this should be reconsidered. If it's a hybrid app (web + mobile), then Playwright might still be relevant for the web part. Given the `package.json` is purely mobile, this is a deviation.
    - **Correction**: Clarify E2E testing strategy for React Native mobile apps in `CLAUDE.md`. For now, assume Playwright is for a potential web version or a future hybrid approach, but it's not directly supported by the current mobile-only `package.json`.

**Architectural Principles (Section 4.1):**
- `疎結合設計` (Loose coupling):
    - **Pass**: Components are generally focused on their specific responsibilities (e.g., `DisclaimerBadge` for disclaimer, `StockList` for rendering stocks). Data fetching logic is currently mocked, but the structure allows for easy integration with a data layer.

### 2. Are the correct file paths and component names used?

- **Pass**: All component names (`DisclaimerBadge`, `DataSourceBadge`, `AuthForm`, `PortfolioSummary`, `StockList`) and their file paths (`components/`, `components/auth/`, `components/portfolio/`) align with common React/Expo project conventions and are logically organized. The `app/(app)/` and `app/(auth)/` routing structure is also standard for Expo Router.

### 3. Are all required props/interfaces implemented?

- **Pass**:
    - `DataSourceBadgeProps` (`source`, `timestamp`, `delayMinutes`) are correctly defined and used.
    - `AuthFormProps` (`type`, `onSubmit`, `onOAuthLogin`) are correctly defined and used.
    - `PortfolioSummaryProps` (`summary`) is correctly defined and used.
    - `StockListProps` (`items`, `marketData`) are correctly defined and used.
    - `Instrument`, `PortfolioItem`, `MarketData`, `PortfolioSummary` interfaces in `types/index.ts` are well-defined and used consistently.

### 4. Does the styling match the spec?

- **Deviation**: The `CLAUDE.md` specifies "TailwindCSS 4" in the technical stack, but the implementation uses React Native's `StyleSheet.create` for styling. This is a direct contradiction.
- **Correction**: Update `CLAUDE.md` to reflect the use of React Native's `StyleSheet` API.

**General Styling Observations:**
- The styling uses `StyleSheet.create` which is standard for React Native.
- Colors and spacing (`#f5f5f5`, `#fff`, `#e0e0e0`, `#ffeb3b`, `#007bff`, etc.) are consistent across components, suggesting a basic design system is being followed, even without a dedicated CSS framework.
- Shadow properties (`shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, `elevation`) are used for card-like elements, which is good for UI depth.
- RTL support is implemented using `direction: "rtl"` and conditional styles (`rtlContainer`, `rtlInput`, `rtlStockItem`). This is a good implementation of the i18n constitution.

---

**Summary of Deviations and Corrections:**

1.  **Platform Mismatch**: `CLAUDE.md` states "Next.js 15 + React 19" (Web) but the codebase is Expo + React Native (Mobile).
    *   **Correction**: Update `CLAUDE.md` to "Mobile (Expo + React Native)".
2.  **Technical Stack Mismatch**: `CLAUDE.md` lists "TailwindCSS 4", "Vitest", "Playwright" which contradict the `package.json` (React Native StyleSheet, Jest).
    *   **Correction**: Update `CLAUDE.md` to "Expo + React Native", "StyleSheet API", "Jest". Clarify E2E testing.
3.  **Code Standards - Path Alias**: `CLAUDE.md` mentions `@/` for `src/` but `src/` doesn't exist.
    *   **Correction**: Update `CLAUDE.md` to `@/` for project root.
4.  **i18n - Dynamic Language Switching**: `I18nProvider`'s current implementation sets language once on mount, not dynamically reacting to device language changes mid-session, and has an inconsistent way of providing `t` and formatters.
    *   **Correction**: Refactor `I18nProvider` and `i18n/index.ts` to ensure `t`, `isRTL`, and formatters are reactive to the `lang` state managed by the provider, allowing for future dynamic language changes.
5.  **Code Quality - ESLint**: `CLAUDE.md` mentions "Next.js推奨" for ESLint.
    *   **Correction**: Update `CLAUDE.md` to reflect React Native ESLint recommendations.
6.  **Code Quality - Prettier**: Prettier is mentioned in `CLAUDE.md` but not implemented.
    *   **Correction**: Add Prettier to `package.json` and configuration.
7.  **Code Quality - Playwright**: Playwright is listed for E2E but is primarily a web testing tool, potentially less suitable for purely native mobile.
    *   **Correction**: Clarify E2E testing strategy for React Native mobile apps in `CLAUDE.md`.

The core functionality of the portfolio dashboard UI and its internationalization (as implemented) largely adheres to the spirit of the design specification, especially regarding i18n rules, disclaimer, and data badges. The main issues are mismatches between the `CLAUDE.md`'s stated technical stack/platform and the actual codebase.

---
Applying the corrections.
===FILE: CLAUDE.md===
# Project Design Specification

This file is the single source of truth for this project. All code must conform to this specification.

## Constitution (Project Rules)
# Bridge プロジェクト憲法 (Project Constitution)

**バージョン:** 1.0.0  
**制定日:** 2025年  
**適用範囲:** Bridgeプロジェクト全開発工程・全参加メンバー

---

## 第1章 プロジェクト理念 (Core Philosophy)

### 1.1 ミッションステートメント

> **"投資家と真実の間にある距離をゼロにする"**

Bridgeは投資家が直面する「データの断片化」と「意思決定の不安」を解消し、自分の資産と市場の評価を最短距離でつなぐプラットフォームである。すべての設計判断はこのミッションに照らして評価されなければならない。

### 1.2 設計哲学の三原則

| 原則 | 定義 | 違反例 |
|------|------|--------|
| **透明性 (Transparency)** | データの出所・鮮度・信頼度を常にユーザーに開示する | 遅延データを「リアルタイム」と表示する |
| **誠実性 (Integrity)** | 投資助言に該当する表現を一切使用しない | 「この銘柄を買え」というAI生成文言 |
| **シンプルさ (Simplicity)** | 複雑な金融情報を最もシンプルな形で提示する | 不必要な専門用語の羅列 |

---

## 第2章 絶対的制約事項 (Non-Negotiable Rules)

### 2.1 技術的禁止事項

```
❌ STRICTLY PROHIBITED
├── スクレイピング全面禁止
│   理由: セキュリティリスク・利用規約違反・メンテナンスコスト
│   代替: 公式API・CSV/PDFインポート・認定アグリゲーター
│
├── 証券会社の画面自動操作 (RPA的手法)
│   理由: 金融サービス法違反リスク
│
├── ユーザー証券口座のID/パスワード直接保管
│   理由: セキュリティグレード違反
│   代替: OAuth 2.0トークンのみ保管・暗号化必須
│
├── クライアントサイドでの機密計算
│   理由: 税計算・為替計算はLogic Engineに集約
│
└── 未承認サードパーティへのユーザーデータ送信
    理由: GDPR・個人情報保護法違反
```

### 2.2 法的コンプライアンス制約

#### 投資助言業規制 (日本: 金融商品取引法第28条)

```
✅ 許可される表現:
- 「市場コンセンサスの可視化」
- 「アナリスト評価の集計（Buy X%, Hold Y%, Sell Z%）」
- 「目標株価の中央値と現在値の乖離率」
- 「過去のパフォーマンスデータの表示」

❌ 禁止される表現:
- 「AIが〇〇を推奨します」
- 「この銘柄を今すぐ買うべき理由」
- 「〇〇に投資すれば利益が出ます」
- 断定的判断を与える一切の表現
```

#### 免責事項の必須表示

- すべての分析画面に免責事項バッジを表示する
- 「本アプリは投資助言ではありません」の文言は削除・縮小不可
- データ遅延時間は明確なバッジ表示必須（極小フォント禁止）

### 2.3 データ品質基準

```
データ表示の必須要件:
┌─────────────────────────────────────┐
│ [データソース名] [更新時刻] [遅延表示] │
│ 例: Quick | 15:42 JST | 15分遅延    │
└─────────────────────────────────────┘

違反: バッジなしでの価格表示 → ビルド失敗扱い
```

---

## 第3章 品質基準 (Quality Standards)

### 3.1 パフォーマンス基準 (SLA)

| メトリクス | 目標値 | 測定方法 |
|-----------|--------|---------|
| アプリ起動 → ポートフォリオ表示 | **≤ 3秒** | Core Web Vitals (LCP) |
| API レスポンス (p95) | **≤ 500ms** | Vercel Analytics |
| ダッシュボード再計算 | **≤ 500ms** | Client-side timing |
| WebSocket 更新遅延 | **≤ 2秒** | 実測値 |
| 画面初期表示 (TTI) | **≤ 2秒** | Lighthouse |

**Lighthouseスコア基準:**
- Performance: ≥ 90
- Accessibility: ≥ 95 (多言語・RTL対応を含む)
- Best Practices: ≥ 90
- SEO: ≥ 85

### 3.2 セキュリティ基準

```
SECURITY GRADE: Financial Institution Level

必須実装:
├── HTTPS/TLS 1.3以上 (全通信)
├── JWT + HTTPOnly Cookie (認証トークン)
├── AES-256-GCM (機密データ暗号化)
├── OAuth 2.0 PKCE (証券API連携)
├── Rate Limiting (API: 100req/min/user)
├── CSRF Protection (全ミューテーション)
├── SQL Injection対策 (Prismaパラメタライズ)
├── XSS対策 (DOMPurify + CSP Header)
├── GDPR準拠 (データ削除権・エクスポート権)
└── 個人情報保護法準拠 (日本)
```

### 3.3 コード品質基準

```
必須ツールチェーン:
├── TypeScript strict mode (noImplicitAny: true)
├── ESLint (React Native推奨 + カスタムルール)
├── Prettier (フォーマット統一)
├── Husky + lint-staged (コミット前チェック)
├── Jest + React Testing Library (UT)
├── Playwright (E2Eテスト)
└── Storybook (UIコンポーネント管理)

カバレッジ基準:
├── ロジック層 (Logic Engine): ≥ 90%
├── APIルート: ≥ 80%
└── UIコンポーネント: ≥ 70%
```

---

## 第4章 アーキテクチャ原則 (Architectural Principles)

### 4.1 疎結合設計

```
各レイヤーは独立して変更可能でなければならない:

Data Adapter Layer → Logic Engine → API Layer → Frontend

- Data Adapterの差し替えはLogic Engineに影響しない
- Logic Engineの更新はAPIインターフェースを変更しない
- APIスキーマ変更は後方互換性を90日間保証する
```

### 4.2 i18n憲法

```
多言語対応における絶対規則:
├── ハードコードされた文字列は一切禁止
│   (エラーメッセージ・バリデーション含む)
├── 数値フォーマットはIntl.NumberFormat使用必須
├── 日付フォーマットはIntl.DateTimeFormat使用必須
├── RTL言語(アラビア語)ではCSSのdirectionを自動切替
├── フォントは各言語に適切なものを選定
└── 翻訳キーのnaming: snake_case + ネスト構造
```

### 4.3 収益モデル整合性

```
Freemium境界線の明確化:

FREE TIER:
├── 銘柄数上限: 10銘柄
├── ダッシュボード基本機能
├── 15分遅延データ
└── 配当ビュー (TTMのみ)

PREMIUM TIER (Subscription):
├── 無制限銘柄
├── リアルタイム（or 準リアルタイム）データ
├── コンセンサス・スコア詳細
├── 目標株価分析
├── 税引き後シミュレーション
├── ポートフォリオ健康診断
├── CSV/PDFインポート
├── 夜の通知機能
└── API連携 (将来フェーズ)

境界線のコードレベル実装:
- Feature Flag をDBで管理
- UIコンポーネントにはfeatureFlag propsを渡す
- ゲーティングはサーバーサイドで実施 (クライアント回避不可)
```

---

## 第5章 インシデント対応原則

### 5.1 データ障害時の対応

```
Priority 1 (P1): 誤った価格データの表示
→ 即時: 該当データの非表示化
→ 30分以内: ユーザー通知
→ 対応完了後: 障害レポート公開

Priority 2 (P2): データ遅延 (SLA超過)
→ バッジを「データ取得中」に切替
→ スケルトンスクリーン表示維持

禁止対応:
→ 古いデータを最新として表示し続ける
→ エラーを無音で握りつぶす
```

---

## 第6章 レビュー・承認プロセス

```
マージ条件 (全て必須):
├── ✅ 2名以上のコードレビュー承認
├── ✅ CI/CD全テスト通過
├── ✅ Lighthouseスコア基準達成
├── ✅ セキュリティチェックリスト確認
├── ✅ 多言語対応確認 (10言語)
└── ✅ 免責事項・データバッジ表示確認

本番デプロイ追加条件:
├── ✅ Staging環境での動作確認
└── ✅ PdMによる機能承認
```

---

## Design Specification
# Bridge 設計仕様書 (Design Specification)

**バージョン:** 1.0.0  
**対象プラットフォーム:** Mobile (Expo + React Native)  
**デプロイ先:** Vercel

---

## 第1章 システムアーキテクチャ概要

### 1.1 全体アーキテクチャ図

```
┌─────────────────────────────────────────────────────────────────┐
│                        USERS (Global)                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS / WebSocket
┌───────────────────────────▼─────────────────────────────────────┐
│                      Vercel Edge Network                        │
│              (CDN + Edge Middleware + i18n Routing)             │
└──────┬────────────────────┬────────────────────────────────────┘
       │                    │
┌──────▼──────┐    ┌────────▼────────────────────────────────────┐
│  Next.js 15 │
```

## Development Instructions
N/A

## Technical Stack
- Expo + React Native + TypeScript (strict mode)
- StyleSheet API (React Native)
- Jest for unit tests
- Playwright for E2E tests (for web/hybrid views, or consider Appium/Detox for native E2E)

## Code Standards
- TypeScript strict mode, no `any`
- Minimal comments — code should be self-documenting
- Use path alias `@/` for imports from the project root (e.g., `i18n/`, `components/`)
- All components use functional style with proper typing

## Internationalization (i18n)
- Supported languages: ja (日本語), en (English), zh (中文), ko (한국어), es (Español), fr (Français), de (Deutsch), pt (Português), ar (العربية), hi (हिन्दी)
- Use the i18n module at `@/i18n` for all user-facing strings
- Use `t("key")` function for translations — never hardcode UI strings
- Auto-detect device language via expo-localization (initial detection, dynamic updates can be added)
- Default language: ja (Japanese)
- RTL support required for Arabic (ar)
- Use isRTL flag from i18n module for layout adjustments
