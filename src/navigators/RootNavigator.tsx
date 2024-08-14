import React, {useEffect} from 'react';
import {RootStackParamList} from '../defs/navigation';
import Onboarding from '../screens/Onboarding';
import {currencies, NAVIGATION} from '../constants/strings';
import Signup from '../screens/Signup';
import {ICONS} from '../constants/icons';
import {Linking, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Login from '../screens/Login';
import {useAppDispatch, useAppSelector} from '../redux/store';
import ForgotPassword from '../screens/ForgotPassword';
import ForgotEmailSent from '../screens/ForgotEmailSent';
import Pin from '../screens/Pin';
import BottomTabNavigator from './BottomTabNavigator';
import AddExpense from '../screens/AddExpense';
import TransactionDetails from '../screens/TransactionDetails';
import CreateBudget from '../screens/CreateBudget';
import DetailBudget from '../screens/DetailBudget';
import NotificationScreen from '../screens/Notifications';
import StoryScreen from '../screens/StoryScreen';
import FinancialReport from '../screens/FinancialReport';
import SettingsScreen from '../screens/Settings';
import CurrencyScreen from '../screens/Currency';
import ExportData from '../screens/ExportData';
import ThemeScreen from '../screens/Theme';
import {useAppTheme} from '../hooks/themeHook';
import {useGetUsdConversionQuery} from '../redux/api/conversionApi';
import {createStackNavigator} from '@react-navigation/stack';
import {setConversionData} from '../redux/reducers/userSlice';
import ResetPassword from '../screens/ResetPassword';
import LanguageScreen from '../screens/LanguageScreen';
import {STRINGS} from '../localization';

export const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator(): React.JSX.Element {
  const navigation = useNavigation();
  function headerLeft({canGoBack}: any, color: string) {
    return canGoBack ? (
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}>
        {ICONS.ArrowLeft({
          height: 25,
          width: 25,
          color: color,
          borderColor: color,
        })}
      </Pressable>
    ) : undefined;
  }
  const isLoggedIn = useAppSelector(state => state.user.currentUser);
  const dispatch = useAppDispatch();
  const COLORS = useAppTheme();
  const todayDate = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  const {data: conversion, isSuccess} = useGetUsdConversionQuery({
    date: todayDate,
  });
  console.log('DEVICE LANGUAGE', STRINGS.getInterfaceLanguage());
  useEffect(() => {
    if (isLoggedIn) {
      STRINGS.setLanguage(isLoggedIn?.lang ?? STRINGS.getInterfaceLanguage());
    } else {
      STRINGS.setLanguage(STRINGS.getInterfaceLanguage());
    }
  }, []);
  useEffect(() => {
    if (isSuccess) {
      const myCurrencies: {[key: string]: number} = {};
      Object.entries(conversion.usd as {[key: string]: number}).forEach(
        ([key, val]) => {
          if (currencies[key.toUpperCase()] !== undefined) {
            myCurrencies[key] = val;
          }
        },
      );
      dispatch(
        setConversionData({
          date: conversion.date,
          usd: myCurrencies,
        }),
      );
    }
  }, [conversion, dispatch, isSuccess]);

  useEffect(() => {
    try {
      Linking.getInitialURL().then(url => {
        if (url) {
          const regex = /[?&]([^=#]+)=([^&#]*)/g;
          const params: {[key: string]: string} = {};
          let match;
          while ((match = regex.exec(url ?? ''))) {
            params[match[1]] = match[2];
          }
          // console.log('PARAMS', url!.split('//')[1].split('?')[0], params);
          if (url?.split('//')?.[1]?.split('?')?.[0] === 'reset-pass') {
            navigation.navigate(NAVIGATION.ResetPassword, params);
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
    const handleDeepLink = async (event: {url: string}) => {
      try {
        const url = event.url;
        const regex = /[?&]([^=#]+)=([^&#]*)/g;
        const params: {[key: string]: string} = {};
        let match;
        while ((match = regex.exec(url))) {
          params[match[1]] = match[2];
        }
        // console.log('PARAMS', event.url.split('//')[1].split('?')[0], params);
        if (event?.url?.split('//')?.[1]?.split('?')?.[0] === 'reset-pass') {
          navigation.navigate(NAVIGATION.ResetPassword, params);
        }
      } catch (e) {
        console.log(e);
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => subscription.remove();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerStyle: {backgroundColor: COLORS.LIGHT[100]},
        headerTitleStyle: {color: COLORS.DARK[100]},
        headerLeft: props => headerLeft(props, COLORS.DARK[100]),
      }}>
      {isLoggedIn ? (
        <Stack.Group>
          <Stack.Screen
            name={NAVIGATION.PIN}
            component={Pin}
            initialParams={{pin: undefined}}
          />
          <Stack.Screen
            name={NAVIGATION.BottomTab}
            component={BottomTabNavigator}
          />
          <Stack.Screen name={NAVIGATION.AddExpense} component={AddExpense} />
          <Stack.Screen
            name={NAVIGATION.TransactionDetail}
            component={TransactionDetails}
          />
          <Stack.Screen
            name={NAVIGATION.CreateBudget}
            component={CreateBudget}
          />
          <Stack.Screen
            name={NAVIGATION.DetailBudget}
            component={DetailBudget}
          />
          <Stack.Screen
            name={NAVIGATION.Notification}
            component={NotificationScreen}
          />
          <Stack.Screen
            name={NAVIGATION.FinancialReport}
            component={FinancialReport}
          />
          <Stack.Screen name={NAVIGATION.Settings} component={SettingsScreen} />
          <Stack.Screen name={NAVIGATION.Currency} component={CurrencyScreen} />
          <Stack.Screen name={NAVIGATION.Theme} component={ThemeScreen} />
          <Stack.Screen name={NAVIGATION.Language} component={LanguageScreen} />
          <Stack.Screen name={NAVIGATION.ExportData} component={ExportData} />
          <Stack.Screen name={NAVIGATION.Story} component={StoryScreen} />
          <Stack.Screen
            name={NAVIGATION.ResetPassword}
            component={ResetPassword}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name={NAVIGATION.ONBOARDING} component={Onboarding} />
          <Stack.Screen name={NAVIGATION.SIGNUP} component={Signup} />
          <Stack.Screen name={NAVIGATION.LOGIN} component={Login} />
          <Stack.Screen
            name={NAVIGATION.FORGOTPASSWORD}
            component={ForgotPassword}
          />
          <Stack.Screen
            name={NAVIGATION.FORGOTEMAILSENT}
            component={ForgotEmailSent}
          />
          <Stack.Screen
            name={NAVIGATION.ResetPassword}
            component={ResetPassword}
          />
          {/* <Stack.Screen
            name={NAVIGATION.PIN}
            component={Pin}
            initialParams={{pin: undefined}}
          /> */}
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

export default RootNavigator;
