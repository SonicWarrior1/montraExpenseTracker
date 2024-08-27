import {BackHandler, View} from 'react-native';
import Home from '../screens/Home';
import {NAVIGATION} from '../constants/strings';
import CustomTab from '../components/CustomTab';
import TransactionScreen from '../screens/Transactions';
import FilterSheet from '../components/FilterSheet';
import BudgetScreen from '../screens/Budgets';
import {BottomParamList} from '../defs/navigation';
import ProfileScreen from '../screens/Profile';
import {useInitialSetup} from '../hooks/initialSetup';
import LogoutSheet from '../components/LogoutSheet';
// Third Party Libraries
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

const Tab = createBottomTabNavigator<BottomParamList>();
function CustomTabBar(props: Readonly<BottomTabBarProps>) {
  return <CustomTab {...props} />;
}
function BottomTabNavigator() {
  useInitialSetup();
  const navigation = useNavigation();
  useEffect(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        BackHandler.exitApp();
      }
      return true;
    });
    return () => back.remove();
  });
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator screenOptions={{headerShown: false}} tabBar={CustomTabBar}>
        <Tab.Screen name={NAVIGATION.Home} component={Home} />
        <Tab.Screen
          name={NAVIGATION.Transaction}
          component={TransactionScreen}
        />
        <Tab.Screen name={NAVIGATION.Budget} component={BudgetScreen} />
        <Tab.Screen name={NAVIGATION.Profile} component={ProfileScreen} />
      </Tab.Navigator>
      <FilterSheet />
      <LogoutSheet />
    </View>
  );
}

export default BottomTabNavigator;
