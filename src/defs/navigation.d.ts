import { NativeStackScreenProps } from "@react-navigation/native-stack"

export type RootStackParamList = {
    Onboarding: undefined,
    Signup: undefined,
    Login: undefined,
    BottomTab: undefined,
    ForgotPassword: undefined,
    ForgotEmailSent: { email: string },
    Pin: { setup?: boolean, pin?: string }
    AddExpense: { type: 'expense' | 'income' }
}

export type BottomParamList = {
    Home: undefined
}

export type OnboardingScreenProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>
export type SignupScreenProps = NativeStackScreenProps<RootStackParamList, 'Signup'>
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>
export type ForgotScreenProps = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>
export type ForgotSentScreenProps = NativeStackScreenProps<RootStackParamList, 'ForgotEmailSent'>
export type PinSentScreenProps = NativeStackScreenProps<RootStackParamList, 'Pin'>
export type ExpenseScreenProps = NativeStackScreenProps<RootStackParamList, 'AddExpense'>
