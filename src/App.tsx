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
import {toastConfig} from './components/customToast';
import BootSplash from 'react-native-bootsplash';
import {RealmProvider} from '@realm/react';
import {TimestampModel} from './DbModels/TimestampModel';
import {RepeatDataModel} from './DbModels/RepeatDataModel';
import {OnlineTransactionModel} from './DbModels/OnlineTransactionModel';
import {OfflineTransactionModel} from './DbModels/OfflineTransactionModel';
import firestore from '@react-native-firebase/firestore';
import {BudgetModel} from './DbModels/BudgetModel';
import {CategoryModel} from './DbModels/CategoryModel';
import {AmountModel} from './DbModels/AmountModel';
import {NotificationModel} from './DbModels/NotificationModel';

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
          BudgetModel,
          CategoryModel,
          AmountModel,
          NotificationModel,
        ]}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <Loader>
              <NavigationContainer
                onReady={() => BootSplash.hide({fade: true})}>
                <RootNavigator />
                <Toast
                  position="bottom"
                  visibilityTime={2000}
                  config={toastConfig}
                  autoHide
                />
              </NavigationContainer>
            </Loader>
          </PersistGate>
        </Provider>
      </RealmProvider>
    </GestureHandlerRootView>
  );
}

export default App;
