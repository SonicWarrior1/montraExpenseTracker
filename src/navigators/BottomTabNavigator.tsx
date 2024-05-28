import {
  BottomTabBarProps,
  BottomTabHeaderProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React from 'react';
import Home from '../screens/Home';
import {NAVIGATION} from '../constants/strings';
import CustomTab from '../components/CustomTab';
import TransactionScreen from '../screens/Transactions';
import TransactionHeader from '../components/TransactionHeader';

const Tab = createBottomTabNavigator();
function CustomTabBar(props: Readonly<BottomTabBarProps>) {
  return <CustomTab {...props} />;
}
function TransHeader(props: Readonly<BottomTabHeaderProps>) {
  return <TransactionHeader {...props} />;
}

function BottomTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}} tabBar={CustomTabBar}>
      <Tab.Screen name={NAVIGATION.Home} component={Home} />
      <Tab.Screen
        name={NAVIGATION.Transaction}
        component={TransactionScreen}
        options={{
          headerShown: true,
          header: TransHeader,
        }}
      />
      <Tab.Screen name={NAVIGATION.Budget} component={Home} />
      <Tab.Screen name={NAVIGATION.Profile} component={Home} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
