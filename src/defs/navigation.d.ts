import { NativeStackScreenProps } from "@react-navigation/native-stack"

export type RootStackParamList = {
    Onboarding: undefined,
    Signup:undefined
}

export type OnboardingScreenProps=NativeStackScreenProps<RootStackParamList,'Onboarding'>