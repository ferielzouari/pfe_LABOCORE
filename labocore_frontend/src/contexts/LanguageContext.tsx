import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'EN' | 'FR' | 'AR';
type Translations = { [key in Language]: { [key: string]: string } };

const translations: Translations = {
  EN: {
    // ── Navigation ──
    dashboard: 'Dashboard', samples: 'Samples', results: 'Results',
    inventory: 'Inventory', suppliers: 'Suppliers', technicians: 'Technicians',
    reports: 'Reports', settings: 'Settings',

    // ── Common actions ──
    add: 'Add', edit: 'Edit', delete: 'Delete', save: 'Save', cancel: 'Cancel',
    confirm: 'Confirm', filter: 'Filter', export: 'Export',
    exportCsv: 'Export CSV', exportPdf: 'Export PDF',
    loading: 'Loading…', noData: 'No data available',
    search: 'Search…', signOut: 'Sign Out', close: 'Close', back: 'Back',

    // ── Auth ──
    signIn: 'Sign In', username: 'Username', email: 'Email Address',
    password: 'Password', rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    invalidCredentials: 'Invalid credentials. Please try again.',

    // ── Notifications ──
    notifications: 'Notifications',

    // ── Dashboard ──
    dashboardTitle: 'Dashboard',
    dashboardSubtitle: 'Overview of laboratory operations and alerts',
    pendingSamples: 'Pending Samples', completedResults: 'Completed Results',
    delayedItems: 'Delayed Items', activeTechs: 'Active Technicians',
    recentActivity: 'Recent Activity', viewAll: 'View All',
    newSample: 'New Sample', overview: 'Overview of laboratory operations and alerts',

    // ── Samples ──
    samplesTitle: 'Samples', samplesSubtitle: 'Register and track laboratory samples',
    registerSample: 'Register Sample', patientId: 'Patient ID',
    sampleType: 'Sample Type', priority: 'Priority', notes: 'Notes',
    sampleId: 'Sample ID', collectedAt: 'Collected At',
    pending: 'Pending', processing: 'Processing', completed: 'Completed', rejected: 'Rejected',
    deleteSample: 'Delete Sample', confirmDelete: 'Are you sure you want to delete this item?',
    allStatuses: 'All Statuses',

    // ── Results ──
    resultsTitle: 'Results', resultsSubtitle: 'View and validate analysis results',

    // ── Inventory ──
    inventoryTitle: 'Inventory', inventorySubtitle: 'Monitor reagents and stock levels',
    stockLevel: 'Stock Level', lowStock: 'Low Stock', inStock: 'In Stock', outOfStock: 'Out of Stock',

    // ── Suppliers ──
    suppliersTitle: 'Suppliers', suppliersSubtitle: 'Manage your supplier relationships',
    supplierName: 'Supplier Name', phone: 'Phone', address: 'Address',
    active: 'Active', inactive: 'Inactive', addSupplier: 'Add Supplier',

    // ── Technicians ──
    techniciansTitle: 'Technicians', techniciansSubtitle: 'Manage laboratory staff',
    name: 'Name', specialty: 'Specialty', service: 'Service',
    addTechnician: 'Add Technician', matricule: 'Matricule',

    // ── Reports ──
    reportsTitle: 'Analytics & Reports',
    reportsSubtitle: 'Insights into laboratory performance and sample trends',
    totalSamples: 'Total Samples', totalPatients: 'Unique Patients',
    totalTests: 'Tests Performed', avgTurnaround: 'Avg. Turnaround (h)',
    samplesTrend: 'Sample Trend', statusDistribution: 'Status Distribution',
    testsByType: 'Tests by Sample Type', testsByCategory: 'Tests by Analysis Family',
    dateFrom: 'From', dateTo: 'To', generateReport: 'Generate Report',

    // ── Settings ──
    settingsTitle: 'Settings', settingsSubtitle: 'Articles & risk condition management',

    // ── Landing page ──
    landingHeroTitle: 'The Future of Laboratory Management',
    landingHeroSubtitle: 'LABOCORE streamlines your laboratory workflow with real-time sample tracking, powerful BI analytics, and seamless multi-role team collaboration.',
    enterApp: 'Enter App', learnMore: 'Learn More',
    landingFeaturesTitle: 'Built for modern laboratories',
    getStarted: 'Get Started Now',

    // ── Pagination ──
    previous: 'Previous', next: 'Next', showing: 'Showing', of: 'of',
    rowsPerPage: 'Rows per page',
  },

  FR: {
    // ── Navigation ──
    dashboard: 'Tableau de Bord', samples: 'Échantillons', results: 'Résultats',
    inventory: 'Inventaire', suppliers: 'Fournisseurs', technicians: 'Techniciens',
    reports: 'Rapports', settings: 'Paramètres',

    // ── Common actions ──
    add: 'Ajouter', edit: 'Modifier', delete: 'Supprimer', save: 'Enregistrer',
    cancel: 'Annuler', confirm: 'Confirmer', filter: 'Filtrer', export: 'Exporter',
    exportCsv: 'Exporter CSV', exportPdf: 'Exporter PDF',
    loading: 'Chargement…', noData: 'Aucune donnée disponible',
    search: 'Rechercher…', signOut: 'Se Déconnecter', close: 'Fermer', back: 'Retour',

    // ── Auth ──
    signIn: 'Se Connecter', username: "Nom d'utilisateur", email: 'Adresse Email',
    password: 'Mot de Passe', rememberMe: 'Se souvenir de moi',
    forgotPassword: 'Mot de passe oublié ?',
    invalidCredentials: 'Identifiants invalides. Veuillez réessayer.',

    // ── Notifications ──
    notifications: 'Notifications',

    // ── Dashboard ──
    dashboardTitle: 'Tableau de Bord',
    dashboardSubtitle: 'Aperçu des opérations de laboratoire et des alertes',
    pendingSamples: 'Échantillons en Attente', completedResults: 'Résultats Complétés',
    delayedItems: 'Articles Retardés', activeTechs: 'Techniciens Actifs',
    recentActivity: 'Activité Récente', viewAll: 'Voir Tout',
    newSample: 'Nouvel Échantillon', overview: 'Aperçu des opérations de laboratoire et des alertes',

    // ── Samples ──
    samplesTitle: 'Échantillons', samplesSubtitle: 'Enregistrer et suivre les échantillons de laboratoire',
    registerSample: 'Enregistrer Échantillon', patientId: 'ID Patient',
    sampleType: "Type d'Échantillon", priority: 'Priorité', notes: 'Notes',
    sampleId: "ID d'Échantillon", collectedAt: 'Collecté le',
    pending: 'En Attente', processing: 'En Cours', completed: 'Complété', rejected: 'Rejeté',
    deleteSample: "Supprimer l'Échantillon", confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
    allStatuses: 'Tous les Statuts',

    // ── Results ──
    resultsTitle: 'Résultats', resultsSubtitle: 'Visualiser et valider les résultats d\'analyse',

    // ── Inventory ──
    inventoryTitle: 'Inventaire', inventorySubtitle: 'Surveiller les réactifs et les niveaux de stock',
    stockLevel: 'Niveau de Stock', lowStock: 'Stock Faible', inStock: 'En Stock', outOfStock: 'Rupture de Stock',

    // ── Suppliers ──
    suppliersTitle: 'Fournisseurs', suppliersSubtitle: 'Gérer vos relations fournisseurs',
    supplierName: 'Nom du Fournisseur', phone: 'Téléphone', address: 'Adresse',
    active: 'Actif', inactive: 'Inactif', addSupplier: 'Ajouter Fournisseur',

    // ── Technicians ──
    techniciansTitle: 'Techniciens', techniciansSubtitle: 'Gérer le personnel de laboratoire',
    name: 'Nom', specialty: 'Spécialité', service: 'Service',
    addTechnician: 'Ajouter Technicien', matricule: 'Matricule',

    // ── Reports ──
    reportsTitle: 'Analyses & Rapports',
    reportsSubtitle: 'Aperçu des performances du laboratoire et des tendances',
    totalSamples: 'Total Échantillons', totalPatients: 'Patients Uniques',
    totalTests: 'Tests Effectués', avgTurnaround: 'Délai Moyen (h)',
    samplesTrend: 'Tendance Échantillons', statusDistribution: 'Répartition des Statuts',
    testsByType: "Tests par Type d'Échantillon", testsByCategory: "Tests par Famille d'Analyse",
    dateFrom: 'Du', dateTo: 'Au', generateReport: 'Générer Rapport',

    // ── Settings ──
    settingsTitle: 'Paramètres', settingsSubtitle: 'Gestion des articles et des conditions de risque',

    // ── Landing page ──
    landingHeroTitle: "L'Avenir de la Gestion de Laboratoire",
    landingHeroSubtitle: 'LABOCORE simplifie votre flux de travail avec un suivi en temps réel des échantillons, des analyses BI puissantes et une collaboration multi-rôles.',
    enterApp: "Accéder à l'Application", learnMore: 'En Savoir Plus',
    landingFeaturesTitle: 'Conçu pour les laboratoires modernes',
    getStarted: 'Commencer Maintenant',

    // ── Pagination ──
    previous: 'Précédent', next: 'Suivant', showing: 'Affichage', of: 'sur',
    rowsPerPage: 'Lignes par page',
  },

  AR: {
    // ── Navigation ──
    dashboard: 'لوحة التحكم', samples: 'العينات', results: 'النتائج',
    inventory: 'المخزون', suppliers: 'الموردون', technicians: 'الفنيون',
    reports: 'التقارير', settings: 'الإعدادات',

    // ── Common actions ──
    add: 'إضافة', edit: 'تعديل', delete: 'حذف', save: 'حفظ', cancel: 'إلغاء',
    confirm: 'تأكيد', filter: 'تصفية', export: 'تصدير',
    exportCsv: 'تصدير CSV', exportPdf: 'تصدير PDF',
    loading: 'جاري التحميل…', noData: 'لا توجد بيانات متاحة',
    search: 'بحث…', signOut: 'تسجيل الخروج', close: 'إغلاق', back: 'رجوع',

    // ── Auth ──
    signIn: 'تسجيل الدخول', username: 'اسم المستخدم', email: 'عنوان البريد الإلكتروني',
    password: 'كلمة المرور', rememberMe: 'تذكرني',
    forgotPassword: 'هل نسيت كلمة المرور؟',
    invalidCredentials: 'بيانات الاعتماد غير صحيحة. يرجى المحاولة مرة أخرى.',

    // ── Notifications ──
    notifications: 'الإشعارات',

    // ── Dashboard ──
    dashboardTitle: 'لوحة التحكم',
    dashboardSubtitle: 'نظرة عامة على عمليات المختبر والتنبيهات',
    pendingSamples: 'العينات المعلقة', completedResults: 'النتائج المكتملة',
    delayedItems: 'العناصر المتأخرة', activeTechs: 'الفنيون النشطون',
    recentActivity: 'النشاط الأخير', viewAll: 'عرض الكل',
    newSample: 'عينة جديدة', overview: 'نظرة عامة على عمليات المختبر والتنبيهات',

    // ── Samples ──
    samplesTitle: 'العينات', samplesSubtitle: 'تسجيل وتتبع عينات المختبر',
    registerSample: 'تسجيل عينة', patientId: 'معرف المريض',
    sampleType: 'نوع العينة', priority: 'الأولوية', notes: 'ملاحظات',
    sampleId: 'معرف العينة', collectedAt: 'تاريخ الجمع',
    pending: 'معلق', processing: 'قيد المعالجة', completed: 'مكتمل', rejected: 'مرفوض',
    deleteSample: 'حذف العينة', confirmDelete: 'هل أنت متأكد من حذف هذا العنصر؟',
    allStatuses: 'جميع الحالات',

    // ── Results ──
    resultsTitle: 'النتائج', resultsSubtitle: 'عرض والتحقق من نتائج التحليل',

    // ── Inventory ──
    inventoryTitle: 'المخزون', inventorySubtitle: 'مراقبة الكواشف ومستويات المخزون',
    stockLevel: 'مستوى المخزون', lowStock: 'مخزون منخفض', inStock: 'متوفر', outOfStock: 'نفاد المخزون',

    // ── Suppliers ──
    suppliersTitle: 'الموردون', suppliersSubtitle: 'إدارة علاقات الموردين',
    supplierName: 'اسم المورد', phone: 'الهاتف', address: 'العنوان',
    active: 'نشط', inactive: 'غير نشط', addSupplier: 'إضافة مورد',

    // ── Technicians ──
    techniciansTitle: 'الفنيون', techniciansSubtitle: 'إدارة موظفي المختبر',
    name: 'الاسم', specialty: 'التخصص', service: 'القسم',
    addTechnician: 'إضافة فني', matricule: 'الرقم الوظيفي',

    // ── Reports ──
    reportsTitle: 'التحليلات والتقارير',
    reportsSubtitle: 'رؤى حول أداء المختبر واتجاهات العينات',
    totalSamples: 'إجمالي العينات', totalPatients: 'المرضى الفريدون',
    totalTests: 'الاختبارات المنجزة', avgTurnaround: 'متوسط وقت المعالجة (س)',
    samplesTrend: 'اتجاه العينات', statusDistribution: 'توزيع الحالات',
    testsByType: 'الاختبارات حسب نوع العينة', testsByCategory: 'الاختبارات حسب عائلة التحليل',
    dateFrom: 'من', dateTo: 'إلى', generateReport: 'إنشاء تقرير',

    // ── Settings ──
    settingsTitle: 'الإعدادات', settingsSubtitle: 'إدارة المقالات وظروف المخاطر',

    // ── Landing page ──
    landingHeroTitle: 'مستقبل إدارة المختبرات',
    landingHeroSubtitle: 'يبسّط LABOCORE سير عمل مختبرك بتتبع العينات في الوقت الفعلي وتحليلات BI القوية.',
    enterApp: 'دخول التطبيق', learnMore: 'اعرف المزيد',
    landingFeaturesTitle: 'مصمم للمختبرات الحديثة',
    getStarted: 'ابدأ الآن',

    // ── Pagination ──
    previous: 'السابق', next: 'التالي', showing: 'عرض', of: 'من',
    rowsPerPage: 'صفوف في الصفحة',
  },
}

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

  const setLanguage = (lang: Language) => setLanguageState(lang);

  const t = (key: string): string =>
    translations[language][key] || translations['EN'][key] || key;

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
