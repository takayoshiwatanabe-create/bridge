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
│ (Frontend)  │    │      API Gateway / Load Balancer            │
│             │    └───────────┬─────────────────────────────────┘
│             │                │
│             │    ┌───────────▼─────────────────────────────────┐
│             │    │       Authentication Service (Auth0)        │
│             │    └───────────┬─────────────────────────────────┘
│             │                │ OAuth 2.0 PKCE
│             │    ┌───────────▼─────────────────────────────────┐
│             │    │           Bridge API (GraphQL/REST)         │
│             │    │ (Node.js/Fastify + Prisma + TypeScript)     │
│             │    └───────────┬─────────────────────────────────┘
│             │                │
│             │    ┌───────────▼─────────────────────────────────┐
│             │    │          Logic Engine (Microservice)        │
│             │    │ (Portfolio Calc, Tax Sim, Consensus Agg)    │
│             │    └───────────┬─────────────────────────────────┘
│             │                │
│             │    ┌───────────▼─────────────────────────────────┐
│             │    │          Data Adapter Layer                 │
│             │    │ (External APIs: Quick, Bloomberg, Refinitiv)│
│             │    └───────────┬─────────────────────────────────┘
│             │                │
│             │    ┌───────────▼─────────────────────────────────┐
│             │    │           PostgreSQL Database               │
│             │    │ (User Data, Portfolio, Settings, Cache)     │
│             └────┴─────────────────────────────────────────────┘
```

### 1.2 データフロー (ポートフォリオ表示)

1.  **ユーザーリクエスト:** クライアント (Next.js Frontend) が `/portfolio` にアクセス。
2.  **認証:** Edge Middleware が JWT を検証。無効な場合はログインページへリダイレクト。
3.  **APIコール:** Frontend が Bridge API の `/portfolio` エンドポイントにリクエスト。
4.  **Logic Engine連携:** Bridge API が Logic Engine にユーザーのポートフォリオ計算を要求。
5.  **データ取得:** Logic Engine が PostgreSQL からユーザーの保有銘柄データを取得。
6.  **外部データ連携:** Logic Engine が Data Adapter Layer を介して、各銘柄のリアルタイム（または遅延）市場データを外部APIから取得。
7.  **計算・集計:** Logic Engine が取得したデータに基づき、ポートフォリオの評価額、損益、損益率などを計算。
8.  **APIレスポンス:** Logic Engine が計算結果を Bridge API に返却。Bridge API はこれをクライアントに返す。
9.  **UI表示:** Frontend がレスポンスデータを受け取り、ポートフォリオダッシュボードをレンダリング。
10. **データバッジ表示:** すべての価格表示には、データソース、更新時刻、遅延情報を含むバッジを必須表示。

### 1.3 i18n (国際化) フロー

1.  **言語検出:** Edge Middleware が `Accept-Language` ヘッダーまたはクッキーからユーザーの優先言語を検出。
2.  **ルーティング:** 検出された言語に基づき、`/[lang]/` のパスプレフィックスでルーティング (例: `/ja/portfolio`, `/en/portfolio`)。
3.  **翻訳ロード:** Next.js アプリケーションが、現在の言語に対応する翻訳ファイルをロード。
4.  **RTL対応:** アラビア語 (ar) など RTL (右から左) 言語の場合、CSS `direction: rtl;` を適用し、レイアウトを自動調整。
5.  **フォーマット:** `Intl.NumberFormat` および `Intl.DateTimeFormat` を使用して、数値と日付をローカライズされた形式で表示。

---

## 第2章 UI/UXデザイン

### 2.1 カラーパレット

| 用途 | カラーコード | 説明 |
|------|--------------|------|
| Primary | `#007bff` | 主要なアクションボタン、リンク、アクティブな要素 |
| Secondary | `#6c757d` | 副次的なアクション、非アクティブな要素 |
| Success | `#28a745` | 利益、成功メッセージ |
| Danger | `#dc3545` | 損失、エラーメッセージ、警告 |
| Warning | `#ffc107` | 注意喚起、軽微な警告 |
| Info | `#17a2b8` | 情報提供 |
| Light | `#f8f9fa` | 背景、区切り線 |
| Dark | `#343a40` | テキスト、アイコン |
| Text Primary | `#212529` | 主要な本文テキスト |
| Text Secondary | `#6c757d` | 副次的なテキスト、ヒント |

### 2.2 タイポグラフィ

-   **フォントファミリー:** Noto Sans JP (日本語), Inter (英語・その他ラテン文字)
-   **基本フォントサイズ:** 16px
-   **見出し:**
    -   H1: 32px, Bold
    -   H2: 24px, Bold
    -   H3: 20px, Semi-Bold
-   **本文:** 16px, Regular
-   **キャプション/免責事項:** 12px, Regular, `#6c757d`

### 2.3 コンポーネントデザイン

#### 2.3.1 ナビゲーションとタブバー

-   **タブバーの配置:** 画面下部固定
-   **タブアイテム:**
    -   アイコン (FontAwesome) とテキストラベル
    -   アクティブ状態: Primaryカラー (`#007bff`), 太字
    -   非アクティブ状態: Secondaryカラー (`#6c757d`), 通常
-   **タブ項目:**
    -   ポートフォリオ (`briefcase` icon)
    -   検索 (`search` icon)
    -   設定 (`cog` icon)
-   **RTL対応:** アラビア語 (ar) の場合、タブバー内のアイコンは左右反転 (`transform: scaleX(-1)`) させる。

#### 2.3.2 データバッジ

-   **デザイン:**
    -   背景色: `#e0e0e0` (Light grey)
    -   文字色: `#555`
    -   フォントサイズ: 12px
    -   角丸: 4px
    -   パディング: 垂直4px, 水平8px
    -   配置: `alignSelf: "flex-start"` (コンテンツの幅に合わせる)
-   **表示内容 (必須):** `[データソース名] | [更新時刻] | [遅延表示]`
    -   例: `Quick | 15:42 JST | 15分遅延`
    -   リアルタイムの場合: `Quick | 15:57 JST | リアルタイム`

#### 2.3.3 免責事項バッジ

-   **デザイン:**
    -   背景色: `#ffeb3b` (Yellow)
    -   文字色: `#333`
    -   フォントサイズ: 12px
    -   フォントウェイト: 500 (Medium)
    -   角丸: 4px
    -   パディング: 垂直4px, 水平8px
    -   配置: `alignSelf: "flex-start"` (コンテンツの幅に合わせる)
-   **表示内容 (必須):** `本アプリは投資助言ではありません。データは遅延する場合があります。` (多言語対応)

#### 2.3.4 フォーム要素 (入力フィールド、ボタン)

-   **TextInput:**
    -   高さ: 50px
    -   ボーダー: `#ddd`, 1px
    -   角丸: 8px
    -   パディング: 水平15px
    -   フォントサイズ: 16px
    -   文字色: `#333`
    -   背景色: `#f9f9f9`
    -   プレースホルダー色: `#888`
    -   RTL対応: `textAlign: "right"`
-   **Button:**
    -   背景色: Primary (`#007bff`)
    -   パディング: 垂直15px
    -   角丸: 8px
    -   文字色: `#fff`
    -   フォントサイズ: 18px, Bold

#### 2.3.5 ポートフォリオサマリー

-   **デザイン:**
    -   背景色: `#fff`
    -   角丸: 10px
    -   パディング: 20px
    -   シャドウ: `shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2`
-   **表示項目:**
    -   合計評価額 (Total Value): H2スタイル、Primary Text Color
    -   合計損益 (Total Gain/Loss): H3スタイル、Success/Danger Color
    -   合計損益率 (Total Gain/Loss %): H3スタイル、Success/Danger Color
-   **数値フォーマット:** `Intl.NumberFormat` を使用し、通貨記号 (USD, JPYなど) を適切に表示。

#### 2.3.6 銘柄リスト (ポートフォリオ内)

-   **表示項目 (テーブル形式):**
    -   銘柄名 (Symbol & Name)
    -   数量 (Quantity)
    -   平均取得単価 (Avg. Price)
    -   現在値 (Current Price)
    -   変動 (Change)
    -   損益 (Gain/Loss)
    -   評価額 (Market Value)
-   **デザイン:**
    -   各行: 背景色 `#fff`, 角丸 8px, パディング 15px, 下マージン 10px
    -   価格変動: PositiveはSuccessカラー、NegativeはDangerカラー
    -   データバッジ: 各銘柄の現在値の横に必須表示

#### 2.3.7 銘柄詳細画面

-   **ヘッダー:**
    -   銘柄シンボル (H1)
    -   企業名 (H3)
    -   現在値 (H1, Primary Text Color)
    -   変動 (H3, Success/Danger Color)
    -   データバッジ (現在値の下に必須表示)
-   **チャートエリア:**
    -   プレースホルダー: 背景色 `#e0e0e0`, 高さ 200px, 中央に「チャート表示エリア」テキスト
-   **企業情報:**
    -   セクション見出し: H3
    -   項目: 企業説明、セクター、業種、時価総額、PER、配当利回り
    -   時価総額は「兆」「億」「百万」単位でローカライズされた表示 (例: 2.8兆円, $2.8T)

---

## Development Instructions
N/A

## Technical Stack
- Next.js 15 + React 19 + TypeScript (strict mode)
- TailwindCSS 4
- Vitest for unit tests
- Playwright for E2E tests

## Code Standards
- TypeScript strict mode, no `any`
- Minimal comments — code should be self-documenting
- Use path alias `@/` for imports from `src/`
- All components use functional style with proper typing

## Internationalization (i18n)
- Supported languages: ja (日本語), en (English), zh (中文), ko (한국어), es (Español), fr (Français), de (Deutsch), pt (Português), ar (العربية), hi (हिन्दी)
- Use the i18n module at `@/i18n` for all user-facing strings
- Use `t("key")` function for translations — never hardcode UI strings
- Auto-detect device language via expo-localization
- Default language: ja (Japanese)
- RTL support required for Arabic (ar)
- Use isRTL flag from i18n module for layout adjustments

