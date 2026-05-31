import type { LanguageCode, TranslationDict } from './languages';

// =====================================================================
// ROMANIAN — source of truth. All keys live here first.
// =====================================================================
const ro: TranslationDict = {
  // Common
  'common.loading': 'Se încarcă…',
  'common.retry': 'Reîncearcă',
  'common.error': 'A apărut o eroare.',
  'common.cancel': 'Anulează',
  'common.save': 'Salvează',
  'common.back': 'Înapoi',
  'common.close': 'Închide',
  'common.search': 'Caută',
  'common.yes': 'Da',
  'common.no': 'Nu',
  'common.create': 'Crează',
  'common.edit': 'Modifică',
  'common.delete': 'Șterge',
  'common.confirm': 'Confirmă',
  'common.empty': 'Nu există date.',
  'common.copy': 'Copiază',
  'common.copied': 'Copiat',
  'common.terms': 'Termeni și condiții',

  // Navigation
  'nav.dashboard': 'Acasă',
  'nav.available': 'Comenzi disponibile',
  'nav.active': 'Comenzile mele',
  'nav.delivered': 'Livrate',
  'nav.performance': 'Performanță',
  'nav.statistics': 'Statistici',
  'nav.finances': 'Finanțe',
  'nav.messages': 'Mesagerie',
  'nav.support': 'Asistență',
  'nav.profile': 'Profil',
  'nav.settings': 'Setări',
  'nav.about': 'Despre',
  'nav.referrals': 'Câștigă în plus',
  'nav.menu': 'Meniu',
  'nav.home': 'Acasă',
  'nav.manage': 'Gestiune comenzi',

  // Periods
  'period.today': 'Astăzi',
  'period.week': 'Săptămână',
  'period.month': 'Lună',

  // Performance
  'performance.title': 'Performanță',
  'performance.subtitle': 'Statistici despre activitatea ta de livrare.',
  'performance.acceptanceRate': 'Rata de acceptare',
  'performance.acceptanceRate.sub': 'Ponderea comenzilor acceptate din totalul comenzilor propuse',
  'performance.deliveries': 'Livrări finalizate',
  'performance.deliveries.sub': 'Numărul de comenzi livrate în perioada selectată',
  'performance.totalNet': 'Total net taxe',
  'performance.totalNet.sub': 'Taxe de livrare + bonusuri + ajustări + bacșiș + taxă Marketplace',
  'performance.cash': 'Tranzacții în numerar',
  'performance.cash.sub': 'Sumă în numerar lăsată la puncte de preluare - sumă în numerar încasată de la clienți',
  'performance.distance': 'Distanță parcursă (km)',
  'performance.distance.sub': 'Total kilometri parcurși în timpul livrărilor',
  'performance.completionRate': 'Rata de finalizare',
  'performance.tips': 'Bacșiș',
  'performance.avgFare': 'Câștig mediu / livrare',
  'performance.refresh': 'Reîmprospătează',

  // Statistics page
  'statistics.title': 'Statistici',
  'statistics.greeting': 'Bună! 👋 Iată cum arată săptămâna ta actuală. Îți mulțumim că ești curier partener și că le faci ziua mai bună clienților!',
  'statistics.hourly': 'Aceste date se actualizează în fiecare oră',
  'statistics.completedDeliveries': 'Livrări finalizate',
  'statistics.missingDeliveries': 'Finalizează {count} mai multe livrări pentru a-ți depăși totalul de săptămâna trecută!',
  'statistics.acceptedOrders': 'Comenzi acceptate',
  'statistics.opportunityWarning': 'Se pare că pierzi multe oportunități de câștig! 🥵',
  'statistics.completionRate': 'Rata de finalizare a comenzilor',
  'statistics.noDeliveriesYet': 'Nu s-au finalizat încă livrări.',

  // Finances page
  'finances.title': 'Finanțe',
  'finances.grossEarnings': 'CÂȘTIGURI BRUTE',
  'finances.nextPayout': 'Următoarea plată după {date}',
  'finances.pendingCash': 'NUMERAR ÎN AȘTEPTARE',
  'finances.recent': 'Tranzacții recente',
  'finances.empty': 'Nicio tranzacție momentan.',
  'finances.cashIncome': 'Încasare de numerar',
  'finances.cashDeposit': 'Depunere de numerar',

  // Deliveries list page
  'deliveries.title': 'Livrări',
  'deliveries.header': 'LIVRĂRI',
  'deliveries.empty': 'Nu există livrări încă.',
  'deliveries.fee': 'Taxă {km}',
  'deliveries.tip': 'Bacșiș',

  // Referrals
  'referrals.title': 'Recomandări',
  'referrals.headline': 'Recomandă și câștigă',
  'referrals.subtitle': 'Zona ta de livrare nu promovează o campanie de recomandare în acest moment. Vei fi primul care va afla când lucrurile se vor schimba.',
  'referrals.yourCode': 'Codul tău',
  'referrals.howItWorks': 'Cum funcționează?',
  'referrals.faq': 'ÎNTREBĂRI FRECVENTE',
  'referrals.step1.title': 'Distribuie codul de recomandare',
  'referrals.step1.desc': 'Nu există nicio limită de recomandare, așa că înscrie-ți toți prietenii la timp!',
  'referrals.step2.title': 'Îndeplinește misiunea',
  'referrals.step2.desc': 'Vor avea o misiune de livrare unică pentru a-i pune la încercare.',
  'referrals.step3.title': 'Împarte recompensele',
  'referrals.step3.desc': 'Întrece acest rezultat și amândoi veți obține un bonus la următoarea plată.',
  'referrals.faq1.q': 'Când devine activă o recomandare?',
  'referrals.faq1.a': 'După ce noul curier finalizează misiunea inițială stabilită de oraș.',
  'referrals.faq2.q': 'Când voi primi plata?',
  'referrals.faq2.a': 'Bonusul ajunge în următorul ciclu de plată după finalizarea misiunii.',
  'referrals.faq3.q': 'Pe cine pot recomanda?',
  'referrals.faq3.a': 'Pe oricine din orașul tău care nu a fost încă curier înregistrat.',
  'referrals.faq4.q': 'Cum funcționează misiunea de livrare?',
  'referrals.faq4.a': 'Noul curier trebuie să finalizeze un număr de livrări într-un interval definit.',
  'referrals.faq5.q': 'Ce se întâmplă dacă recomandarea mea nu are succes?',
  'referrals.faq5.a': 'Poți recomanda în continuare alți prieteni — nu există limită.',

  // Settings page
  'settings.title': 'Setări',
  'settings.section.navigation': 'Navigare',
  'settings.section.display': 'Afișaj și sunet',
  'settings.section.communication': 'Comunicare',
  'settings.section.language': 'Limbă',
  'settings.section.account': 'Cont',
  'settings.navApp': 'Aplicație de navigare',
  'settings.vehicle': 'Tip vehicul',
  'settings.appearance': 'Aspect',
  'settings.weekStart': 'Începe săptămâna pe',
  'settings.orderSound': 'Sunet comandă',
  'settings.feedback': 'Trimite feedback',
  'settings.language': 'Limbă',
  'settings.logout': 'Deconectează-te',
  'settings.privacy': 'Politica de confidențialitate',
  'settings.about': 'Despre aplicație',

  // Profile menu
  'profile.title': 'Profil',
  'profile.offline': 'Deconectat',
  'profile.version': 'Versiune {version}',
  'profile.deliverySettings': 'Setări livrare',
  'profile.statistics': 'Statistici',
  'profile.finances': 'Finanțe',
  'profile.bonus': 'Câștigă în plus',
  'profile.referrals': 'Referințe',
  'profile.documents': 'Documente',
  'profile.messages': 'Mesaje',
  'profile.support': 'Asistență',
  'profile.settings': 'Setări',

  // Language picker
  'language.title': 'Selectează limba',

  // Auth
  'auth.loggedOut': 'Te-ai deconectat cu succes.',

  // Snackbar
  'snack.languageChanged': 'Limba a fost schimbată.',
  'snack.settingsSaved': 'Setările au fost salvate.',
  'snack.codeCopied': 'Cod copiat',

  // Order management (dispatcher)
  'manage.title': 'Gestiune comenzi',
  'manage.subtitle': 'Creează, modifică și anulează comenzi.',
  'manage.create': 'Comandă nouă',
  'manage.edit': 'Modifică comanda',
  'manage.cancelOrder': 'Anulează comanda',
  'manage.empty': 'Nu există comenzi.',
  'manage.col.number': 'Număr',
  'manage.col.partner': 'Partener',
  'manage.col.customer': 'Client',
  'manage.col.status': 'Status',
  'manage.col.pickup': 'Preluare',
  'manage.col.delivery': 'Livrare',
  'manage.col.actions': 'Acțiuni',
  'manage.field.partner': 'Partener',
  'manage.field.customer': 'Client',
  'manage.field.pickupAddress': 'Adresă preluare',
  'manage.field.deliveryAddress': 'Adresă livrare',
  'manage.field.street': 'Stradă',
  'manage.field.city': 'Oraș',
  'manage.field.postalCode': 'Cod poștal',
  'manage.field.country': 'Țară',
  'manage.field.pickupStart': 'Început fereastră preluare',
  'manage.field.pickupEnd': 'Sfârșit fereastră preluare',
  'manage.field.deliveryStart': 'Început fereastră livrare',
  'manage.field.deliveryEnd': 'Sfârșit fereastră livrare',
  'manage.field.notes': 'Notițe',
  'manage.field.specialInstructions': 'Instrucțiuni speciale',
  'manage.field.items': 'Articole',
  'manage.field.item.type': 'Tip',
  'manage.field.item.description': 'Descriere',
  'manage.field.item.quantity': 'Cantitate',
  'manage.field.item.weight': 'Greutate (kg)',
  'manage.field.item.notes': 'Notițe',
  'manage.addItem': 'Adaugă articol',
  'manage.cancelReason': 'Motiv anulare',
  'manage.confirmCancel': 'Sigur anulezi comanda {number}?',
  'manage.created': 'Comanda a fost creată.',
  'manage.updated': 'Comanda a fost actualizată.',
  'manage.cancelled': 'Comanda a fost anulată.',
  'manage.driversCannotCreate': 'Șoferii nu pot crea sau modifica comenzi.',

  // Dashboard
  'dashboard.title': 'Panou șofer',
  'dashboard.subtitle': 'Vezi mai întâi munca care necesită atenție.',
  'dashboard.metric.available': 'Disponibile',
  'dashboard.metric.active': 'Active',
  'dashboard.metric.delivered': 'Livrate',
  'dashboard.myActive': 'Comenzile mele active',
  'dashboard.viewAll': 'Vezi toate',

  // Orders – common labels
  'order.back': 'Înapoi',
  'order.pickup': 'Preluare',
  'order.delivery': 'Livrare',
  'order.items': 'Articole de procesat',
  'order.customer': 'Client',
  'order.partner': 'Partener',
  'order.notesTitle': 'Note și instrucțiuni',
  'order.history': 'Istoric statusuri',
  'order.specialInstructions': '- instrucțiuni speciale',
  'order.accept': 'Acceptă comanda',
  'order.markPickedUp': 'Marchează ca preluată',
  'order.markDelivered': 'Marchează ca livrată',
  'order.actions.accept': 'Acceptă comanda',
  'order.idMissing': 'Lipsește ID-ul comenzii.',
  'order.loadingDetails': 'Se încarcă detaliile comenzii…',
  'order.search': 'Caută comenzi, client, adresă…',
  'order.searchDelivered': 'Caută comenzi livrate…',
  'order.list.available.title': 'Comenzi disponibile',
  'order.list.available.subtitle': 'Acceptă comenzile gata de preluare.',
  'order.list.available.loading': 'Se încarcă comenzile disponibile…',
  'order.list.available.emptyTitle': 'Nicio comandă disponibilă',
  'order.list.available.emptyDesc': 'Comenzile noi vor apărea aici.',
  'order.list.active.title': 'Comenzile mele active',
  'order.list.active.subtitle': 'Continuă comenzile acceptate sau preluate.',
  'order.list.active.loading': 'Se încarcă comenzile active…',
  'order.list.active.emptyTitle': 'Nicio comandă activă',
  'order.list.active.emptyDesc': 'Acceptă o comandă pentru a începe.',
  'order.list.delivered.title': 'Comenzi livrate',
  'order.list.delivered.subtitle': 'Istoricul livrărilor finalizate.',
  'order.list.delivered.loading': 'Se încarcă comenzile livrate…',
  'order.list.delivered.emptyTitle': 'Nicio comandă livrată',
  'order.list.delivered.emptyDesc': 'Comenzile finalizate vor apărea aici.',

  // Login
  'login.appName': 'DeliveryApp',
  'login.tagline': 'Gestiune livrări pentru șoferi',
  'login.email': 'Email',
  'login.password': 'Parolă',
  'login.submit': 'Autentificare',
  'login.submitting': 'Se conectează…',
  'login.demoHint': 'Demo șofer: driver1@example.com / Password123!',

  // Not found
  'notFound.title': 'Pagina nu a fost găsită',
  'notFound.subtitle': 'Linkul accesat nu există.',
  'notFound.back': 'Înapoi la panou',

  // About page
  'about.title': 'Despre',
  'about.appVersion': 'Versiunea aplicației',
  'about.updates': 'Actualizări versiune',
  'about.cfBundle': 'CFBundle',
  'about.localDevice': 'Dispozitiv local',
  'about.appLocal': 'App Local',
  'about.privacy': 'Confidențialitate',
  'about.licenses': 'Licențe',

  // Appearance settings
  'appearance.title': 'Aspect',
  'appearance.system': 'Utilizează aspectul dispozitivului',
  'appearance.light': 'Luminos',
  'appearance.dark': 'Întunecat',
  'appearance.animations': 'Animații',
  'appearance.reduce': 'Redu animațiile',
  'appearance.reduceDesc': 'Dezactivează animațiile din josul paginii',

  // Delivery settings
  'deliverySettings.title': 'Personalizează-ți setările de livrare',
  'deliverySettings.zone': 'Zona de livrare',
  'deliverySettings.city': 'Brașov',
  'deliverySettings.demandMedium': 'Mediu',
  'deliverySettings.demandDesc': 'Cererea este actualizată în timp real în funcție de comenzile active din zonă.',

  // Feedback
  'feedback.title': 'Feedback',
  'feedback.topic.app.title': 'Funcționalitatea aplicației',
  'feedback.topic.app.desc': 'Cum ți s-a părut aplicația? S-a potrivit timpul estimat?',
  'feedback.topic.locations.title': 'Locații',
  'feedback.topic.locations.desc': 'Cum a fost colaborarea ta cu locația parteneră?',
  'feedback.topic.support.title': 'Suport',
  'feedback.topic.support.desc': 'A fost totul în regulă cu suportul oferit?',
  'feedback.commentLabel': 'Comentariu',
  'feedback.addComment': 'Adaugă un comentariu',
  'feedback.submit': 'Oferă feedback',
  'feedback.thanks': 'Mulțumim pentru feedback!',

  // Messages
  'messages.title': 'Mesaje',
  'messages.subtitle': 'Noutăți și anunțuri pentru curieri.',

  // Navigation settings
  'navSettings.title': 'Navigație',

  // Vehicle
  'vehicle.title': 'Tip vehicul',
  'vehicle.car': 'Mașină',
  'vehicle.bike': 'Bicicletă',
  'vehicle.foot': 'Pe jos',

  // Support
  'support.title': 'Cum te putem ajuta?',
  'support.selectOrder': 'Selectează comanda…',
  'support.showMore': 'Arată mai multe',
  'support.noActive': 'Nicio comandă activă.',
  'support.otherTopics': 'Alte subiecte',
  'support.topic.noOrders': 'Nu am mai primit comenzi de ceva vreme - de ce?',
  'support.topic.account': 'Contul meu de partener',
  'support.topic.payments': 'Plăți',
  'support.topic.equipment': 'Echipament',
  'support.topic.conversations': 'Conversațiile mele',
  'support.customer': 'Client'
};

// =====================================================================
// ENGLISH — full coverage with same keys.
// =====================================================================
const en: TranslationDict = {
  'common.loading': 'Loading…',
  'common.retry': 'Retry',
  'common.error': 'Something went wrong.',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.back': 'Back',
  'common.close': 'Close',
  'common.search': 'Search',
  'common.yes': 'Yes',
  'common.no': 'No',
  'common.create': 'Create',
  'common.edit': 'Edit',
  'common.delete': 'Delete',
  'common.confirm': 'Confirm',
  'common.empty': 'No data.',
  'common.copy': 'Copy',
  'common.copied': 'Copied',
  'common.terms': 'Terms & conditions',

  'nav.dashboard': 'Home',
  'nav.available': 'Available orders',
  'nav.active': 'My orders',
  'nav.delivered': 'Delivered',
  'nav.performance': 'Performance',
  'nav.statistics': 'Statistics',
  'nav.finances': 'Earnings',
  'nav.messages': 'Messages',
  'nav.support': 'Support',
  'nav.profile': 'Profile',
  'nav.settings': 'Settings',
  'nav.about': 'About',
  'nav.referrals': 'Earn extra',
  'nav.menu': 'Menu',
  'nav.home': 'Home',
  'nav.manage': 'Order management',

  'period.today': 'Today',
  'period.week': 'Week',
  'period.month': 'Month',

  'performance.title': 'Performance',
  'performance.subtitle': 'Statistics about your delivery activity.',
  'performance.acceptanceRate': 'Acceptance rate',
  'performance.acceptanceRate.sub': 'Share of accepted orders out of all proposed orders',
  'performance.deliveries': 'Completed deliveries',
  'performance.deliveries.sub': 'Number of orders delivered in the selected period',
  'performance.totalNet': 'Net total earnings',
  'performance.totalNet.sub': 'Delivery fees + bonuses + adjustments + tips + Marketplace fee',
  'performance.cash': 'Cash transactions',
  'performance.cash.sub': 'Cash left at pickup points minus cash collected from customers',
  'performance.distance': 'Distance covered (km)',
  'performance.distance.sub': 'Total kilometres driven during deliveries',
  'performance.completionRate': 'Completion rate',
  'performance.tips': 'Tips',
  'performance.avgFare': 'Average fare / delivery',
  'performance.refresh': 'Refresh',

  'statistics.title': 'Statistics',
  'statistics.greeting': 'Hi! 👋 Here is how your current week looks. Thank you for being a partner courier and brightening our customers\u2019 day!',
  'statistics.hourly': 'This data refreshes every hour',
  'statistics.completedDeliveries': 'Completed deliveries',
  'statistics.missingDeliveries': 'Complete {count} more deliveries to beat last week\u2019s total!',
  'statistics.acceptedOrders': 'Accepted orders',
  'statistics.opportunityWarning': 'It looks like you are missing many earning opportunities! 🥵',
  'statistics.completionRate': 'Order completion rate',
  'statistics.noDeliveriesYet': 'No deliveries completed yet.',

  'finances.title': 'Earnings',
  'finances.grossEarnings': 'GROSS EARNINGS',
  'finances.nextPayout': 'Next payout after {date}',
  'finances.pendingCash': 'CASH PENDING',
  'finances.recent': 'Recent transactions',
  'finances.empty': 'No transactions yet.',
  'finances.cashIncome': 'Cash income',
  'finances.cashDeposit': 'Cash deposit',

  'deliveries.title': 'Deliveries',
  'deliveries.header': 'DELIVERIES',
  'deliveries.empty': 'No deliveries yet.',
  'deliveries.fee': 'Fee {km}',
  'deliveries.tip': 'Tip',

  'referrals.title': 'Referrals',
  'referrals.headline': 'Refer & earn',
  'referrals.subtitle': 'Your delivery area is not running a referral campaign right now. You will be the first to know when this changes.',
  'referrals.yourCode': 'Your code',
  'referrals.howItWorks': 'How it works?',
  'referrals.faq': 'FREQUENTLY ASKED QUESTIONS',
  'referrals.step1.title': 'Share your referral code',
  'referrals.step1.desc': 'There is no referral limit, so sign up all your friends in time!',
  'referrals.step2.title': 'Complete the mission',
  'referrals.step2.desc': 'They will have a unique delivery mission to put them to the test.',
  'referrals.step3.title': 'Share the rewards',
  'referrals.step3.desc': 'Beat this result and you both get a bonus on the next payout.',
  'referrals.faq1.q': 'When does a referral become active?',
  'referrals.faq1.a': 'After the new courier completes the city\u2019s initial mission.',
  'referrals.faq2.q': 'When will I get paid?',
  'referrals.faq2.a': 'The bonus arrives in the next payout cycle after mission completion.',
  'referrals.faq3.q': 'Who can I refer?',
  'referrals.faq3.a': 'Anyone in your city who has not registered as a courier yet.',
  'referrals.faq4.q': 'How does the delivery mission work?',
  'referrals.faq4.a': 'The new courier must complete a number of deliveries within a defined interval.',
  'referrals.faq5.q': 'What happens if my referral is unsuccessful?',
  'referrals.faq5.a': 'You can keep referring other friends — there is no limit.',

  'settings.title': 'Settings',
  'settings.section.navigation': 'Navigation',
  'settings.section.display': 'Display & sound',
  'settings.section.communication': 'Communication',
  'settings.section.language': 'Language',
  'settings.section.account': 'Account',
  'settings.navApp': 'Navigation app',
  'settings.vehicle': 'Vehicle type',
  'settings.appearance': 'Appearance',
  'settings.weekStart': 'Week starts on',
  'settings.orderSound': 'Order sound',
  'settings.feedback': 'Send feedback',
  'settings.language': 'Language',
  'settings.logout': 'Log out',
  'settings.privacy': 'Privacy policy',
  'settings.about': 'About the app',

  'profile.title': 'Profile',
  'profile.offline': 'Offline',
  'profile.version': 'Version {version}',
  'profile.deliverySettings': 'Delivery settings',
  'profile.statistics': 'Statistics',
  'profile.finances': 'Earnings',
  'profile.bonus': 'Earn extra',
  'profile.referrals': 'Referrals',
  'profile.documents': 'Documents',
  'profile.messages': 'Messages',
  'profile.support': 'Support',
  'profile.settings': 'Settings',

  'language.title': 'Select language',

  'auth.loggedOut': 'You have been logged out.',

  'snack.languageChanged': 'Language changed.',
  'snack.settingsSaved': 'Settings saved.',
  'snack.codeCopied': 'Code copied',

  'manage.title': 'Order management',
  'manage.subtitle': 'Create, modify and cancel orders.',
  'manage.create': 'New order',
  'manage.edit': 'Edit order',
  'manage.cancelOrder': 'Cancel order',
  'manage.empty': 'No orders.',
  'manage.col.number': 'Number',
  'manage.col.partner': 'Partner',
  'manage.col.customer': 'Customer',
  'manage.col.status': 'Status',
  'manage.col.pickup': 'Pickup',
  'manage.col.delivery': 'Delivery',
  'manage.col.actions': 'Actions',
  'manage.field.partner': 'Partner',
  'manage.field.customer': 'Customer',
  'manage.field.pickupAddress': 'Pickup address',
  'manage.field.deliveryAddress': 'Delivery address',
  'manage.field.street': 'Street',
  'manage.field.city': 'City',
  'manage.field.postalCode': 'Postal code',
  'manage.field.country': 'Country',
  'manage.field.pickupStart': 'Pickup window start',
  'manage.field.pickupEnd': 'Pickup window end',
  'manage.field.deliveryStart': 'Delivery window start',
  'manage.field.deliveryEnd': 'Delivery window end',
  'manage.field.notes': 'Notes',
  'manage.field.specialInstructions': 'Special instructions',
  'manage.field.items': 'Items',
  'manage.field.item.type': 'Type',
  'manage.field.item.description': 'Description',
  'manage.field.item.quantity': 'Quantity',
  'manage.field.item.weight': 'Weight (kg)',
  'manage.field.item.notes': 'Notes',
  'manage.addItem': 'Add item',
  'manage.cancelReason': 'Cancel reason',
  'manage.confirmCancel': 'Cancel order {number}?',
  'manage.created': 'Order created.',
  'manage.updated': 'Order updated.',
  'manage.cancelled': 'Order cancelled.',
  'manage.driversCannotCreate': 'Drivers cannot create or modify orders.',

  // Dashboard
  'dashboard.title': 'Driver dashboard',
  'dashboard.subtitle': 'See work that needs attention first.',
  'dashboard.metric.available': 'Available',
  'dashboard.metric.active': 'Active',
  'dashboard.metric.delivered': 'Delivered',
  'dashboard.myActive': 'My active orders',
  'dashboard.viewAll': 'View all',

  // Orders – common labels
  'order.back': 'Back',
  'order.pickup': 'Pickup',
  'order.delivery': 'Delivery',
  'order.items': 'Items to handle',
  'order.customer': 'Customer',
  'order.partner': 'Partner business',
  'order.notesTitle': 'Notes and instructions',
  'order.history': 'Status history',
  'order.specialInstructions': '- special instructions',
  'order.accept': 'Accept order',
  'order.markPickedUp': 'Mark picked up',
  'order.markDelivered': 'Mark delivered',
  'order.actions.accept': 'Accept order',
  'order.idMissing': 'Order id is missing.',
  'order.loadingDetails': 'Loading order details…',
  'order.search': 'Search orders, customer, address…',
  'order.searchDelivered': 'Search delivered orders…',
  'order.list.available.title': 'Available orders',
  'order.list.available.subtitle': 'Accept jobs that are ready for pickup.',
  'order.list.available.loading': 'Loading available orders…',
  'order.list.available.emptyTitle': 'No available orders',
  'order.list.available.emptyDesc': 'New dispatcher-created orders will appear here.',
  'order.list.active.title': 'My active orders',
  'order.list.active.subtitle': 'Continue accepted and picked-up jobs.',
  'order.list.active.loading': 'Loading active orders…',
  'order.list.active.emptyTitle': 'No active orders',
  'order.list.active.emptyDesc': 'Accept an available order to start working.',
  'order.list.delivered.title': 'Delivered orders',
  'order.list.delivered.subtitle': 'Review completed delivery history.',
  'order.list.delivered.loading': 'Loading delivered orders…',
  'order.list.delivered.emptyTitle': 'No delivered orders',
  'order.list.delivered.emptyDesc': 'Completed orders will appear here.',

  // Login
  'login.appName': 'DeliveryApp',
  'login.tagline': 'Driver delivery management',
  'login.email': 'Email',
  'login.password': 'Password',
  'login.submit': 'Sign in',
  'login.submitting': 'Signing in…',
  'login.demoHint': 'Demo driver: driver1@example.com / Password123!',

  // Not found
  'notFound.title': 'Page not found',
  'notFound.subtitle': 'The link you opened does not exist.',
  'notFound.back': 'Back to dashboard',

  // About page
  'about.title': 'About',
  'about.appVersion': 'App version',
  'about.updates': 'Version updates',
  'about.cfBundle': 'CFBundle',
  'about.localDevice': 'Local device',
  'about.appLocal': 'App locale',
  'about.privacy': 'Privacy',
  'about.licenses': 'Licenses',

  // Appearance settings
  'appearance.title': 'Appearance',
  'appearance.system': 'Use device appearance',
  'appearance.light': 'Light',
  'appearance.dark': 'Dark',
  'appearance.animations': 'Animations',
  'appearance.reduce': 'Reduce animations',
  'appearance.reduceDesc': 'Disable bottom-of-page animations',

  // Delivery settings
  'deliverySettings.title': 'Customize your delivery settings',
  'deliverySettings.zone': 'Delivery zone',
  'deliverySettings.city': 'Brașov',
  'deliverySettings.demandMedium': 'Medium',
  'deliverySettings.demandDesc': 'Demand is updated in real time based on active orders in the area.',

  // Feedback
  'feedback.title': 'Feedback',
  'feedback.topic.app.title': 'App functionality',
  'feedback.topic.app.desc': 'How did the app feel? Did the estimated time match?',
  'feedback.topic.locations.title': 'Locations',
  'feedback.topic.locations.desc': 'How was your collaboration with the partner location?',
  'feedback.topic.support.title': 'Support',
  'feedback.topic.support.desc': 'Was everything fine with the support you received?',
  'feedback.commentLabel': 'Comment',
  'feedback.addComment': 'Add a comment',
  'feedback.submit': 'Send feedback',
  'feedback.thanks': 'Thanks for your feedback!',

  // Messages
  'messages.title': 'Messages',
  'messages.subtitle': 'News and announcements for couriers.',

  // Navigation settings
  'navSettings.title': 'Navigation',

  // Vehicle
  'vehicle.title': 'Vehicle type',
  'vehicle.car': 'Car',
  'vehicle.bike': 'Bicycle',
  'vehicle.foot': 'On foot',

  // Support
  'support.title': 'How can we help?',
  'support.selectOrder': 'Select an order…',
  'support.showMore': 'Show more',
  'support.noActive': 'No active orders.',
  'support.otherTopics': 'Other topics',
  'support.topic.noOrders': "I haven't received orders for a while - why?",
  'support.topic.account': 'My partner account',
  'support.topic.payments': 'Payments',
  'support.topic.equipment': 'Equipment',
  'support.topic.conversations': 'My conversations',
  'support.customer': 'Customer'
};

// =====================================================================
// Partial translations for other locales. Missing keys fall back to EN → RO.
// Coverage focuses on navigation, periods, statistics greeting, finances/
// deliveries titles, settings, profile menu and language picker.
// =====================================================================

const cs: TranslationDict = {
  'common.copy': 'Kopírovat', 'common.copied': 'Zkopírováno', 'common.cancel': 'Zrušit', 'common.save': 'Uložit', 'common.back': 'Zpět', 'common.close': 'Zavřít', 'common.retry': 'Zkusit znovu', 'common.error': 'Něco se pokazilo.', 'common.empty': 'Žádná data.',
  'nav.dashboard': 'Domů', 'nav.available': 'Dostupné objednávky', 'nav.active': 'Moje objednávky', 'nav.delivered': 'Doručeno', 'nav.performance': 'Výkon', 'nav.statistics': 'Statistiky', 'nav.finances': 'Výdělky', 'nav.messages': 'Zprávy', 'nav.support': 'Podpora', 'nav.profile': 'Profil', 'nav.settings': 'Nastavení', 'nav.about': 'O aplikaci', 'nav.referrals': 'Doporučení', 'nav.menu': 'Nabídka', 'nav.home': 'Domů', 'nav.manage': 'Správa objednávek',
  'period.today': 'Dnes', 'period.week': 'Týden', 'period.month': 'Měsíc',
  'performance.title': 'Výkon', 'performance.subtitle': 'Statistiky tvé doručovací aktivity.', 'performance.refresh': 'Obnovit',
  'statistics.title': 'Statistiky', 'statistics.greeting': 'Ahoj! 👋 Takto vypadá tvůj aktuální týden. Děkujeme, že jsi partnerský kurýr!', 'statistics.hourly': 'Tato data se aktualizují každou hodinu', 'statistics.completedDeliveries': 'Dokončené doručení', 'statistics.acceptedOrders': 'Přijaté objednávky', 'statistics.completionRate': 'Míra dokončení objednávek', 'statistics.noDeliveriesYet': 'Žádné dokončené doručení.',
  'finances.title': 'Výdělky', 'finances.grossEarnings': 'HRUBÉ VÝDĚLKY', 'finances.pendingCash': 'HOTOVOST K VYŘÍZENÍ', 'finances.recent': 'Nedávné transakce', 'finances.empty': 'Zatím žádné transakce.',
  'deliveries.title': 'Doručení', 'deliveries.header': 'DORUČENÍ', 'deliveries.empty': 'Zatím žádné doručení.', 'deliveries.tip': 'Spropitné',
  'referrals.title': 'Doporučení', 'referrals.yourCode': 'Tvůj kód', 'referrals.howItWorks': 'Jak to funguje?', 'referrals.faq': 'ČASTÉ DOTAZY',
  'settings.title': 'Nastavení', 'settings.logout': 'Odhlásit se', 'settings.language': 'Jazyk', 'settings.about': 'O aplikaci',
  'profile.title': 'Profil', 'profile.offline': 'Offline',
  'language.title': 'Vyber jazyk', 'snack.languageChanged': 'Jazyk změněn.', 'snack.codeCopied': 'Kód zkopírován'
};

const pl: TranslationDict = {
  'common.copy': 'Kopiuj', 'common.copied': 'Skopiowano', 'common.cancel': 'Anuluj', 'common.save': 'Zapisz', 'common.back': 'Wstecz', 'common.close': 'Zamknij', 'common.retry': 'Spróbuj ponownie', 'common.error': 'Coś poszło nie tak.',
  'nav.dashboard': 'Główna', 'nav.available': 'Dostępne zamówienia', 'nav.active': 'Moje zamówienia', 'nav.delivered': 'Dostarczone', 'nav.performance': 'Wyniki', 'nav.statistics': 'Statystyki', 'nav.finances': 'Zarobki', 'nav.messages': 'Wiadomości', 'nav.support': 'Pomoc', 'nav.profile': 'Profil', 'nav.settings': 'Ustawienia', 'nav.about': 'O aplikacji', 'nav.referrals': 'Polecenia', 'nav.menu': 'Menu', 'nav.home': 'Główna', 'nav.manage': 'Zarządzanie zamówieniami',
  'period.today': 'Dziś', 'period.week': 'Tydzień', 'period.month': 'Miesiąc',
  'performance.title': 'Wyniki', 'performance.subtitle': 'Statystyki twojej aktywności dostawczej.', 'performance.refresh': 'Odśwież',
  'statistics.title': 'Statystyki', 'statistics.greeting': 'Cześć! 👋 Tak wygląda twój aktualny tydzień. Dzięki, że jesteś partnerem!', 'statistics.hourly': 'Dane są odświeżane co godzinę', 'statistics.completedDeliveries': 'Ukończone dostawy', 'statistics.acceptedOrders': 'Zaakceptowane zamówienia', 'statistics.completionRate': 'Wskaźnik ukończenia', 'statistics.noDeliveriesYet': 'Brak ukończonych dostaw.',
  'finances.title': 'Zarobki', 'finances.grossEarnings': 'ZAROBKI BRUTTO', 'finances.pendingCash': 'GOTÓWKA OCZEKUJĄCA', 'finances.recent': 'Ostatnie transakcje', 'finances.empty': 'Brak transakcji.',
  'deliveries.title': 'Dostawy', 'deliveries.header': 'DOSTAWY', 'deliveries.empty': 'Brak dostaw.', 'deliveries.tip': 'Napiwek',
  'referrals.title': 'Polecenia', 'referrals.yourCode': 'Twój kod', 'referrals.howItWorks': 'Jak to działa?', 'referrals.faq': 'CZĘSTO ZADAWANE PYTANIA',
  'settings.title': 'Ustawienia', 'settings.logout': 'Wyloguj się', 'settings.language': 'Język', 'settings.about': 'O aplikacji',
  'profile.title': 'Profil', 'profile.offline': 'Offline',
  'language.title': 'Wybierz język', 'snack.languageChanged': 'Język został zmieniony.', 'snack.codeCopied': 'Kod skopiowany'
};

const hu: TranslationDict = {
  'common.copy': 'Másolás', 'common.copied': 'Másolva', 'common.cancel': 'Mégse', 'common.save': 'Mentés', 'common.back': 'Vissza', 'common.retry': 'Újra', 'common.error': 'Hiba történt.',
  'nav.dashboard': 'Kezdőlap', 'nav.available': 'Elérhető rendelések', 'nav.active': 'Rendeléseim', 'nav.delivered': 'Kézbesítve', 'nav.performance': 'Teljesítmény', 'nav.statistics': 'Statisztikák', 'nav.finances': 'Kereset', 'nav.messages': 'Üzenetek', 'nav.support': 'Súgó', 'nav.profile': 'Profil', 'nav.settings': 'Beállítások', 'nav.about': 'Névjegy', 'nav.menu': 'Menü', 'nav.home': 'Kezdőlap', 'nav.manage': 'Rendeléskezelés',
  'period.today': 'Ma', 'period.week': 'Hét', 'period.month': 'Hónap',
  'performance.title': 'Teljesítmény', 'performance.refresh': 'Frissítés',
  'statistics.title': 'Statisztikák', 'statistics.greeting': 'Szia! 👋 Így néz ki a héted.', 'statistics.completedDeliveries': 'Befejezett kézbesítések', 'statistics.acceptedOrders': 'Elfogadott rendelések', 'statistics.completionRate': 'Befejezési arány',
  'finances.title': 'Kereset', 'finances.recent': 'Legutóbbi tranzakciók', 'finances.empty': 'Nincs tranzakció.',
  'deliveries.title': 'Kézbesítések', 'deliveries.empty': 'Nincs kézbesítés.', 'deliveries.tip': 'Borravaló',
  'referrals.title': 'Ajánlások', 'referrals.yourCode': 'A kódod',
  'settings.title': 'Beállítások', 'settings.logout': 'Kijelentkezés', 'settings.language': 'Nyelv',
  'profile.title': 'Profil', 'profile.offline': 'Offline',
  'language.title': 'Válassz nyelvet', 'snack.languageChanged': 'A nyelv megváltozott.'
};

const pt: TranslationDict = {
  'common.copy': 'Copiar', 'common.copied': 'Copiado', 'common.cancel': 'Cancelar', 'common.save': 'Guardar', 'common.back': 'Voltar', 'common.retry': 'Tentar de novo', 'common.error': 'Ocorreu um erro.',
  'nav.dashboard': 'Início', 'nav.available': 'Pedidos disponíveis', 'nav.active': 'Meus pedidos', 'nav.delivered': 'Entregues', 'nav.performance': 'Desempenho', 'nav.statistics': 'Estatísticas', 'nav.finances': 'Ganhos', 'nav.messages': 'Mensagens', 'nav.support': 'Suporte', 'nav.profile': 'Perfil', 'nav.settings': 'Configurações', 'nav.about': 'Sobre', 'nav.menu': 'Menu', 'nav.home': 'Início', 'nav.manage': 'Gestão de pedidos',
  'period.today': 'Hoje', 'period.week': 'Semana', 'period.month': 'Mês',
  'performance.title': 'Desempenho', 'performance.refresh': 'Atualizar',
  'statistics.title': 'Estatísticas', 'statistics.greeting': 'Olá! 👋 Esta é a tua semana atual.', 'statistics.completedDeliveries': 'Entregas concluídas', 'statistics.acceptedOrders': 'Pedidos aceites', 'statistics.completionRate': 'Taxa de conclusão',
  'finances.title': 'Ganhos', 'finances.recent': 'Transações recentes', 'finances.empty': 'Sem transações.',
  'deliveries.title': 'Entregas', 'deliveries.empty': 'Sem entregas.', 'deliveries.tip': 'Gorjeta',
  'referrals.title': 'Indicações', 'referrals.yourCode': 'O teu código',
  'settings.title': 'Configurações', 'settings.logout': 'Sair', 'settings.language': 'Idioma',
  'profile.title': 'Perfil', 'profile.offline': 'Offline',
  'language.title': 'Selecionar idioma', 'snack.languageChanged': 'Idioma alterado.'
};

const el: TranslationDict = {
  'common.copy': 'Αντιγραφή', 'common.copied': 'Αντιγράφηκε', 'common.cancel': 'Άκυρο', 'common.save': 'Αποθήκευση', 'common.back': 'Πίσω', 'common.retry': 'Ξαναδοκίμασε', 'common.error': 'Κάτι πήγε στραβά.',
  'nav.dashboard': 'Αρχική', 'nav.available': 'Διαθέσιμες παραγγελίες', 'nav.active': 'Οι παραγγελίες μου', 'nav.delivered': 'Παραδόθηκαν', 'nav.performance': 'Απόδοση', 'nav.statistics': 'Στατιστικά', 'nav.finances': 'Έσοδα', 'nav.messages': 'Μηνύματα', 'nav.support': 'Υποστήριξη', 'nav.profile': 'Προφίλ', 'nav.settings': 'Ρυθμίσεις', 'nav.about': 'Σχετικά', 'nav.menu': 'Μενού', 'nav.home': 'Αρχική', 'nav.manage': 'Διαχείριση παραγγελιών',
  'period.today': 'Σήμερα', 'period.week': 'Εβδομάδα', 'period.month': 'Μήνας',
  'performance.title': 'Απόδοση', 'performance.refresh': 'Ανανέωση',
  'statistics.title': 'Στατιστικά', 'statistics.greeting': 'Γεια! 👋 Έτσι πάει η εβδομάδα σου.', 'statistics.completedDeliveries': 'Ολοκληρωμένες παραδόσεις', 'statistics.acceptedOrders': 'Παραγγελίες που έγιναν δεκτές', 'statistics.completionRate': 'Ποσοστό ολοκλήρωσης',
  'finances.title': 'Έσοδα', 'finances.recent': 'Πρόσφατες συναλλαγές', 'finances.empty': 'Καμία συναλλαγή.',
  'deliveries.title': 'Παραδόσεις', 'deliveries.empty': 'Καμία παράδοση.', 'deliveries.tip': 'Φιλοδώρημα',
  'referrals.title': 'Συστάσεις', 'referrals.yourCode': 'Ο κωδικός σου',
  'settings.title': 'Ρυθμίσεις', 'settings.logout': 'Αποσύνδεση', 'settings.language': 'Γλώσσα',
  'profile.title': 'Προφίλ', 'profile.offline': 'Εκτός σύνδεσης',
  'language.title': 'Επιλογή γλώσσας', 'snack.languageChanged': 'Η γλώσσα άλλαξε.'
};

const sv: TranslationDict = {
  'common.copy': 'Kopiera', 'common.copied': 'Kopierat', 'common.cancel': 'Avbryt', 'common.save': 'Spara', 'common.back': 'Tillbaka', 'common.retry': 'Försök igen', 'common.error': 'Något gick fel.',
  'nav.dashboard': 'Hem', 'nav.available': 'Tillgängliga ordrar', 'nav.active': 'Mina ordrar', 'nav.delivered': 'Levererade', 'nav.performance': 'Prestanda', 'nav.statistics': 'Statistik', 'nav.finances': 'Inkomster', 'nav.messages': 'Meddelanden', 'nav.support': 'Support', 'nav.profile': 'Profil', 'nav.settings': 'Inställningar', 'nav.about': 'Om', 'nav.menu': 'Meny', 'nav.home': 'Hem', 'nav.manage': 'Orderhantering',
  'period.today': 'Idag', 'period.week': 'Vecka', 'period.month': 'Månad',
  'performance.title': 'Prestanda', 'performance.refresh': 'Uppdatera',
  'statistics.title': 'Statistik', 'statistics.greeting': 'Hej! 👋 Så här ser veckan ut.', 'statistics.completedDeliveries': 'Slutförda leveranser', 'statistics.acceptedOrders': 'Accepterade ordrar', 'statistics.completionRate': 'Slutförandegrad',
  'finances.title': 'Inkomster', 'finances.recent': 'Senaste transaktioner', 'finances.empty': 'Inga transaktioner.',
  'deliveries.title': 'Leveranser', 'deliveries.empty': 'Inga leveranser.', 'deliveries.tip': 'Dricks',
  'referrals.title': 'Rekommendationer', 'referrals.yourCode': 'Din kod',
  'settings.title': 'Inställningar', 'settings.logout': 'Logga ut', 'settings.language': 'Språk',
  'profile.title': 'Profil', 'profile.offline': 'Offline',
  'language.title': 'Välj språk', 'snack.languageChanged': 'Språket har ändrats.'
};

const fi: TranslationDict = {
  'common.copy': 'Kopioi', 'common.copied': 'Kopioitu', 'common.cancel': 'Peruuta', 'common.save': 'Tallenna', 'common.back': 'Takaisin', 'common.retry': 'Yritä uudelleen', 'common.error': 'Jokin meni pieleen.',
  'nav.dashboard': 'Etusivu', 'nav.available': 'Saatavilla olevat tilaukset', 'nav.active': 'Omat tilaukset', 'nav.delivered': 'Toimitettu', 'nav.performance': 'Suorituskyky', 'nav.statistics': 'Tilastot', 'nav.finances': 'Tulot', 'nav.messages': 'Viestit', 'nav.support': 'Tuki', 'nav.profile': 'Profiili', 'nav.settings': 'Asetukset', 'nav.about': 'Tietoja', 'nav.menu': 'Valikko', 'nav.home': 'Etusivu', 'nav.manage': 'Tilausten hallinta',
  'period.today': 'Tänään', 'period.week': 'Viikko', 'period.month': 'Kuukausi',
  'performance.title': 'Suorituskyky', 'performance.refresh': 'Päivitä',
  'statistics.title': 'Tilastot', 'statistics.greeting': 'Hei! 👋 Tältä viikkosi näyttää.', 'statistics.completedDeliveries': 'Suoritetut toimitukset', 'statistics.acceptedOrders': 'Hyväksytyt tilaukset', 'statistics.completionRate': 'Valmistumisprosentti',
  'finances.title': 'Tulot', 'finances.recent': 'Viimeaikaiset tapahtumat', 'finances.empty': 'Ei tapahtumia.',
  'deliveries.title': 'Toimitukset', 'deliveries.empty': 'Ei toimituksia.', 'deliveries.tip': 'Tippi',
  'referrals.title': 'Suositukset', 'referrals.yourCode': 'Koodisi',
  'settings.title': 'Asetukset', 'settings.logout': 'Kirjaudu ulos', 'settings.language': 'Kieli',
  'profile.title': 'Profiili', 'profile.offline': 'Offline',
  'language.title': 'Valitse kieli', 'snack.languageChanged': 'Kieli vaihdettu.'
};

const sk: TranslationDict = {
  'common.copy': 'Kopírovať', 'common.copied': 'Skopírované', 'common.cancel': 'Zrušiť', 'common.save': 'Uložiť', 'common.back': 'Späť', 'common.retry': 'Skúsiť znova', 'common.error': 'Niečo sa pokazilo.',
  'nav.dashboard': 'Domov', 'nav.available': 'Dostupné objednávky', 'nav.active': 'Moje objednávky', 'nav.delivered': 'Doručené', 'nav.performance': 'Výkonnosť', 'nav.statistics': 'Štatistiky', 'nav.finances': 'Zárobky', 'nav.messages': 'Správy', 'nav.support': 'Podpora', 'nav.profile': 'Profil', 'nav.settings': 'Nastavenia', 'nav.about': 'O aplikácii', 'nav.menu': 'Menu', 'nav.home': 'Domov', 'nav.manage': 'Správa objednávok',
  'period.today': 'Dnes', 'period.week': 'Týždeň', 'period.month': 'Mesiac',
  'performance.title': 'Výkonnosť', 'performance.refresh': 'Obnoviť',
  'statistics.title': 'Štatistiky', 'statistics.greeting': 'Ahoj! 👋 Takto vyzerá tvoj týždeň.', 'statistics.completedDeliveries': 'Dokončené doručenia', 'statistics.acceptedOrders': 'Prijaté objednávky', 'statistics.completionRate': 'Miera dokončenia',
  'finances.title': 'Zárobky', 'finances.recent': 'Posledné transakcie', 'finances.empty': 'Žiadne transakcie.',
  'deliveries.title': 'Doručenia', 'deliveries.empty': 'Žiadne doručenia.', 'deliveries.tip': 'Prepitné',
  'referrals.title': 'Odporúčania', 'referrals.yourCode': 'Tvoj kód',
  'settings.title': 'Nastavenia', 'settings.logout': 'Odhlásiť sa', 'settings.language': 'Jazyk',
  'profile.title': 'Profil', 'profile.offline': 'Offline',
  'language.title': 'Vyber jazyk', 'snack.languageChanged': 'Jazyk bol zmenený.'
};

const hr: TranslationDict = {
  'common.copy': 'Kopiraj', 'common.copied': 'Kopirano', 'common.cancel': 'Odustani', 'common.save': 'Spremi', 'common.back': 'Natrag', 'common.retry': 'Pokušaj ponovno', 'common.error': 'Nešto je pošlo po zlu.',
  'nav.dashboard': 'Početna', 'nav.available': 'Dostupne narudžbe', 'nav.active': 'Moje narudžbe', 'nav.delivered': 'Dostavljeno', 'nav.performance': 'Učinkovitost', 'nav.statistics': 'Statistika', 'nav.finances': 'Zarada', 'nav.messages': 'Poruke', 'nav.support': 'Podrška', 'nav.profile': 'Profil', 'nav.settings': 'Postavke', 'nav.about': 'O aplikaciji', 'nav.menu': 'Izbornik', 'nav.home': 'Početna', 'nav.manage': 'Upravljanje narudžbama',
  'period.today': 'Danas', 'period.week': 'Tjedan', 'period.month': 'Mjesec',
  'performance.title': 'Učinkovitost', 'performance.refresh': 'Osvježi',
  'statistics.title': 'Statistika', 'statistics.greeting': 'Bok! 👋 Ovako izgleda tvoj tjedan.', 'statistics.completedDeliveries': 'Dovršene dostave', 'statistics.acceptedOrders': 'Prihvaćene narudžbe', 'statistics.completionRate': 'Stopa dovršetka',
  'finances.title': 'Zarada', 'finances.recent': 'Nedavne transakcije', 'finances.empty': 'Nema transakcija.',
  'deliveries.title': 'Dostave', 'deliveries.empty': 'Nema dostava.', 'deliveries.tip': 'Napojnica',
  'referrals.title': 'Preporuke', 'referrals.yourCode': 'Tvoj kod',
  'settings.title': 'Postavke', 'settings.logout': 'Odjavi se', 'settings.language': 'Jezik',
  'profile.title': 'Profil', 'profile.offline': 'Offline',
  'language.title': 'Odaberi jezik', 'snack.languageChanged': 'Jezik je promijenjen.'
};

const et: TranslationDict = {
  'common.copy': 'Kopeeri', 'common.copied': 'Kopeeritud', 'common.cancel': 'Tühista', 'common.save': 'Salvesta', 'common.back': 'Tagasi', 'common.retry': 'Proovi uuesti', 'common.error': 'Midagi läks valesti.',
  'nav.dashboard': 'Avaleht', 'nav.available': 'Saadaolevad tellimused', 'nav.active': 'Minu tellimused', 'nav.delivered': 'Kohale toimetatud', 'nav.performance': 'Sooritus', 'nav.statistics': 'Statistika', 'nav.finances': 'Sissetulekud', 'nav.messages': 'Sõnumid', 'nav.support': 'Tugi', 'nav.profile': 'Profiil', 'nav.settings': 'Sätted', 'nav.about': 'Teave', 'nav.menu': 'Menüü', 'nav.home': 'Avaleht', 'nav.manage': 'Tellimuste haldus',
  'period.today': 'Täna', 'period.week': 'Nädal', 'period.month': 'Kuu',
  'performance.title': 'Sooritus', 'performance.refresh': 'Värskenda',
  'statistics.title': 'Statistika', 'statistics.greeting': 'Tere! 👋 Selline näeb välja sinu nädal.', 'statistics.completedDeliveries': 'Lõpetatud tellimused', 'statistics.acceptedOrders': 'Vastuvõetud tellimused', 'statistics.completionRate': 'Täitmise määr',
  'finances.title': 'Sissetulekud', 'finances.recent': 'Hiljutised tehingud', 'finances.empty': 'Tehinguid pole.',
  'deliveries.title': 'Tellimused', 'deliveries.empty': 'Tellimusi pole.', 'deliveries.tip': 'Jootraha',
  'referrals.title': 'Soovitused', 'referrals.yourCode': 'Sinu kood',
  'settings.title': 'Sätted', 'settings.logout': 'Logi välja', 'settings.language': 'Keel',
  'profile.title': 'Profiil', 'profile.offline': 'Offline',
  'language.title': 'Vali keel', 'snack.languageChanged': 'Keel on muudetud.'
};

const lv: TranslationDict = {
  'common.copy': 'Kopēt', 'common.copied': 'Nokopēts', 'common.cancel': 'Atcelt', 'common.save': 'Saglabāt', 'common.back': 'Atpakaļ', 'common.retry': 'Mēģināt vēlreiz', 'common.error': 'Kaut kas nogāja greizi.',
  'nav.dashboard': 'Sākums', 'nav.available': 'Pieejamie pasūtījumi', 'nav.active': 'Mani pasūtījumi', 'nav.delivered': 'Piegādāts', 'nav.performance': 'Veikums', 'nav.statistics': 'Statistika', 'nav.finances': 'Ieņēmumi', 'nav.messages': 'Ziņojumi', 'nav.support': 'Atbalsts', 'nav.profile': 'Profils', 'nav.settings': 'Iestatījumi', 'nav.about': 'Par', 'nav.menu': 'Izvēlne', 'nav.home': 'Sākums', 'nav.manage': 'Pasūtījumu pārvaldība',
  'period.today': 'Šodien', 'period.week': 'Nedēļa', 'period.month': 'Mēnesis',
  'performance.title': 'Veikums', 'performance.refresh': 'Atjaunot',
  'statistics.title': 'Statistika', 'statistics.greeting': 'Sveiks! 👋 Lūk, kā izskatās tava nedēļa.', 'statistics.completedDeliveries': 'Pabeigtās piegādes', 'statistics.acceptedOrders': 'Pieņemtie pasūtījumi', 'statistics.completionRate': 'Pabeigšanas līmenis',
  'finances.title': 'Ieņēmumi', 'finances.recent': 'Pēdējie darījumi', 'finances.empty': 'Darījumu nav.',
  'deliveries.title': 'Piegādes', 'deliveries.empty': 'Piegāžu nav.', 'deliveries.tip': 'Dzeramnauda',
  'referrals.title': 'Ieteikumi', 'referrals.yourCode': 'Tavs kods',
  'settings.title': 'Iestatījumi', 'settings.logout': 'Iziet', 'settings.language': 'Valoda',
  'profile.title': 'Profils', 'profile.offline': 'Offline',
  'language.title': 'Izvēlies valodu', 'snack.languageChanged': 'Valoda mainīta.'
};

const lt: TranslationDict = {
  'common.copy': 'Kopijuoti', 'common.copied': 'Nukopijuota', 'common.cancel': 'Atšaukti', 'common.save': 'Įrašyti', 'common.back': 'Atgal', 'common.retry': 'Bandyti dar kartą', 'common.error': 'Įvyko klaida.',
  'nav.dashboard': 'Pradžia', 'nav.available': 'Galimi užsakymai', 'nav.active': 'Mano užsakymai', 'nav.delivered': 'Pristatyta', 'nav.performance': 'Veiklos rodikliai', 'nav.statistics': 'Statistika', 'nav.finances': 'Pajamos', 'nav.messages': 'Žinutės', 'nav.support': 'Pagalba', 'nav.profile': 'Profilis', 'nav.settings': 'Nustatymai', 'nav.about': 'Apie', 'nav.menu': 'Meniu', 'nav.home': 'Pradžia', 'nav.manage': 'Užsakymų valdymas',
  'period.today': 'Šiandien', 'period.week': 'Savaitė', 'period.month': 'Mėnuo',
  'performance.title': 'Veiklos rodikliai', 'performance.refresh': 'Atnaujinti',
  'statistics.title': 'Statistika', 'statistics.greeting': 'Sveiki! 👋 Štai kaip atrodo tavo savaitė.', 'statistics.completedDeliveries': 'Baigti pristatymai', 'statistics.acceptedOrders': 'Priimti užsakymai', 'statistics.completionRate': 'Užbaigimo rodiklis',
  'finances.title': 'Pajamos', 'finances.recent': 'Naujausios operacijos', 'finances.empty': 'Operacijų nėra.',
  'deliveries.title': 'Pristatymai', 'deliveries.empty': 'Pristatymų nėra.', 'deliveries.tip': 'Arbatpinigiai',
  'referrals.title': 'Rekomendacijos', 'referrals.yourCode': 'Tavo kodas',
  'settings.title': 'Nustatymai', 'settings.logout': 'Atsijungti', 'settings.language': 'Kalba',
  'profile.title': 'Profilis', 'profile.offline': 'Offline',
  'language.title': 'Pasirink kalbą', 'snack.languageChanged': 'Kalba pakeista.'
};

const az: TranslationDict = {
  'common.copy': 'Kopyala', 'common.copied': 'Kopyalandı', 'common.cancel': 'Ləğv et', 'common.save': 'Yadda saxla', 'common.back': 'Geri', 'common.retry': 'Yenidən cəhd et', 'common.error': 'Nəsə səhv getdi.',
  'nav.dashboard': 'Əsas', 'nav.available': 'Mövcud sifarişlər', 'nav.active': 'Sifarişlərim', 'nav.delivered': 'Çatdırıldı', 'nav.performance': 'Performans', 'nav.statistics': 'Statistika', 'nav.finances': 'Qazanc', 'nav.messages': 'Mesajlar', 'nav.support': 'Dəstək', 'nav.profile': 'Profil', 'nav.settings': 'Tənzimləmələr', 'nav.about': 'Haqqında', 'nav.menu': 'Menyu', 'nav.home': 'Əsas', 'nav.manage': 'Sifarişlərin idarəsi',
  'period.today': 'Bu gün', 'period.week': 'Həftə', 'period.month': 'Ay',
  'performance.title': 'Performans', 'performance.refresh': 'Yenilə',
  'statistics.title': 'Statistika', 'statistics.greeting': 'Salam! 👋 Həftən belə görünür.', 'statistics.completedDeliveries': 'Tamamlanmış çatdırılmalar', 'statistics.acceptedOrders': 'Qəbul edilmiş sifarişlər', 'statistics.completionRate': 'Tamamlanma faizi',
  'finances.title': 'Qazanc', 'finances.recent': 'Son əməliyyatlar', 'finances.empty': 'Əməliyyat yoxdur.',
  'deliveries.title': 'Çatdırılmalar', 'deliveries.empty': 'Çatdırılma yoxdur.', 'deliveries.tip': 'Bəxşiş',
  'referrals.title': 'Tövsiyələr', 'referrals.yourCode': 'Sənin kodun',
  'settings.title': 'Tənzimləmələr', 'settings.logout': 'Çıxış', 'settings.language': 'Dil',
  'profile.title': 'Profil', 'profile.offline': 'Offline',
  'language.title': 'Dili seç', 'snack.languageChanged': 'Dil dəyişdirildi.'
};

export const TRANSLATIONS: Record<LanguageCode, TranslationDict> = {
  ro, en, cs, pl, hu, pt, el, sv, fi, sk, hr, et, lv, lt, az
};
