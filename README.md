# Expense Tracker App

A cross-platform mobile and web application built with **React** and **React Native** for tracking daily expenses and managing budgets. The app offers real-time data synchronization, detailed financial reports, and secure access to help users effectively manage their finances.

## Features

- **Expense & Income Tracking:** Log daily expenses and income for easy financial management.
- **Budget Management:** Set budgets and receive notifications when the limit is exceeded.
- **Detailed Financial Reports:** Generate comprehensive reports to analyze spending patterns and financial health.
- **Authentication:** Secure user login and registration using Firebase Authentication.
- **Realtime Sync:** Data is synchronized across devices in real-time via Firebase.
- **Offline Access:** Track expenses without an internet connection using Realm.
- **Data Encryption:** Sensitive data is encrypted to ensure security.
- **App Lock:** Supports PIN and biometric authentication for added security.
- **Data Export:** Export financial data to CSV files for easy record-keeping.

## Installation

[<img src="https://github.com/machiav3lli/oandbackupx/blob/034b226cea5c1b30eb4f6a6f313e4dadcbb0ece4/badge_github.png"
    alt="Get it on GitHub"
    height="80">](https://github.com/SonicWarrior1/montraExpenseTracker/releases/tag/v1.0.0)

## Run Code

### Prerequisites
- [Node.js](https://nodejs.org/en/) installed
- Firebase account setup (for Authentication and Firestore)
- Realm (for offline access)

### Clone the Repository
```bash
git clone https://github.com/yourusername/expense-tracker-app.git
cd expense-tracker-app
```

### Install Dependencies
```bash
yarn
```

### Firebase Setup
- Go to the Firebase Console, create a new project, and enable Firebase Authentication and Firestore.
- For Android, download the google-services.json file from Firebase and place it in the android/app folder of your project
- For iOS, download the GoogleService-Info.plist file from Firebase and place it in the ios directory of your project
- Update your Firebase configuration settings in the app as needed

### Switch to Development Branch
To switch to development branch, use the following command:

```bash
git checkout development
```

### Run the App
- For Android
  
     ```bash
     npx react-native run-android
     ```

- For IOS
  
     ```bash
     cd ios && pod install && cd ..
     npx react-native run-ios
     ```

### Usage
- Register or log in using Firebase Authentication.
- Track your daily expenses and incomes.
- Set budgets for categories and receive alerts when limits are exceeded.
- View detailed reports on your financial activity.
- Export data to CSV for easy record-keeping.

### Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss the changes.
