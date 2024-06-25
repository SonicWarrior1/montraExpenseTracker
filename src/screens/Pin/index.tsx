import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import styles from './styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {COLORS} from '../../constants/commonStyles';
import {PinSentScreenProps} from '../../defs/navigation';
import {NAVIGATION, STRINGS} from '../../constants/strings';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {setLoading, userLoggedIn} from '../../redux/reducers/userSlice';
import firestore from '@react-native-firebase/firestore';
import {ICONS} from '../../constants/icons';
import {encrypt} from '../../utils/encryption';
// Third Party Libraries
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';
import auth from '@react-native-firebase/auth';
import {UserFromJson} from '../../utils/userFuncs';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import VerifyPassModal from './atoms/VerifyPassModal';
import PinHeader from './atoms/PinHeader';
import ProgressDot from './atoms/ProgressDot';
import KeyPad from './atoms/Keypad';

function Pin({route, navigation}: Readonly<PinSentScreenProps>) {
  // constants
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const isSetup = currentUser?.pin === '';
  const oldPin = route.params.pin ?? '';
  // dispatch(setLoading(false));
  // state
  const [pin, setPin] = useState<number[]>([]);
  const [menu, setMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reset, setReset] = useState(true);
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
            Toast.show({text1: 'Pin must be of 4 digits', type: 'error'});
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
              await dispatch(userLoggedIn({...user, pin: pin.join('')}));
              navigation.replace(NAVIGATION.BottomTab);
              dispatch(setLoading(false));
            } else {
              console.log("Pin doesn't match");
              Toast.show({
                text1: "Pin doesn't match",
                type: 'error',
              });
            }
          } else if (pin.join('') === currentUser?.pin) {
            // dispatch(setLoading(true))
            navigation.reset({
              index: 0,
              routes: [{name: NAVIGATION.BottomTab}],
            });
            setPin([]);
            console.log('home');
          } else {
            console.log(currentUser?.pin);
            console.log('Incorrect Pin');
            Toast.show({text1: 'Incorrect Pin', type: 'error'});
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
      Alert.alert(
        'Are you sure you want to leave without setting up your pin?',
        '',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: () => {
              (async () => {
                dispatch(setLoading(true));
                if (await GoogleSignin.isSignedIn()) {
                  GoogleSignin.signOut();
                } else {
                  await auth().signOut();
                }
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
        ],
      );
    } else {
      BackHandler.exitApp();
    }
    return true;
  }, [isSetup, oldPin]);
  const handleLogout = useCallback(async () => {
    dispatch(setLoading(true));
    if (await GoogleSignin.isSignedIn()) {
      GoogleSignin.signOut();
    } else {
      await auth().signOut();
    }
    dispatch(userLoggedIn(undefined));
    setTimeout(() => {
      navigation.reset({
        index: 1,
        routes: [{name: NAVIGATION.ONBOARDING}, {name: NAVIGATION.LOGIN}],
      });
      dispatch(setLoading(false));
    }, 50);
  }, []);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    (async () => {
      if (await GoogleSignin.isSignedIn()) {
        setReset(false);
      }
    })();
  }, []);
  return (
    <SafeAreaView style={styles.safeView}>
      <VerifyPassModal
        setShowModal={setShowModal}
        showModal={showModal}
        setMenu={setMenu}
      />
      <Pressable
        style={styles.mainView}
        onPress={() => {
          if (menu) {
            setMenu(false);
          }
        }}>
        <View style={styles.upperView}>
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
        <View>
          <KeyPad handlePin={handlePin} />
        </View>
      </Pressable>
      {menu && (
        <View style={styles.menu}>
          {reset && (
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
