import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../defs/navigation';
import Onboarding from '../screens/Onboarding';
import {NAVIGATION} from '../constants/strings';
import Signup from '../screens/Signup';
import {ICONS} from '../constants/icons';
import {Pressable, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Login from '../screens/Login';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import {useAppSelector} from '../redux/store';
import Home from '../screens/Home';
import ForgotPassword from '../screens/ForgotPassword';
import ForgotEmailSent from '../screens/ForgotEmailSent';
import Pin from '../screens/Pin';
import BottomTabNavigator from './BottomTabNavigator';
import AddExpense from '../screens/AddExpense';
export const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator(): React.JSX.Element {
  const navigation = useNavigation(); // Use useNavigation hook to get navigation prop
  function headerLeft({canGoBack}: HeaderBackButtonProps) {
    return canGoBack ? (
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}>
        {ICONS.ArrowLeft({height: 20, width: 20})}
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
        headerLeft: headerLeft,
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
              
              headerLeft: (props: HeaderBackButtonProps) => {
                return (
                  <Pressable
                    onPress={() => {
                      navigation.goBack();
                    }}>
                    <Text style={{fontSize: 30, color: 'white'}}>←</Text>
                  </Pressable>
                );
              },
            }}
          />
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
