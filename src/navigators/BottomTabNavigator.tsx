import {
  BottomTabBarProps,
  BottomTabHeaderProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React, {useEffect} from 'react';
import Home from '../screens/Home';
import {NAVIGATION} from '../constants/strings';
import CustomTab from '../components/CustomTab';
import TransactionScreen from '../screens/Transactions';
import {View} from 'react-native';
import FilterSheet from '../components/FilterSheet';
import CategorySelectionSheet from '../components/CategorySelectionSheet';
import BudgetScreen from '../screens/Budgets';
import {BottomParamList} from '../defs/navigation';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector} from '../redux/store';
import {useDispatch} from 'react-redux';
import {userLoggedIn} from '../redux/reducers/userSlice';
import {UserFromJson, UserType} from '../defs/user';
const Tab = createBottomTabNavigator<BottomParamList>();
function CustomTabBar(props: Readonly<BottomTabBarProps>) {
  return <CustomTab {...props} />;
}
function BottomTabNavigator() {
  const dispatch = useDispatch();
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  useEffect(() => {
    const subscribe = firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(snapshot => {
        dispatch(userLoggedIn(UserFromJson(snapshot.data() as UserType)));
        console.log(snapshot.data());
      });
    return () => subscribe();
  }, []);
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator screenOptions={{headerShown: false}} tabBar={CustomTabBar}>
        <Tab.Screen name={NAVIGATION.Home} component={Home} />
        <Tab.Screen
          name={NAVIGATION.Transaction}
          component={TransactionScreen}
        />
        <Tab.Screen name={NAVIGATION.Budget} component={BudgetScreen} />
        <Tab.Screen name={NAVIGATION.Profile} component={Home} />
      </Tab.Navigator>
      <FilterSheet />
      <CategorySelectionSheet />
    </View>
  );
}

export default BottomTabNavigator;
