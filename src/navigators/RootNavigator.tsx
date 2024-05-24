import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../defs/navigation';
import Onboarding from '../screens/Onboarding';
import {NAVIGATION} from '../constants/strings';
import Signup from '../screens/Signup';
import {ICONS} from '../constants/icons';
import {Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
const Stack = createNativeStackNavigator<RootStackParamList>();
function RootNavigator(): React.JSX.Element {
  const navigation = useNavigation(); // Use useNavigation hook to get navigation prop

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerLeft: ({canGoBack}) => {
          return canGoBack ? (
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              {ICONS.ArrowLeft({height: 20, width: 20})}
            </Pressable>
          ) : undefined;
        },
      }}>
      <Stack.Group>
        <Stack.Screen name={NAVIGATION.ONBOARDING} component={Onboarding} />
        <Stack.Screen
          name={NAVIGATION.SIGNUP}
          component={Signup}
          options={{
            headerShown: true,
          
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export default RootNavigator;
