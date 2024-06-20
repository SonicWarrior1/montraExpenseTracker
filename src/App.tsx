import React from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './navigators/RootNavigator';
import {Provider} from 'react-redux';
import store, {persistor} from './redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Loader from './components/Loader';
import Toast from 'react-native-toast-message';
import {enableFreeze, enableScreens} from 'react-native-screens';
import {toastConfig} from './components/customToast';
import BootSplash from 'react-native-bootsplash';
import InternetCheck from './components/InternetCheck';
import {RealmProvider} from '@realm/react';
import {TimestampModel} from './DbModels/TimestampModel';
import {RepeatDataModel} from './DbModels/RepeatDataModel';
import {OnlineTransactionModel} from './DbModels/OnlineTransactionModel';
import {OfflineTransactionModel} from './DbModels/OfflineTransactionModel';
import firestore from '@react-native-firebase/firestore';

enableFreeze(true);
enableScreens(false);
GoogleSignin.configure({
  webClientId:
    '426728684733-08hbgavcdljaclium152ea992drr4ev3.apps.googleusercontent.com',
});
firestore().settings({persistence: false});
function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <RealmProvider
        schema={[
          TimestampModel,
          RepeatDataModel,
          OnlineTransactionModel,
          OfflineTransactionModel,
        ]}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            {/* <InternetCheck> */}
            <Loader>
              <NavigationContainer
                onReady={() => BootSplash.hide({fade: true})}>
                <RootNavigator />
                <Toast
                  position="bottom"
                  visibilityTime={2000}
                  config={toastConfig}
                />
              </NavigationContainer>
            </Loader>
            {/* </InternetCheck> */}
          </PersistGate>
        </Provider>
      </RealmProvider>
    </GestureHandlerRootView>
  );
}

export default App;
