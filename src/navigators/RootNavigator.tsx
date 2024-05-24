import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../defs/navigation';
import Onboarding from '../screens/Onboarding';
import {NAVIGATION} from '../constants/strings';
const Stack = createNativeStackNavigator<RootStackParamList>();
function RootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen name={NAVIGATION.ONBOARDING} component={Onboarding} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export default RootNavigator;
