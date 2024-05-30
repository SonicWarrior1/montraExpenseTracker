import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { transactionType } from "./transaction"
import { CompositeScreenProps } from "@react-navigation/native"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"

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
    CreateBudget:undefined
}

export type BottomParamList = {
    Home: undefined,
    Transaction: undefined,
    Budget:undefined,
    Profile:undefined
}

export type OnboardingScreenProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>
export type SignupScreenProps = NativeStackScreenProps<RootStackParamList, 'Signup'>
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>
export type ForgotScreenProps = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>
export type ForgotSentScreenProps = NativeStackScreenProps<RootStackParamList, 'ForgotEmailSent'>
export type PinSentScreenProps = NativeStackScreenProps<RootStackParamList, 'Pin'>
export type ExpenseScreenProps = NativeStackScreenProps<RootStackParamList, 'AddExpense'>
export type TransactionScreenProps = CompositeScreenProps<BottomTabScreenProps<BottomParamList, 'Transaction'>, NativeStackScreenProps<RootStackParamList>>
export type TransactionDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'TransactionDetail'>
export type DocScreenProps = NativeStackScreenProps<RootStackParamList, 'DocView'>
export type BudgetScreenProps = CompositeScreenProps<BottomTabScreenProps<BottomParamList, 'Budget'>, NativeStackScreenProps<RootStackParamList>>
export type CreateBudgetScreenProps = NativeStackScreenProps<RootStackParamList>
