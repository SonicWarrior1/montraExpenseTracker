import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  NativeModules,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import styles from './styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {PinSentScreenProps} from '../../defs/navigation';
import {NAVIGATION} from '../../constants/strings';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  setBiometrics,
  setLoading,
  userLoggedIn,
} from '../../redux/reducers/userSlice';
import firestore from '@react-native-firebase/firestore';
import {encrypt} from '../../utils/encryption';
// Third Party Libraries
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import {UserFromJson} from '../../utils/userFuncs';
import VerifyPassModal from './atoms/VerifyPassModal';
import PinHeader from './atoms/PinHeader';
import ProgressDot from './atoms/ProgressDot';
import KeyPad from './atoms/Keypad';
import ReactNativeBiometrics from 'react-native-biometrics';
import {isTablet} from 'react-native-device-info';
import { STRINGS } from '../../localization';

function Pin({route, navigation}: Readonly<PinSentScreenProps>) {
  // constants
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const biometrics = useAppSelector(state => state.user.biometrics);
  const isSetup = currentUser?.pin === '';
  const oldPin = route.params.pin ?? '';
  const rnBiometrics = new ReactNativeBiometrics();
  // dispatch(setLoading(false));
  // state
  const [pin, setPin] = useState<number[]>([]);
  const [menu, setMenu] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  //functions
  const handlePin = useCallback(
    (value: number) => {
      return async () => {
        if (value === -1) {
          if (pin.length > 0) {
            setPin(pin.slice(0, pin.length - 1));
          }
        } else if (value === 99) {
          if (pin.length < 4) {
            Toast.show({text1: STRINGS.PinMust4digits, type: 'error'});
            return;
          }
          if (isSetup && oldPin === '') {
            navigation.push(NAVIGATION.PIN, {
              setup: true,
              pin: pin.join(''),
            });
          } else if (isSetup && oldPin) {
            if (oldPin === pin.join('')) {
              console.log('Done');
              dispatch(setLoading(true));
              const data = await firestore()
                .collection('users')
                .doc(currentUser?.uid)
                .get();
              const user = UserFromJson(data.data()!);
              await firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                  pin: encrypt(pin.join(''), user.uid),
                });
              dispatch(userLoggedIn({...user, pin: pin.join('')}));
              dispatch(setLoading(false));
              await enrollBiometrics();
              // navigation.replace(NAVIGATION.BottomTab);
            } else {
              Toast.show({
                text1: STRINGS.PinDontMatch,
                type: 'error',
              });
            }
          } else if (pin.join('') === currentUser?.pin) {
            // dispatch(setLoading(true))
            console.log('home');
            await enrollBiometrics();
            // navigation.reset({
            //   index: 0,
            //   routes: [{name: NAVIGATION.BottomTab}],
            // });
            // setPin([]);
            // console.log('home');
          } else {
            console.log(currentUser?.pin);
            Toast.show({text1: STRINGS.IncorrectPin, type: 'error'});
            setPin([]);
          }
        } else if (pin.length < 4) {
          setPin([...pin, value]);
        }
      };
    },
    [isSetup, oldPin, pin, currentUser],
  );
  const backAction = useCallback(() => {
    if (isSetup && oldPin) {
      navigation.goBack();
    } else if (isSetup && oldPin === '') {
      Alert.alert(STRINGS.LeaveWithoutSettingPin, '', [
        {
          text: STRINGS.Cancel,
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: STRINGS.Yes,
          onPress: () => {
            (async () => {
              dispatch(setLoading(true));
              if (Platform.OS === 'ios') {
                await NativeModules.GoogleSigninModule.googleSignOut();
              } else {
                await NativeModules.GoogleSignInHandler.signOut();
              }
              await auth().signOut();
              dispatch(userLoggedIn(undefined));
              setTimeout(() => {
                navigation.reset({
                  index: 1,
                  routes: [
                    {name: NAVIGATION.ONBOARDING},
                    {name: NAVIGATION.LOGIN},
                  ],
                });
                dispatch(setLoading(false));
              }, 100);
            })();
          },
        },
      ]);
    } else {
      BackHandler.exitApp();
    }
    return true;
  }, [isSetup, oldPin]);
  const handleLogout = useCallback(async () => {
    dispatch(setLoading(true));
    if (Platform.OS === 'ios') {
      await NativeModules.GoogleSigninModule.googleSignOut();
    } else {
      await NativeModules.GoogleSignInHandler.signOut();
    }
    await auth().signOut();
    // }
    dispatch(userLoggedIn(undefined));
    setTimeout(() => {
      navigation.reset({
        index: 1,
        routes: [{name: NAVIGATION.ONBOARDING}, {name: NAVIGATION.LOGIN}],
      });
      dispatch(setLoading(false));
    }, 50);
  }, []);
  async function enrollBiometrics() {
    const sensor = await rnBiometrics.isSensorAvailable();

    if (biometrics === undefined && sensor.available) {
      Alert.alert('Would you like to enable biometrics?', '', [
        {
          text: 'No',
          onPress: () => {
            navigation.replace(NAVIGATION.BottomTab);
            dispatch(setLoading(false));
            dispatch(setBiometrics(false));
          },
        },
        {
          text: 'Yes',
          onPress: async () => {
            const {success} = await rnBiometrics.simplePrompt({
              promptMessage:
                sensor.biometryType === 'FaceID'
                  ? 'Confirm Face Id'
                  : 'Confirm fingerprint',
            });
            if (success) {
              dispatch(setBiometrics(true));
              navigation.replace(NAVIGATION.BottomTab);
              dispatch(setLoading(false));
            }
          },
        },
      ]);
      return;
    } else {
      navigation.replace(NAVIGATION.BottomTab);
      dispatch(setLoading(false));
    }
  }
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    if (!isSetup) {
      (async () => {
        try {
          const sensor = await rnBiometrics.isSensorAvailable();
          console.log('sensor sa', sensor);
          if (biometrics) {
            if (sensor.available) {
              const {success} = await rnBiometrics.simplePrompt({
                promptMessage:
                  sensor.biometryType === 'FaceID'
                    ? 'Confirm Face Id'
                    : 'Confirm fingerprint',
              });
              if (success) {
                navigation.reset({
                  index: 0,
                  routes: [{name: NAVIGATION.BottomTab}],
                });
                setPin([]);
              }
            } else {
              dispatch(setBiometrics(false));
              // Toast.show({text1: sensor.error, type: 'error'});
            }
          }
        } catch (e) {
          if (e.code === 'Too many attempts. Use screen lock instead.') {
            Toast.show({
              text1: 'Too many attempts. Use pin instead.',
              type: 'error',
            });
          }
          console.log(e);
        }
      })();
    }
  }, [isSetup]);
  // const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;
  // the value returned does not include the bottom navigation bar, I am not sure why yours does.
  const windowHeight = Dimensions.get('window').height;
  const navbarHeight =
    screenHeight - windowHeight - (StatusBar?.currentHeight ?? 0);
  return (
    <SafeAreaView style={styles.safeView}>
      <VerifyPassModal
        setShowModal={setShowModal}
        showModal={showModal}
        setMenu={setMenu}
        setPin={setPin}
      />
      <Pressable
        style={styles.mainView}
        onPress={() => {
          if (menu) {
            setMenu(false);
          }
        }}>
        <View
          style={[
            styles.upperView,
            {
              maxHeight: isTablet()
                ? (screenHeight - navbarHeight * 1.074) / 1.75
                : Platform.OS === 'ios'
                ? screenHeight / 2.2
                : (screenHeight - navbarHeight * 1.074) / 2.13,
            },
          ]}>
          <PinHeader
            backAction={backAction}
            isSetup={isSetup}
            oldPin={oldPin}
            setMenu={setMenu}
          />
          <View style={styles.progressDotCtr}>
            {[0, 1, 2, 3].map(i => (
              <ProgressDot key={i} i={i} pin={pin} />
            ))}
          </View>
        </View>
        <View style={styles.keypad}>
          <KeyPad handlePin={handlePin} />
        </View>
      </Pressable>
      {menu && (
        <View style={styles.menu}>
          {!(currentUser?.isSocial ?? false) && (
            <TouchableOpacity
              onPress={() => {
                setShowModal(true);
              }}>
              <Text style={styles.menuText}>{STRINGS.ResetPin}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.menuText}>{STRINGS.Logout}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

export default React.memo(Pin);
