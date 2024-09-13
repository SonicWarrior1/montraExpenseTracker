import {transactionType} from './transaction';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {StackScreenProps} from '@react-navigation/stack';
import {OnlineTransactionModel} from '../DbModels/OnlineTransactionModel';
import {OfflineTransactionModel} from '../DbModels/OfflineTransactionModel';

export type RootStackParamList = {
  Onboarding: undefined;
  Signup: undefined;
  Login: undefined;
  BottomTab: undefined;
  ForgotPassword: undefined;
  ForgotEmailSent: {email: string};
  Pin: {setup?: boolean; pin?: string; uid?: string};
  AddExpense: {
    type: 'expense' | 'income' | 'transfer';
    isEdit: boolean;
    transaction?:
      | transactionType
      | OnlineTransactionModel
      | OfflineTransactionModel;
  };
  TransactionDetail: {
    transaction: OnlineTransactionModel | OfflineTransactionModel;
  };
  DocView: {uri: string};
  CreateBudget: {isEdit: boolean; category?: string};
  DetailBudget: {category: string; month: number};
  Notification: undefined;
  Story: undefined;
  FinancialReport: undefined;
  Settings: undefined;
  Currency: undefined;
  ExportData: undefined;
  Theme: undefined;
  ResetPassword: {
    apiKey: string;
    lang: string;
    mode: string;
    oobCode: string;
  };
  Language: undefined;
  ChatDashboard: undefined;
  ChatScreen: {roomId: string};
};

export type BottomParamList = {
  Home: undefined;
  Transaction: undefined;
  Budget: undefined;
  Profile: undefined;
};

export type OnboardingScreenProps = StackScreenProps<
  RootStackParamList,
  'Onboarding'
>;
export type SignupScreenProps = StackScreenProps<RootStackParamList, 'Signup'>;
export type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;
export type ForgotScreenProps = StackScreenProps<
  RootStackParamList,
  'ForgotPassword'
>;
export type ForgotSentScreenProps = StackScreenProps<
  RootStackParamList,
  'ForgotEmailSent'
>;
export type PinSentScreenProps = StackScreenProps<RootStackParamList, 'Pin'>;
export type ExpenseScreenProps = StackScreenProps<
  RootStackParamList,
  'AddExpense'
>;
export type TransactionScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomParamList, 'Transaction'>,
  StackScreenProps<RootStackParamList>
>;
export type TransactionDetailScreenProps = StackScreenProps<
  RootStackParamList,
  'TransactionDetail'
>;
export type DocScreenProps = StackScreenProps<RootStackParamList, 'DocView'>;
export type BudgetScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomParamList, 'Budget'>,
  StackScreenProps<RootStackParamList>
>;
export type CreateBudgetScreenProps = StackScreenProps<
  RootStackParamList,
  'CreateBudget'
>;
export type DetailBudgetScreenProps = StackScreenProps<
  RootStackParamList,
  'DetailBudget'
>;
export type NotificationScreenProps = StackScreenProps<
  RootStackParamList,
  'Notification'
>;
export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomParamList, 'Home'>,
  StackScreenProps<RootStackParamList>
>;
export type StoryScreenProps = StackScreenProps<RootStackParamList, 'Story'>;
export type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomParamList, 'Profile'>,
  StackScreenProps<RootStackParamList>
>;
export type SettingsScreenProps = StackScreenProps<
  RootStackParamList,
  'Settings'
>;
export type FinancialReportScreenProps = StackScreenProps<
  RootStackParamList,
  'FinancialReport'
>;
export type CurrencyScreenProps = StackScreenProps<
  RootStackParamList,
  'Currency'
>;
export type ThemeScreenProps = StackScreenProps<RootStackParamList, 'Theme'>;
export type ExportScreenProps = StackScreenProps<
  RootStackParamList,
  'ExportData'
>;
export type ResetPasswordScreenProps = StackScreenProps<
  RootStackParamList,
  'ResetPassword'
>;
export type LanguageScreenProps = StackScreenProps<
  RootStackParamList,
  'Language'
>;
export type ChatDashboardScreenProps = StackScreenProps<
  RootStackParamList,
  'ChatDashboard'
>;
export type ChatScreenProps = StackScreenProps<
  RootStackParamList,
  'ChatScreen'
>;
