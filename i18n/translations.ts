export type Language = "ja" | "en" | "zh" | "ko" | "es" | "fr" | "de" | "pt" | "ar" | "hi";

export const translations: Record<Language, Record<string, string>> = {
  ja: {
    home: {
      title: "投資家と真実の間にある距離をゼロにする",
      subtitle: "Bridgeへようこそ",
    },
    common: {
      disclaimer_badge: "本アプリは投資助言ではありません",
      data_source: "{{source}} | {{time}} JST | {{delay}}遅延",
      data_loading: "データ取得中",
    },
  },
  en: {
    home: {
      title: "Zeroing the distance between investors and truth",
      subtitle: "Welcome to Bridge",
    },
    common: {
      disclaimer_badge: "This app is not investment advice",
      data_source: "{{source}} | {{time}} JST | {{delay}} delay",
      data_loading: "Fetching data",
    },
  },
  zh: {
    home: {
      title: "将投资者与真相之间的距离归零",
      subtitle: "欢迎来到 Bridge",
    },
    common: {
      disclaimer_badge: "本应用不构成投资建议",
      data_source: "{{source}} | {{time}} JST | {{delay}} 延迟",
      data_loading: "正在获取数据",
    },
  },
  ko: {
    home: {
      title: "투자자와 진실 사이의 거리를 0으로 만듭니다",
      subtitle: "Bridge에 오신 것을 환영합니다",
    },
    common: {
      disclaimer_badge: "본 앱은 투자 조언이 아닙니다",
      data_source: "{{source}} | {{time}} JST | {{delay}} 지연",
      data_loading: "데이터 가져오는 중",
    },
  },
  es: {
    home: {
      title: "Reduciendo a cero la distancia entre inversores y la verdad",
      subtitle: "Bienvenido a Bridge",
    },
    common: {
      disclaimer_badge: "Esta aplicación no es asesoramiento de inversión",
      data_source: "{{source}} | {{time}} JST | {{delay}} de retraso",
      data_loading: "Obteniendo datos",
    },
  },
  fr: {
    home: {
      title: "Réduire à zéro la distance entre les investisseurs et la vérité",
      subtitle: "Bienvenue sur Bridge",
    },
    common: {
      disclaimer_badge: "Cette application n'est pas un conseil en investissement",
      data_source: "{{source}} | {{time}} JST | {{delay}} de retard",
      data_loading: "Récupération des données",
    },
  },
  de: {
    home: {
      title: "Den Abstand zwischen Investoren und Wahrheit auf Null reduzieren",
      subtitle: "Willkommen bei Bridge",
    },
    common: {
      disclaimer_badge: "Diese App ist keine Anlageberatung",
      data_source: "{{source}} | {{time}} JST | {{delay}} Verzögerung",
      data_loading: "Daten werden abgerufen",
    },
  },
  pt: {
    home: {
      title: "Reduzindo a distância entre investidores e a verdade a zero",
      subtitle: "Bem-vindo ao Bridge",
    },
    common: {
      disclaimer_badge: "Este aplicativo não é um conselho de investimento",
      data_source: "{{source}} | {{time}} JST | {{delay}} de atraso",
      data_loading: "Obtendo dados",
    },
  },
  ar: {
    home: {
      title: "تصفير المسافة بين المستثمرين والحقيقة",
      subtitle: "مرحبًا بك في Bridge",
    },
    common: {
      disclaimer_badge: "هذا التطبيق ليس نصيحة استثمارية",
      data_source: "{{source}} | {{time}} JST | {{delay}} تأخير",
      data_loading: "جلب البيانات",
    },
  },
  hi: {
    home: {
      title: "निवेशकों और सच्चाई के बीच की दूरी को शून्य करना",
      subtitle: "ब्रिज में आपका स्वागत है",
    },
    common: {
      disclaimer_badge: "यह ऐप निवेश सलाह नहीं है",
      data_source: "{{source}} | {{time}} JST | {{delay}} देरी",
      data_loading: "डेटा प्राप्त कर रहा है",
    },
  },
};
