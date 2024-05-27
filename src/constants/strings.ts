export const NAVIGATION: {
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
    AddExpense:'AddExpense'
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
    AddExpense:'AddExpense'
}

export const STRINGS = {
    LOGIN: 'Login',
    SIGNUP: 'Sign Up',
    EmailOnWay: 'Your email is on the way',
    CheckYourEmail: 'Check your email',
    InstructionResetPass: 'and follow the instructions to reset your password',
    BackToLogin: 'Back to Login',
    DontWorry: "Don't worry.",
    EnterEmailForReset: "Enter your email and we'll send you a link to reset your password.",
    Continue: "Continue",
    Email: "Email",
    Name: "Name",
    Password: "Password",
    ConfrimPassword: "Confirm Password",
    BySigningUp: 'By signing up, you agree to the',
    Terms: 'Terms of Service and Privacy Policy',
    OrWith: 'Or With',
    SignupWithGoogle: 'Sign Up with Google',
    AlreadyHaveAccount: 'Already have an Account?',
    SignupSuccesful: 'Signup Succesful',
}
export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w]{1,}$/;
export const nameRegex = /^[a-zA-Z ]*$/;
export const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
