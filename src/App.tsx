import React from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './navigators/RootNavigator';
import {Provider} from 'react-redux';
import store, {persistor} from './redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Loader from './components/Loader';

GoogleSignin.configure();

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Loader>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </Loader>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
