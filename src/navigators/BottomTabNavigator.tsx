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
import {View} from 'react-native';
import FilterSheet from '../components/FilterSheet';
import CategorySelectionSheet from '../components/CategorySelectionSheet';

const Tab = createBottomTabNavigator();
function CustomTabBar(props: Readonly<BottomTabBarProps>) {
  return <CustomTab {...props} />;
}

function BottomTabNavigator() {
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator screenOptions={{headerShown: false}} tabBar={CustomTabBar}>
        <Tab.Screen name={NAVIGATION.Home} component={Home} />
        <Tab.Screen
          name={NAVIGATION.Transaction}
          component={TransactionScreen}
        />
        <Tab.Screen name={NAVIGATION.Budget} component={Home} />
        <Tab.Screen name={NAVIGATION.Profile} component={Home} />
      </Tab.Navigator>
      <FilterSheet />
      <CategorySelectionSheet/>
    </View>
  );
}

export default BottomTabNavigator;
