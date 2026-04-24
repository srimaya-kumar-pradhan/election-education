import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation files
const resources = {
  en: {
    translation: {
      nav: {
        journey: 'Voter Journey',
        eligibility: 'Eligibility',
        chat: 'Ask AI',
        faq: 'FAQ',
        profile: 'Profile',
        signIn: 'Sign In',
        signOut: 'Sign Out'
      },
      home: {
        title: 'Be Booth-Ready.',
        subtitle: 'The smart, AI-powered assistant for first-time voters in India. Get personalized guidance, check eligibility, and understand the democratic process.',
        getStarted: 'Start Your Journey',
        askAi: 'Ask AI Assistant'
      }
    }
  },
  hi: {
    translation: {
      nav: {
        journey: 'मतदाता यात्रा',
        eligibility: 'पात्रता',
        chat: 'AI से पूछें',
        faq: 'सामान्य प्रश्न',
        profile: 'प्रोफ़ाइल',
        signIn: 'साइन इन करें',
        signOut: 'साइन आउट करें'
      },
      home: {
        title: 'बूथ के लिए तैयार रहें।',
        subtitle: 'भारत में पहली बार मतदान करने वालों के लिए स्मार्ट, AI-संचालित सहायक। व्यक्तिगत मार्गदर्शन प्राप्त करें, पात्रता की जांच करें और लोकतांत्रिक प्रक्रिया को समझें।',
        getStarted: 'अपनी यात्रा शुरू करें',
        askAi: 'AI सहायक से पूछें'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
