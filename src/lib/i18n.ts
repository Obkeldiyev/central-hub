import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const en = {
  app: { name: "HikCentral Pro", tagline: "Unified security & access management" },
  nav: {
    dashboard: "Dashboard", people: "People", devices: "Devices", accessControl: "Access Control",
    accessPoints: "Access Points", attendance: "Attendance", shifts: "Shifts", schedules: "Schedules",
    records: "Records", approvals: "Approvals", tracking: "Tracking", licenses: "Licenses",
    organization: "Organization", security: "Security & Roles", sync: "Sync", settings: "Settings", logout: "Logout",
  },
  auth: {
    signIn: "Sign in", username: "Username", password: "Password", remember: "Remember me",
    welcome: "Welcome back", subtitle: "Sign in to your HikCentral console",
    invalid: "Invalid credentials", apiError: "Cannot reach server. Check API URL in settings.",
    backendUrl: "Backend URL",
  },
  common: {
    search: "Search", refresh: "Refresh", save: "Save", cancel: "Cancel", create: "Create",
    edit: "Edit", delete: "Delete", confirm: "Confirm", loading: "Loading...", noData: "No data",
    online: "Online", offline: "Offline", total: "Total", today: "Today", actions: "Actions",
    success: "Success", error: "Error", saved: "Saved",
  },
  dashboard: {
    title: "Dashboard", overview: "Real-time overview of your security infrastructure",
    people: "People", departments: "Departments", areas: "Areas", devices: "Devices",
    events: "Events today", denied: "Denied access", attendance: "Attendance records",
    accessGroups: "Access groups", deviceStatus: "Device Status", recentEvents: "Recent Events",
  },
  settings: {
    title: "Settings", general: "General", appearance: "Appearance", api: "API Connection",
    profile: "Profile", language: "Language", theme: "Theme",
    light: "Light", dark: "Dark", system: "System",
    apiUrl: "Backend API URL", apiUrlHelp: "Base URL for your HikCentral backend (e.g. http://localhost:9000)",
    bridgeToken: "Bridge token (optional)", saved: "Settings saved",
    company: "Organization name", logoUrl: "Logo URL", reset: "Reset to defaults",
  },
  people: { title: "People", subtitle: "Manage personnel, credentials and access", add: "Add person", name: "Name", department: "Department", role: "Role", status: "Status" },
  devices: { title: "Devices", subtitle: "Cameras, terminals and controllers", add: "Add device", model: "Model", ip: "IP Address", type: "Type" },
  attendance: { title: "Attendance", subtitle: "Shifts, schedules and time records", checkIn: "Check-in", checkOut: "Check-out", workDate: "Work date" },
  empty: { connect: "Connect to your backend", connectDesc: "Configure your backend URL in Settings to load live data." },
};

const ru: typeof en = {
  app: { name: "HikCentral Pro", tagline: "Единая система безопасности и доступа" },
  nav: {
    dashboard: "Панель", people: "Сотрудники", devices: "Устройства", accessControl: "Контроль доступа",
    accessPoints: "Точки доступа", attendance: "Учёт времени", shifts: "Смены", schedules: "Графики",
    records: "Записи", approvals: "Заявки", tracking: "Отслеживание", licenses: "Лицензии",
    organization: "Организация", security: "Безопасность", sync: "Синхронизация", settings: "Настройки", logout: "Выйти",
  },
  auth: {
    signIn: "Войти", username: "Логин", password: "Пароль", remember: "Запомнить меня",
    welcome: "С возвращением", subtitle: "Войдите в консоль HikCentral",
    invalid: "Неверные данные", apiError: "Сервер недоступен. Проверьте URL в настройках.",
    backendUrl: "URL бэкенда",
  },
  common: {
    search: "Поиск", refresh: "Обновить", save: "Сохранить", cancel: "Отмена", create: "Создать",
    edit: "Изменить", delete: "Удалить", confirm: "Подтвердить", loading: "Загрузка...", noData: "Нет данных",
    online: "Онлайн", offline: "Офлайн", total: "Всего", today: "Сегодня", actions: "Действия",
    success: "Успех", error: "Ошибка", saved: "Сохранено",
  },
  dashboard: {
    title: "Панель управления", overview: "Обзор вашей системы безопасности в реальном времени",
    people: "Сотрудники", departments: "Отделы", areas: "Зоны", devices: "Устройства",
    events: "Событий сегодня", denied: "Отказы в доступе", attendance: "Записи о посещении",
    accessGroups: "Группы доступа", deviceStatus: "Статус устройств", recentEvents: "Последние события",
  },
  settings: {
    title: "Настройки", general: "Общие", appearance: "Оформление", api: "Подключение к API",
    profile: "Профиль", language: "Язык", theme: "Тема",
    light: "Светлая", dark: "Тёмная", system: "Системная",
    apiUrl: "URL бэкенда", apiUrlHelp: "Базовый URL вашего бэкенда HikCentral (например, http://localhost:9000)",
    bridgeToken: "Bridge-токен (опц.)", saved: "Настройки сохранены",
    company: "Название организации", logoUrl: "URL логотипа", reset: "Сбросить",
  },
  people: { title: "Сотрудники", subtitle: "Управление персоналом, удостоверениями и доступом", add: "Добавить", name: "Имя", department: "Отдел", role: "Роль", status: "Статус" },
  devices: { title: "Устройства", subtitle: "Камеры, терминалы и контроллеры", add: "Добавить", model: "Модель", ip: "IP-адрес", type: "Тип" },
  attendance: { title: "Учёт времени", subtitle: "Смены, графики и записи", checkIn: "Вход", checkOut: "Выход", workDate: "Рабочий день" },
  empty: { connect: "Подключите бэкенд", connectDesc: "Укажите URL бэкенда в настройках, чтобы загрузить данные." },
};

const uz: typeof en = {
  app: { name: "HikCentral Pro", tagline: "Yagona xavfsizlik va kirish boshqaruvi" },
  nav: {
    dashboard: "Boshqaruv paneli", people: "Xodimlar", devices: "Qurilmalar", accessControl: "Kirish nazorati",
    accessPoints: "Kirish nuqtalari", attendance: "Davomat", shifts: "Smenalar", schedules: "Jadvallar",
    records: "Yozuvlar", approvals: "Tasdiqlar", tracking: "Kuzatuv", licenses: "Litsenziyalar",
    organization: "Tashkilot", security: "Xavfsizlik", sync: "Sinxronizatsiya", settings: "Sozlamalar", logout: "Chiqish",
  },
  auth: {
    signIn: "Kirish", username: "Login", password: "Parol", remember: "Eslab qolish",
    welcome: "Xush kelibsiz", subtitle: "HikCentral konsolingizga kiring",
    invalid: "Noto‘g‘ri ma’lumot", apiError: "Server topilmadi. Sozlamalardan API URL ni tekshiring.",
    backendUrl: "Backend URL",
  },
  common: {
    search: "Qidirish", refresh: "Yangilash", save: "Saqlash", cancel: "Bekor qilish", create: "Yaratish",
    edit: "Tahrirlash", delete: "O‘chirish", confirm: "Tasdiqlash", loading: "Yuklanmoqda...", noData: "Ma’lumot yo‘q",
    online: "Onlayn", offline: "Oflayn", total: "Jami", today: "Bugun", actions: "Amallar",
    success: "Muvaffaqiyat", error: "Xatolik", saved: "Saqlandi",
  },
  dashboard: {
    title: "Boshqaruv paneli", overview: "Xavfsizlik tizimingizning real vaqtdagi ko‘rinishi",
    people: "Xodimlar", departments: "Bo‘limlar", areas: "Hududlar", devices: "Qurilmalar",
    events: "Bugungi voqealar", denied: "Rad etilgan kirishlar", attendance: "Davomat yozuvlari",
    accessGroups: "Kirish guruhlari", deviceStatus: "Qurilma holati", recentEvents: "So‘nggi voqealar",
  },
  settings: {
    title: "Sozlamalar", general: "Umumiy", appearance: "Ko‘rinish", api: "API ulanishi",
    profile: "Profil", language: "Til", theme: "Mavzu",
    light: "Yorug‘", dark: "Qorong‘i", system: "Tizim",
    apiUrl: "Backend API URL", apiUrlHelp: "HikCentral backend asosiy URL (masalan, http://localhost:9000)",
    bridgeToken: "Bridge token (ixtiyoriy)", saved: "Sozlamalar saqlandi",
    company: "Tashkilot nomi", logoUrl: "Logotip URL", reset: "Tiklash",
  },
  people: { title: "Xodimlar", subtitle: "Xodimlar, hujjatlar va kirishni boshqarish", add: "Qo‘shish", name: "Ism", department: "Bo‘lim", role: "Lavozim", status: "Holat" },
  devices: { title: "Qurilmalar", subtitle: "Kameralar, terminallar va kontrollerlar", add: "Qo‘shish", model: "Model", ip: "IP manzil", type: "Turi" },
  attendance: { title: "Davomat", subtitle: "Smenalar, jadvallar va yozuvlar", checkIn: "Kirish", checkOut: "Chiqish", workDate: "Ish kuni" },
  empty: { connect: "Backendga ulaning", connectDesc: "Sozlamalardan backend URL ni kiriting." },
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        ru: { translation: ru },
        uz: { translation: uz },
      },
      fallbackLng: "en",
      supportedLngs: ["en", "ru", "uz"],
      interpolation: { escapeValue: false },
      detection: { order: ["localStorage", "navigator"], caches: ["localStorage"] },
    });
}

export default i18n;
