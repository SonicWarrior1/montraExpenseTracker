import React, {useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
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
import Sapcer from '../../components/Spacer';
// Third Party Libraries
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';
import auth from '@react-native-firebase/auth';
import {UserFromJson} from '../../utils/userFuncs';
import {useNavigation} from '@react-navigation/native';

function Pin({route, navigation}: Readonly<PinSentScreenProps>) {
  // constants
  const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [-1, 0, 99],
  ];
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.currentUser);
  const isSetup = user === undefined ? true : user.pin === '';
  const oldPin = route.params.pin ?? '';
  console.log(route.params.uid, isSetup, oldPin);
  // console.log(nav.,isSetup);
  // state
  const [pin, setPin] = useState<number[]>([]);
  // functions
  const nav = useNavigation();
  useEffect(() => {
    console.log('sdjfiksuj');
    if (!isSetup && pin.length === 4) {
      console.log('chal ja bhai');
      nav.replace(NAVIGATION.BottomTab);
      setPin([]);
    }
    dispatch(setLoading(false));
  }, [isSetup, nav, user]);
  const handlePin = (value: number) => {
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
            uid: route.params.uid,
          });
        } else if (isSetup && oldPin) {
          if (oldPin === pin.join('')) {
            console.log('Done');
            dispatch(setLoading(true));
            const uid = route.params.uid;
            const data = await firestore().collection('users').doc(uid).get();
            const user = UserFromJson(data.data()!);
            await firestore()
              .collection('users')
              .doc(user.uid)
              .update({
                pin: encrypt(pin.join(''), user.uid),
              });
            dispatch(userLoggedIn({...user, pin: pin.join('')}));
          } else {
            console.log("Pin doesn't match");
            Toast.show({
              text1: "Pin doesn't match",
              type: 'error',
            });
          }
        } else if (pin.join('') === user?.pin) {
          // dispatch(setLoading(true))
          navigation.reset({index: 0, routes: [{name: NAVIGATION.BottomTab}]});
          setPin([]);
          console.log('home');
        } else {
          console.log(user?.pin);
          console.log('Incorrect Pin');
          Toast.show({text1: 'Incorrect Pin', type: 'error'});
          setPin([]);
        }
      } else if (pin.length < 4) {
        setPin([...pin, value]);
      }
    };
  };
  const getTitleText = () => {
    if (isSetup && oldPin === '') {
      return STRINGS.SetupPin;
    } else if (isSetup && oldPin) {
      return STRINGS.RetypePin;
    } else {
      return STRINGS.EnterPin;
    }
  };
  const backAction = () => {
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
                await auth().signOut();
                navigation.goBack();
                // dispatch(userLoggedIn(undefined));
                // navigation.navigate(NAVIGATION.LOGIN);
              })();
            },
          },
        ],
      );
    } else {
      BackHandler.exitApp();
    }
    return true;
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.mainView}>
        <View
          style={{
            paddingTop: Dimensions.get('screen').height * 0.03,
            rowGap: 100,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            }}>
            {isSetup ? (
              <Pressable onPress={backAction}>
                {ICONS.ArrowLeft({
                  height: 25,
                  width: 25,
                  color: 'white',
                  borderColor: 'white',
                })}
              </Pressable>
            ) : (
              <Sapcer width={25} />
            )}
            <Text style={styles.text}>{getTitleText()}</Text>
            <Sapcer width={25} />
          </View>
          <View style={styles.progressDotCtr}>
            {[0, 1, 2, 3].map(i => {
              return (
                <View
                  key={i}
                  style={[
                    styles.progressDot,
                    {
                      backgroundColor:
                        pin.length > i ? 'white' : COLORS.VIOLET[100],
                      borderWidth: pin.length > i ? 0 : 4,
                      opacity: pin.length > i ? 1 : 0.4,
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>
        <View>
          {matrix.map(row => (
            <View style={styles.flexRow} key={`row_${uuid.v4()}`}>
              {row.map(value => (
                <TouchableOpacity
                  key={`col_${uuid.v4()}`}
                  style={styles.btn}
                  onPress={handlePin(value)}>
                  {value === 99 ? (
                    ICONS.ArrowRight2({
                      height: 43,
                      width: 43,
                      color: COLORS.VIOLET[100],
                    })
                  ) : (
                    <Text style={styles.number}>
                      {value === -1 ? 'DEL' : value}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Pin;
