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

