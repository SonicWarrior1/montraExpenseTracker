import {RootStackParamList} from '../defs/navigation';
import Onboarding from '../screens/Onboarding';
import {NAVIGATION} from '../constants/strings';
import Signup from '../screens/Signup';
import {ICONS} from '../constants/icons';
import {Pressable, Settings} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Login from '../screens/Login';
import {useAppDispatch, useAppSelector} from '../redux/store';
import ForgotPassword from '../screens/ForgotPassword';
import ForgotEmailSent from '../screens/ForgotEmailSent';
import Pin from '../screens/Pin';
import BottomTabNavigator from './BottomTabNavigator';
import AddExpense from '../screens/AddExpense';
import TransactionDetails from '../screens/TransactionDetails';
import DocView from '../screens/DocView';
import CreateBudget from '../screens/CreateBudget';
import DetailBudget from '../screens/DetailBudget';
import NotificationScreen from '../screens/Notifications';
import {createStackNavigator} from '@react-navigation/stack';
import StoryScreen from '../screens/StoryScreen';
import FinancialReport from '../screens/FinancialReport';
import SettingsScreen from '../screens/Settings';
import CurrencyScreen from '../screens/Currency';
import ExportData from '../screens/ExportData';
import {
  setConversionData,
  setTransaction,
} from '../redux/reducers/transactionSlice';
import {useGetUsdConversionQuery} from '../redux/api/conversionApi';
import {UserFromJson, UserType} from '../defs/user';
import {transactionType} from '../defs/transaction';
import {useCallback, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {userLoggedIn} from '../redux/reducers/userSlice';
export const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.currentUser);
  const fetchData = useCallback(async () => {
    try {
      const res = await firestore()
        .collection('users')
        .doc(user!.uid)
        .collection('transactions')
        .orderBy('timeStamp', 'desc')
        .get();
      const data = res.docs.map(snapshot => snapshot.data() as transactionType);
      const formatData = data.reduce(
        (acc: {[key: string]: transactionType}, item) => {
          acc[item.timeStamp.seconds] = item;
          return acc;
        },
        {},
      );
      dispatch(setTransaction(formatData));
    } catch (e) {
      console.log(e);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
      const unsubscribe = firestore()
        .collection('users')
        .doc(user.uid)
        .collection('transactions')
        .orderBy('timeStamp', 'desc')
        .onSnapshot(snapshot => {
          const data: transactionType[] = snapshot.docs.map(
            doc => doc.data() as transactionType,
          );
          const formatData = data.reduce(
            (acc: {[key: string]: transactionType}, item) => {
              acc[item.timeStamp.seconds] = item;
              return acc;
            },
            {},
          );
          dispatch(setTransaction(formatData));
        });
      return () => unsubscribe();
    }
  }, [user]);
  const {data: conversion, isSuccess} = useGetUsdConversionQuery({});
  useEffect(() => {
    if (isSuccess) {
      dispatch(setConversionData(conversion));
    }
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = firestore()
        .collection('users')
        .doc(user.uid)
        .onSnapshot(snapshot => {
          dispatch(userLoggedIn(UserFromJson(snapshot.data() as UserType)));
        });
      return () => unsubscribe();
    }
  }, [user]);
  const navigation = useNavigation();
  function headerLeft({canGoBack}: any, color: string) {
    return canGoBack ? (
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
        style={{marginLeft: 15}}>
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
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerLeft: props => headerLeft(props, 'black'),
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
          <Stack.Screen
            name={NAVIGATION.AddExpense}
            component={AddExpense}
            options={{
              headerShown: true,
              headerTransparent: true,
              headerTitleStyle: {color: 'white'},
              headerLeft: props => headerLeft(props, 'white'),
            }}
          />
          <Stack.Screen
            name={NAVIGATION.TransactionDetail}
            component={TransactionDetails}
            options={{
              headerShown: true,
              headerTransparent: true,
              headerTitleStyle: {color: 'white'},
              title: 'Detail Transaction',
              headerLeft: props => headerLeft(props, 'white'),
            }}
          />
          <Stack.Screen
            name={NAVIGATION.DocView}
            component={DocView}
            options={{
              headerShown: true,
              headerTitleStyle: {color: 'black'},
              title: 'Document',
              headerLeft: props => headerLeft(props, 'black'),
            }}
          />
          <Stack.Screen
            name={NAVIGATION.CreateBudget}
            component={CreateBudget}
            options={{
              headerShown: true,
              headerTransparent: true,
              headerTitleStyle: {color: 'white'},
              title: 'Create Budget',
              headerLeft: props => headerLeft(props, 'white'),
            }}
          />
          <Stack.Screen
            name={NAVIGATION.DetailBudget}
            component={DetailBudget}
            options={{
              headerShown: true,
              headerTitleStyle: {color: 'black'},
              title: 'Detail Budget',
              headerLeft: props => headerLeft(props, 'black'),
            }}
          />
          <Stack.Screen
            name={NAVIGATION.Notification}
            component={NotificationScreen}
          />
          <Stack.Screen
            name={NAVIGATION.FinancialReport}
            component={FinancialReport}
            options={{
              headerShown: true,
              headerTitleStyle: {color: 'black'},
              title: 'Financial Report',
              headerLeft: props => headerLeft(props, 'black'),
            }}
          />
          <Stack.Screen
            name={NAVIGATION.Settings}
            component={SettingsScreen}
            options={{
              headerShown: true,
              headerTitleStyle: {color: 'black'},
              title: 'Settings',
              headerLeft: props => headerLeft(props, 'black'),
            }}
          />
          <Stack.Screen
            name={NAVIGATION.Currency}
            component={CurrencyScreen}
            options={{
              headerShown: true,
              headerTitleStyle: {color: 'black'},
              title: 'Currency',
              headerLeft: props => headerLeft(props, 'black'),
            }}
          />
          <Stack.Screen
            name={NAVIGATION.ExportData}
            component={ExportData}
            options={{
              headerShown: true,
              headerTitleStyle: {color: 'black'},
              title: 'Export Data',
              headerLeft: props => headerLeft(props, 'black'),
            }}
          />
          <Stack.Screen name={NAVIGATION.Story} component={StoryScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name={NAVIGATION.ONBOARDING} component={Onboarding} />
          <Stack.Screen
            name={NAVIGATION.SIGNUP}
            component={Signup}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name={NAVIGATION.LOGIN}
            component={Login}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name={NAVIGATION.FORGOTPASSWORD}
            component={ForgotPassword}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name={NAVIGATION.FORGOTEMAILSENT}
            component={ForgotEmailSent}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

export default RootNavigator;
