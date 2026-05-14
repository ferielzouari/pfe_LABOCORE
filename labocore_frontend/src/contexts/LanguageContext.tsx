import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'EN' | 'FR' | 'AR';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  EN: {
    dashboard: 'Dashboard',
    samples: 'Samples',
    results: 'Results',
    inventory: 'Inventory',
    suppliers: 'Suppliers',
    technicians: 'Technicians',
    reports: 'Reports',
    settings: 'Settings',
    search: 'Search samples, results, suppliers...',
    notifications: 'Notifications',
    signIn: 'Sign In',
    email: 'Email Address',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    pendingSamples: 'Pending Samples',
    completedResults: 'Completed Results',
    delayedItems: 'Delayed Items',
    activeTechs: 'Active Techs',
    recentActivity: 'Recent Activity',
    viewAll: 'View All',
    newSample: 'New Sample',
    overview: 'Overview of laboratory operations and alerts',
  },
  FR: {
    dashboard: 'Tableau de Bord',
    samples: 'Échantillons',
    results: 'Résultats',
    inventory: 'Inventaire',
    suppliers: 'Fournisseurs',
    technicians: 'Techniciens',
    reports: 'Rapports',
    settings: 'Paramètres',
    search: 'Rechercher des échantillons, résultats, fournisseurs...',
    notifications: 'Notifications',
    signIn: 'Se Connecter',
    email: 'Adresse Email',
    password: 'Mot de Passe',
    rememberMe: 'Se souvenir de moi',
    forgotPassword: 'Mot de passe oublié?',
    pendingSamples: 'Échantillons en Attente',
    completedResults: 'Résultats Complétés',
    delayedItems: 'Articles Retardés',
    activeTechs: 'Techniciens Actifs',
    recentActivity: 'Activité Récente',
    viewAll: 'Voir Tout',
    newSample: 'Nouvel Échantillon',
    overview: 'Aperçu des opérations de laboratoire et des alertes',
  },
  AR: {
    dashboard: 'لوحة التحكم',
    samples: 'العينات',
    results: 'النتائج',
    inventory: 'المخزون',
    suppliers: 'الموردون',
    technicians: 'الفنيون',
    reports: 'التقارير',
    settings: 'الإعدادات',
    search: 'البحث عن العينات والنتائج والموردين...',
    notifications: 'الإشعارات',
    signIn: 'تسجيل الدخول',
    email: 'عنوان البريد الإلكتروني',
    password: 'كلمة المرور',
    rememberMe: 'تذكرني',
    forgotPassword: 'هل نسيت كلمة المرور؟',
    pendingSamples: 'العينات المعلقة',
    completedResults: 'النتائج المكتملة',
    delayedItems: 'العناصر المتأخرة',
    activeTechs: 'الفنيون النشطون',
    recentActivity: 'النشاط الأخير',
    viewAll: 'عرض الكل',
    newSample: 'عينة جديدة',
    overview: 'نظرة عامة على عمليات المختبر والتنبيهات',
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('labocore_language');
    return (saved as Language) || 'EN';
  });

  useEffect(() => {
    localStorage.setItem('labocore_language', language);
    document.documentElement.lang = language.toLowerCase();
    if (language === 'AR') {
      document.documentElement.dir = 'rtl';
      document.body.style.direction = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
      document.body.style.direction = 'ltr';
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['EN'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
