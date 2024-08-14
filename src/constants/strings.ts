import {STRINGS as STRING} from '../localization';
import {COLORS} from './commonStyles';

export const NAVIGATION: {
  ONBOARDING: 'Onboarding';
  SIGNUP: 'Signup';
  LOGIN: 'Login';
  FORGOTPASSWORD: 'ForgotPassword';
  FORGOTEMAILSENT: 'ForgotEmailSent';
  PIN: 'Pin';
  Home: 'Home';
  BottomTab: 'BottomTab';
  Transaction: 'Transaction';
  Budget: 'Budget';
  Profile: 'Profile';
  AddExpense: 'AddExpense';
  TransactionDetail: 'TransactionDetail';
  DocView: 'DocView';
  CreateBudget: 'CreateBudget';
  DetailBudget: 'DetailBudget';
  Notification: 'Notification';
  Story: 'Story';
  FinancialReport: 'FinancialReport';
  Settings: 'Settings';
  Currency: 'Currency';
  ExportData: 'ExportData';
  Theme: 'Theme';
  ResetPassword: 'ResetPassword';
  Language: 'Language';
} = {
  ONBOARDING: 'Onboarding',
  SIGNUP: 'Signup',
  LOGIN: 'Login',
  FORGOTPASSWORD: 'ForgotPassword',
  FORGOTEMAILSENT: 'ForgotEmailSent',
  PIN: 'Pin',
  Home: 'Home',
  BottomTab: 'BottomTab',
  Transaction: 'Transaction',
  Budget: 'Budget',
  Profile: 'Profile',
  AddExpense: 'AddExpense',
  TransactionDetail: 'TransactionDetail',
  DocView: 'DocView',
  CreateBudget: 'CreateBudget',
  DetailBudget: 'DetailBudget',
  Notification: 'Notification',
  Story: 'Story',
  FinancialReport: 'FinancialReport',
  Settings: 'Settings',
  Currency: 'Currency',
  ExportData: 'ExportData',
  Theme: 'Theme',
  ResetPassword: 'ResetPassword',
  Language: 'Language',
};

export const OnboardData = [
  {
    icon: '../../assets/Images/onboarding1.png',
    text1: 'Gain total control of your money',
    text2: 'Become your own money manager and make every cent count',
  },
  {
    icon: '../../assets/Images/onboarding2.png',
    text1: 'Know where your money goes',
    text2:
      'Track your transactions easily with categories and financial report ',
  },
  {
    icon: '../../assets/Images/onboarding3.png',
    text1: 'Planning ahead',
    text2: 'Setup your budget for each category so you are in control',
  },
];
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const nameRegex = /^[a-zA-Z ]*$/;
export const passRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\s])[A-Za-z\d@$!%*?&\s]{8,}$/;

export const monthData = (STRINGS: typeof STRING) => [
  {label: STRINGS.January, value: 1},
  {label: STRINGS.February, value: 2},
  {label: STRINGS.March, value: 3},
  {label: STRINGS.April, value: 4},
  {label: STRINGS.May, value: 5},
  {label: STRINGS.June, value: 6},
  {label: STRINGS.July, value: 7},
  {label: STRINGS.August, value: 8},
  {label: STRINGS.September, value: 9},
  {label: STRINGS.October, value: 10},
  {label: STRINGS.November, value: 11},
  {label: STRINGS.December, value: 12},
];
export const weekData = (STRINGS: typeof STRING) => [
  {label: STRINGS.Sunday, value: 0},
  {label: STRINGS.Monday, value: 1},
  {label: STRINGS.Tuesday, value: 2},
  {label: STRINGS.Wednesday, value: 3},
  {label: STRINGS.Thursday, value: 4},
  {label: STRINGS.Friday, value: 5},
  {label: STRINGS.Saturday, value: 6},
];
export const currencies: {
  [key: string]: {name: string; symbol: string; code: string};
} = {
  USD: {name: 'United States Dollar', symbol: '$', code: 'USD'},
  EUR: {name: 'Euro', symbol: '€', code: 'EUR'},
  GBP: {name: 'British Pound Sterling', symbol: '£', code: 'GBP'},
  JPY: {name: 'Japanese Yen', symbol: '¥', code: 'JPY'},
  CHF: {name: 'Swiss Franc', symbol: 'CHF', code: 'CHF'},
  CAD: {name: 'Canadian Dollar', symbol: 'C$', code: 'CAD'},
  AUD: {name: 'Australian Dollar', symbol: 'A$', code: 'AUD'},
  NZD: {name: 'New Zealand Dollar', symbol: 'NZ$', code: 'NZD'},
  CNY: {name: 'Chinese Yuan', symbol: '¥', code: 'CNY'},
  INR: {name: 'Indian Rupee', symbol: '₹', code: 'INR'},
  RUB: {name: 'Russian Ruble', symbol: '₽', code: 'RUB'},
  BRL: {name: 'Brazilian Real', symbol: 'R$', code: 'BRL'},
  ZAR: {name: 'South African Rand', symbol: 'R', code: 'ZAR'},
  MXN: {name: 'Mexican Peso', symbol: 'Mex$', code: 'MXN'},
  SGD: {name: 'Singapore Dollar', symbol: 'S$', code: 'SGD'},
  HKD: {name: 'Hong Kong Dollar', symbol: 'HK$', code: 'HKD'},
  SEK: {name: 'Swedish Krona', symbol: 'kr', code: 'SEK'},
  NOK: {name: 'Norwegian Krone', symbol: 'kr', code: 'NOK'},
  DKK: {name: 'Danish Krone', symbol: 'kr', code: 'DKK'},
  KRW: {name: 'South Korean Won', symbol: '₩', code: 'KRW'},
};
export const FreqDropdownData = (STRINGS: typeof STRING) => [
  {label: STRINGS.Yearly, value: 'yearly'},
  {label: STRINGS.Monthly, value: 'monthly'},
  {label: STRINGS.Weekly, value: 'weekly'},
  {label: STRINGS.Daily, value: 'daily'},
];
export const EndDropdownData = (STRINGS: typeof STRING) => [
  {label: STRINGS.Never, value: 'never'},
  {label: STRINGS.Date, value: 'date'},
];
export const initialExpenseCategories = [
  {name: 'add', color: ''},
  {name: 'food', color: COLORS.RED[100]},
  {name: 'bills', color: COLORS.VIOLET[100]},
  {name: 'shopping', color: COLORS.YELLOW[100]},
  {name: 'subscription', color: '#fc803d'},
  {name: 'transportation', color: COLORS.BLUE[100]},
];
export const initialIncomeCategories = [
  {name: 'add', color: ''},
  {name: 'salary', color: COLORS.GREEN[100]},
  {name: 'passive income', color: '#f531d7'},
];

export const Wallets = [
  {label: 'Paypal', value: 'paypal'},
  {label: 'Chase', value: 'chase'},
];
export const languages = {
  'en-US': {locale: 'en-US', language: 'English (United States)'},
  'es-ES': {locale: 'es-ES', language: 'Español (España)'},
  'fr-FR': {locale: 'fr-FR', language: 'Français (France)'},
  'ja-JP': {locale: 'ja-JP', language: '日本語 (日本)'},
  'ru-RU': {locale: 'ru-RU', language: 'Русский (Россия)'},
  'hi-IN': {locale: 'hi-IN', language: 'हिन्दी (भारत)'},
  'ar-SA': {locale: 'ar-SA', language: 'العربية (السعودية)'},
};
