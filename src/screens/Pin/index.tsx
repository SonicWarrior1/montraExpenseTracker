import React, {useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import styles from './styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {COLORS} from '../../constants/commonStyles';
import {PinSentScreenProps} from '../../defs/navigation';
import {NAVIGATION, STRINGS} from '../../constants/strings';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {userLoggedIn} from '../../redux/reducers/userSlice';
import firestore from '@react-native-firebase/firestore';
import {ICONS} from '../../constants/icons';
import {encrypt} from '../../utils/encryption';
// Third Party Libraries
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';

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
  const isSetup = user?.pin === '';
  const oldPin = route.params.pin ?? '';
  // state
  const [pin, setPin] = useState<number[]>([]);
  // functions
  const handlePin = (value: number) => {
    return async () => {
      if (value === -1) {
        if (pin.length > 0) {
          setPin(pin.slice(0, pin.length - 1));
        }
      } else if (value === 99) {
        if (isSetup && oldPin === '') {
          navigation.push(NAVIGATION.PIN, {
            setup: true,
            pin: pin.join(''),
          });
        } else if (isSetup && oldPin) {
          if (oldPin === pin.join('')) {
            console.log('Done');
            await firestore()
              .collection('users')
              .doc(user?.uid)
              .update({
                pin: encrypt(pin.join(''), user.uid),
              });
            navigation.navigate(NAVIGATION.BottomTab);
            dispatch(userLoggedIn({...user, pin: pin.join('')}));
          } else {
            console.log("Pin doesn't match");
            Toast.show({
              text1: "Pin doesn't match",
              type: 'error',
            });
          }
        } else if (pin.join('') === user?.pin) {
          navigation.replace(NAVIGATION.BottomTab);
          console.log('home');
        } else {
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
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.mainView}>
        <Text style={styles.text}>{getTitleText()}</Text>
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
                  },
                ]}
              />
            );
          })}
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
                      height: 30,
                      width: 30,
                      color: COLORS.LIGHT[100],
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
