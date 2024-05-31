
import { transactionType } from "./transaction"
import { CompositeScreenProps } from "@react-navigation/native"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { UserType } from "./user"
import { StackScreenProps } from "@react-navigation/stack"

export type RootStackParamList = {
    Onboarding: undefined,
    Signup: undefined,
    Login: undefined,
    BottomTab: undefined,
    ForgotPassword: undefined,
    ForgotEmailSent: { email: string },
    Pin: { setup?: boolean, pin?: string }
    AddExpense: { type: 'expense' | 'income' | 'transfer', isEdit: boolean, transaction?: transactionType }
    TransactionDetail: { transaction: transactionType },
    DocView: { uri: string },
    CreateBudget: { isEdit: boolean, category?: string },
    DetailBudget: { category: string },
    Notification: undefined
}

export type BottomParamList = {
    Home: undefined,
    Transaction: undefined,
    Budget: undefined,
    Profile: undefined
}

export type OnboardingScreenProps = StackScreenProps<RootStackParamList, 'Onboarding'>
export type SignupScreenProps = StackScreenProps<RootStackParamList, 'Signup'>
export type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>
export type ForgotScreenProps = StackScreenProps<RootStackParamList, 'ForgotPassword'>
export type ForgotSentScreenProps = StackScreenProps<RootStackParamList, 'ForgotEmailSent'>
export type PinSentScreenProps = StackScreenProps<RootStackParamList, 'Pin'>
export type ExpenseScreenProps = StackScreenProps<RootStackParamList, 'AddExpense'>
export type TransactionScreenProps = CompositeScreenProps<BottomTabScreenProps<BottomParamList, 'Transaction'>, StackScreenProps<RootStackParamList>>
export type TransactionDetailScreenProps = StackScreenProps<RootStackParamList, 'TransactionDetail'>
export type DocScreenProps = StackScreenProps<RootStackParamList, 'DocView'>
export type BudgetScreenProps = CompositeScreenProps<BottomTabScreenProps<BottomParamList, 'Budget'>, StackScreenProps<RootStackParamList>>
export type CreateBudgetScreenProps = StackScreenProps<RootStackParamList, 'CreateBudget'>
export type DetailBudgetScreenProps = StackScreenProps<RootStackParamList, 'DetailBudget'>
export type NotificationScreenProps = StackScreenProps<RootStackParamList, 'Notification'>
export type HomeScreenProps = CompositeScreenProps<BottomTabScreenProps<BottomParamList, 'Home'>, StackScreenProps<RootStackParamList>>
