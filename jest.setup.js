// jest.setup.js
import 'react-native-gesture-handler/jestSetup';

// Mock `expo-router` for tests
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  Link: jest.fn(({ children, href, style }) => (
    <mock-link href={href} style={style}>{children}</mock-link>
  )),
  Stack: {
    Screen: jest.fn(({ options }) => (
      <mock-stack-screen options={options} />
    )),
  },
  Tabs: {
    Screen: jest.fn(({ options }) => (
      <mock-tabs-screen options={options} />
    )),
  },
  useLocalSearchParams: jest.fn(() => ({})),
}));

// Mock `expo-constants` for tests
jest.mock('expo-constants', () => ({
  expoConfig: {
    version: '1.0.0',
  },
}));

// Mock `expo-localization` for tests
jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => ([
    { languageCode: 'ja', textDirection: 'ltr' },
  ])),
}));

// Mock `expo-linking` for tests
jest.mock('expo-linking', () => ({
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  openURL: jest.fn(() => Promise.resolve()),
}));

// Mock `react-native-safe-area-context`
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

// Mock `react-native-screens`
jest.mock('react-native-screens', () => {
  const RealComponent = jest.requireActual('react-native-screens');
  RealComponent.enableScreens(false);
  return RealComponent;
});

// Mock FontAwesome to add a testID
jest.mock('@expo/vector-icons', () => ({
  FontAwesome: jest.fn(({ name, color, size, style }) => (
    <mock-font-awesome name={name} color={color} size={size} style={style} testID="FontAwesomeIcon" />
  )),
}));

// Mock `Intl.NumberFormat` and `Intl.DateTimeFormat` for consistent testing
// This ensures that number and date formatting is predictable across test environments.
const mockNumberFormat = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const mockDecimalFormat = new Intl.NumberFormat('ja-JP', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const mockDateTimeFormat = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
  timeZone: 'Asia/Tokyo', // Explicitly set JST
});

jest.spyOn(global.Intl, 'NumberFormat').mockImplementation((locale, options) => {
  if (options?.style === 'currency') {
    return mockNumberFormat;
  }
  return mockDecimalFormat;
});

jest.spyOn(global.Intl, 'DateTimeFormat').mockImplementation((locale, options) => {
  return mockDateTimeFormat;
});

// Mocking the `setAppLanguage` function from `I18nProvider`
// This allows us to simulate language changes in tests without full context re-renders.
// Note: This is a simplified mock. In a real scenario, you might want to
// create a test utility to wrap components with a controlled I18nProvider.
let currentTestLanguage = 'ja';
const mockSetAppLanguage = jest.fn((lang) => {
  currentTestLanguage = lang;
});

jest.mock('@/i18n/I18nProvider', () => {
  const actual = jest.requireActual('@/i18n/I18nProvider');
  return {
    ...actual,
    setAppLanguage: mockSetAppLanguage, // Export the mock
    // You might also need to mock the I18nContext itself if you're not using the provider in tests
  };
});

// Mock the I18nContext to allow setting the language for tests
// This is crucial for components that consume I18nContext directly in tests
// without being wrapped in the full I18nProvider.
jest.mock('@/i18n/I18nContext', () => {
  const actual = jest.requireActual('@/i18n/I18nContext'); // Get actual context type
  let currentLanguage = 'ja'; // Default language for tests
  let isRTL = false;

  const t = (key: string, vars?: Record<string, string | number>) => {
    // Simplified translation logic for tests
    const translations: Record<string, Record<string, string>> = {
      ja: {
        "common.disclaimer_badge": "本アプリは投資助言ではありません",
        "common.loading": "読み込み中...",
        "common.error_loading_data": "データの読み込み中にエラーが発生しました。",
        "common.na": "N/A",
        "common.jst": "JST",
        "common.minutes_delayed": "分遅延",
        "common.trillion": "兆",
        "common.billion": "億",
        "common.million": "万",
        "home.title": "Bridge",
        "home.subtitle": "投資家と真実の間にある距離をゼロにする",
        "auth.login.title": "ログイン",
        "auth.signup.title": "新規登録",
        "auth.email_placeholder": "メールアドレス",
        "auth.password_placeholder": "パスワード",
        "auth.confirm_password_placeholder": "パスワード確認",
        "auth.login_button": "ログイン",
        "auth.signup_button": "新規登録",
        "auth.or_separator": "または",
        "auth.oauth_google": "Googleで{{action}}",
        "auth.oauth_apple": "Appleで{{action}}",
        "auth.login_action": "ログイン",
        "auth.signup_action": "新規登録",
        "auth.error.empty_fields": "メールアドレスとパスワードを入力してください。",
        "auth.error.invalid_email": "有効なメールアドレスを入力してください。",
        "auth.error.password_mismatch": "パスワードが一致しません。",
        "auth.error.password_too_short": "パスワードは8文字以上である必要があります。",
        "portfolio.title": "ポートフォリオ",
        "portfolio.my_portfolio": "マイポートフォリオ",
        "portfolio.holdings": "保有銘柄",
        "portfolio.summary.total_value": "合計評価額",
        "portfolio.summary.total_gain_loss": "合計損益",
        "portfolio.summary.total_gain_loss_percent": "合計損益率",
        "portfolio.stock_list.quantity": "数量",
        "portfolio.stock_list.avg_price": "平均取得価格",
        "portfolio.stock_list.current_price": "現在価格",
        "portfolio.stock_list.change": "変動",
        "portfolio.stock_list.market_value": "時価評価額",
        "portfolio.stock_list.gain_loss": "損益",
        "portfolio.stock_list.empty": "ポートフォリオに銘柄がありません。",
        "search.title": "検索",
        "search.placeholder": "銘柄名またはティッカーシンボルを検索",
        "search.no_results": "検索結果が見つかりませんでした。",
        "settings.title": "設定",
        "settings.language_settings": "言語設定",
        "settings.legal_info": "法的情報",
        "settings.privacy_policy": "プライバシーポリシー",
        "settings.terms_of_service": "利用規約",
        "settings.app_version": "アプリバージョン",
        "stock_detail.title": "銘柄詳細",
        "stock_detail.error.no_symbol": "銘柄シンボルが指定されていません。",
        "stock_detail.chart_title": "株価チャート",
        "stock_detail.chart_placeholder": "チャートはここに表示されます",
        "stock_detail.company_info_title": "企業情報",
        "stock_detail.company_description_placeholder": "{{symbol}}の企業説明のプレースホルダー。",
        "stock_detail.company_info.sector": "セクター",
        "stock_detail.company_info.industry": "業種",
        "stock_detail.company_info.market_cap": "時価総額",
        "stock_detail.company_info.pe_ratio": "PER",
        "stock_detail.company_info.dividend_yield": "配当利回り",
        "language.ja": "日本語",
        "language.en": "English",
        "language.zh": "中文",
        "language.ko": "한국어",
        "language.es": "Español",
        "language.fr": "Français",
        "language.de": "Deutsch",
        "language.pt": "Português",
        "language.ar": "العربية",
        "language.hi": "हिन्दी",
        "premium.badge": "プレミアム",
        "premium.feature_locked": "{{feature}}はプレミアム機能です。",
        "premium.features.unlimited_stocks": "無制限銘柄",
        "premium.features.realtime_data": "リアルタイムデータ",
        "premium.features.consensus_score": "コンセンサス・スコア詳細",
        "premium.features.target_price_analysis": "目標株価分析",
        "premium.features.tax_simulation": "税引き後シミュレーション",
        "premium.features.portfolio_health_check": "ポートフォリオ健康診断",
        "premium.features.csv_pdf_import": "CSV/PDFインポート",
        "premium.features.night_notifications": "夜の通知機能",
        "premium.features.api_integration": "API連携",
        "premium.upgrade_prompt.title": "プレミアムにアップグレード",
        "premium.upgrade_prompt.description": "プレミアムにアップグレードして、すべての機能にアクセスしましょう！",
        "premium.upgrade_prompt.button_text": "アップグレード",
      },
      en: {
        "common.disclaimer_badge": "This app is not investment advice",
        "common.loading": "Loading...",
        "common.error_loading_data": "Error loading data.",
        "common.na": "N/A",
        "common.jst": "JST",
        "common.minutes_delayed": "min delayed",
        "common.trillion": "Trillion",
        "common.billion": "Billion",
        "common.million": "Million",
        "home.title": "Bridge",
        "home.subtitle": "Zero distance between investors and truth",
        "auth.login.title": "Login",
        "auth.signup.title": "Sign Up",
        "auth.email_placeholder": "Email",
        "auth.password_placeholder": "Password",
        "auth.confirm_password_placeholder": "Confirm Password",
        "auth.login_button": "Login",
        "auth.signup_button": "Sign Up",
        "auth.or_separator": "Or",
        "auth.oauth_google": "Continue with Google",
        "auth.oauth_apple": "Continue with Apple",
        "auth.login_action": "Login",
        "auth.signup_action": "Sign Up",
        "auth.error.empty_fields": "Please enter email and password.",
        "auth.error.invalid_email": "Please enter a valid email address.",
        "auth.error.password_mismatch": "Passwords do not match.",
        "auth.error.password_too_short": "Password must be at least 8 characters long.",
        "portfolio.title": "Portfolio",
        "portfolio.my_portfolio": "My Portfolio",
        "portfolio.holdings": "Holdings",
        "portfolio.summary.total_value": "Total Value",
        "portfolio.summary.total_gain_loss": "Total Gain/Loss",
        "portfolio.summary.total_gain_loss_percent": "Total Gain/Loss %",
        "portfolio.stock_list.quantity": "Quantity",
        "portfolio.stock_list.avg_price": "Avg. Price",
        "portfolio.stock_list.current_price": "Current Price",
        "portfolio.stock_list.change": "Change",
        "portfolio.stock_list.market_value": "Market Value",
        "portfolio.stock_list.gain_loss": "Gain/Loss",
        "portfolio.stock_list.empty": "No stocks in portfolio.",
        "search.title": "Search",
        "search.placeholder": "Search stock name or ticker symbol",
        "search.no_results": "No search results found.",
        "settings.title": "Settings",
        "settings.language_settings": "Language Settings",
        "settings.legal_info": "Legal Information",
        "settings.privacy_policy": "Privacy Policy",
        "settings.terms_of_service": "Terms of Service",
        "settings.app_version": "App Version",
        "stock_detail.title": "Stock Detail",
        "stock_detail.error.no_symbol": "No stock symbol provided.",
        "stock_detail.chart_title": "Stock Chart",
        "stock_detail.chart_placeholder": "Chart will be displayed here",
        "stock_detail.company_info_title": "Company Information",
        "stock_detail.company_description_placeholder": "Placeholder for {{symbol}} company description.",
        "stock_detail.company_info.sector": "Sector",
        "stock_detail.company_info.industry": "Industry",
        "stock_detail.company_info.market_cap": "Market Cap",
        "stock_detail.company_info.pe_ratio": "P/E Ratio",
        "stock_detail.company_info.dividend_yield": "Dividend Yield",
        "premium.badge": "Premium",
        "premium.feature_locked": "{{feature}} is a premium feature.",
        "premium.features.unlimited_stocks": "Unlimited Stocks",
        "premium.features.realtime_data": "Real-time Data",
        "premium.features.consensus_score": "Consensus Score Details",
        "premium.features.target_price_analysis": "Target Price Analysis",
        "premium.features.tax_simulation": "After-tax Simulation",
        "premium.features.portfolio_health_check": "Portfolio Health Check",
        "premium.features.csv_pdf_import": "CSV/PDF Import",
        "premium.features.night_notifications": "Night Notifications",
        "premium.features.api_integration": "API Integration",
        "premium.upgrade_prompt.title": "Upgrade to Premium",
        "premium.upgrade_prompt.description": "Upgrade to Premium to access all features!",
        "premium.upgrade_prompt.button_text": "Upgrade",
      },
      ar: {
        "common.disclaimer_badge": "هذا التطبيق ليس نصيحة استثمارية",
        "common.loading": "جاري التحميل...",
        "common.error_loading_data": "خطأ في تحميل البيانات.",
        "common.na": "غير متوفر",
        "common.jst": "بتوقيت اليابان",
        "common.minutes_delayed": "دقيقة تأخير",
        "common.trillion": "تريليون",
        "common.billion": "مليار",
        "common.million": "مليون",
        "home.title": "Bridge",
        "home.subtitle": "صفر مسافة بين المستثمرين والحقيقة",
        "auth.login.title": "تسجيل الدخول",
        "auth.signup.title": "التسجيل",
        "auth.email_placeholder": "البريد الإلكتروني",
        "auth.password_placeholder": "كلمة المرور",
        "auth.confirm_password_placeholder": "تأكيد كلمة المرور",
        "auth.login_button": "تسجيل الدخول",
        "auth.signup_button": "التسجيل",
        "auth.or_separator": "أو",
        "auth.oauth_google": "المتابعة باستخدام جوجل",
        "auth.oauth_apple": "المتابعة باستخدام أبل",
        "auth.login_action": "تسجيل الدخول",
        "auth.signup_action": "التسجيل",
        "auth.error.empty_fields": "الرجاء إدخال البريد الإلكتروني وكلمة المرور.",
        "auth.error.invalid_email": "الرجاء إدخال عنوان بريد إلكتروني صالح.",
        "auth.error.password_mismatch": "كلمتا المرور غير متطابقتين.",
        "auth.error.password_too_short": "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.",
        "portfolio.title": "المحفظة",
        "portfolio.my_portfolio": "محفظتي",
        "portfolio.holdings": "المقتنيات",
        "portfolio.summary.total_value": "القيمة الإجمالية",
        "portfolio.summary.total_gain_loss": "إجمالي الربح/الخسارة",
        "portfolio.summary.total_gain_loss_percent": "إجمالي الربح/الخسارة %",
        "portfolio.stock_list.quantity": "الكمية",
        "portfolio.stock_list.avg_price": "متوسط السعر",
        "portfolio.stock_list.current_price": "السعر الحالي",
        "portfolio.stock_list.change": "التغيير",
        "portfolio.stock_list.market_value": "القيمة السوقية",
        "portfolio.stock_list.gain_loss": "الربح/الخسارة",
        "portfolio.stock_list.empty": "لا توجد أسهم في المحفظة.",
        "search.title": "بحث",
        "search.placeholder": "البحث عن اسم السهم أو رمز المؤشر",
        "search.no_results": "لم يتم العثور على نتائج بحث.",
        "settings.title": "الإعدادات",
        "settings.language_settings": "إعدادات اللغة",
        "settings.legal_info": "المعلومات القانونية",
        "settings.privacy_policy": "سياسة الخصوصية",
        "settings.terms_of_service": "شروط الخدمة",
        "settings.app_version": "إصدار التطبيق",
        "stock_detail.title": "تفاصيل السهم",
        "stock_detail.error.no_symbol": "لم يتم توفير رمز السهم.",
        "stock_detail.chart_title": "مخطط السهم",
        "stock_detail.chart_placeholder": "سيتم عرض الرسم البياني هنا",
        "stock_detail.company_info_title": "معلومات الشركة",
        "stock_detail.company_description_placeholder": "وصف الشركة لـ {{symbol}}.",
        "stock_detail.company_info.sector": "القطاع",
        "stock_detail.company_info.industry": "الصناعة",
        "stock_detail.company_info.market_cap": "القيمة السوقية",
        "stock_detail.company_info.pe_ratio": "نسبة السعر إلى الأرباح",
        "stock_detail.company_info.dividend_yield": "عائد الأرباح",
        "premium.badge": "مميز",
        "premium.feature_locked": "{{feature}} هي ميزة مميزة.",
        "premium.features.unlimited_stocks": "أسهم غير محدودة",
        "premium.features.realtime_data": "بيانات في الوقت الفعلي",
        "premium.features.consensus_score": "تفاصيل نقاط الإجماع",
        "premium.features.target_price_analysis": "تحليل السعر المستهدف",
        "premium.features.tax_simulation": "محاكاة ما بعد الضريبة",
        "premium.features.portfolio_health_check": "فحص صحة المحفظة",
        "premium.features.csv_pdf_import": "استيراد CSV/PDF",
        "premium.features.night_notifications": "إشعارات ليلية",
        "premium.features.api_integration": "تكامل API",
        "premium.upgrade_prompt.title": "الترقية إلى المميز",
        "premium.upgrade_prompt.description": "قم بالترقية إلى المميز للوصول إلى جميع الميزات!",
        "premium.upgrade_prompt.button_text": "الترقية",
      },
      // Add other languages as needed for comprehensive testing
    };

    let translated = translations[currentLanguage]?.[key] || key;
    if (vars) {
      for (const [varKey, varValue] of Object.entries(vars)) {
        translated = translated.replace(`{{${varKey}}}`, String(varValue));
      }
    }
    return translated;
  };

  const setLanguage = (lang: string) => {
    currentLanguage = lang;
    isRTL = lang === 'ar'; // Set RTL based on language
  };

  return {
    ...actual,
    I18nContext: {
      ...actual.I18nContext,
      Provider: ({ children, value }: { children: React.ReactNode, value: any }) => {
        // This provider mock allows tests to control the context values
        // It's a bit of a hack but necessary for testing components that consume the context
        // without a full app setup.
        currentLanguage = value.currentLanguage;
        isRTL = value.isRTL;
        return <actual.I18nContext.Provider value={value}>{children}</actual.I18nContext.Provider>;
      },
      Consumer: actual.I18nContext.Consumer,
      // Directly export the mock values for useContext in tests
      currentLanguage: currentLanguage,
      t: t,
      setLanguage: setLanguage,
      isRTL: isRTL,
      numberFormatter: mockNumberFormat,
      dateTimeFormatter: mockDateTimeFormat,
    },
    useContext: (context: React.Context<any>) => {
      if (context === actual.I18nContext) {
        return {
          currentLanguage: currentLanguage,
          t: t,
          setLanguage: setLanguage,
          isRTL: isRTL,
          numberFormatter: mockNumberFormat,
          dateTimeFormatter: mockDateTimeFormat,
        };
      }
      return jest.requireActual('react').useContext(context);
    },
  };
});

