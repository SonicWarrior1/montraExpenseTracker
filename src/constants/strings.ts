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
    AddExpense: 'AddExpense',
    TransactionDetail: 'TransactionDetail',
    DocView: "DocView",
    CreateBudget: 'CreateBudget',
    DetailBudget: 'DetailBudget'
    Notification: 'Notification'
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
    DocView: "DocView",
    CreateBudget: 'CreateBudget',
    DetailBudget: 'DetailBudget',
    Notification: 'Notification'
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

export const monthData = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
];
export const weekData = [
    { label: 'Sunday', value: 0 },
    { label: 'Monday', value: 1 },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
]
// export const expenseCat = [
//     { label: 'Add new category', value: 'add' },
//     { label: 'Food', value: 'food' },
//     { label: 'Bill', value: 'bill' },
//     { label: 'Shopping', value: 'shopping' },
//     { label: 'Subscription', value: 'subscription' },
//     { label: 'Transportation', value: 'transportation' },
// ]
// export const incomeCat = ['salary', 'passive income']