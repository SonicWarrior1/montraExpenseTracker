import React, {useState} from 'react';
import {Dimensions, SafeAreaView, Text, View} from 'react-native';
import styles from './styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {COLORS} from '../../constants/commonStyles';
import {PinSentScreenProps} from '../../defs/navigation';
import {NAVIGATION} from '../../constants/strings';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {userLoggedIn} from '../../redux/reducers/userSlice';
import firestore from '@react-native-firebase/firestore';
import {ICONS} from '../../constants/icons';
function Pin({route, navigation}: Readonly<PinSentScreenProps>) {
  const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [-1, 0, 99],
  ];
  const screenWidth = Dimensions.get('screen').width;
  const [pin, setPin] = useState<number[]>([]);
  console.log(route.params);
  const user = useAppSelector(state => state.user.currentUser);
  const isSetup = user?.pin === '' ? true : false;
  const oldPin = route.params.pin ?? '';
  const dispatch = useAppDispatch();
  console.log(pin);
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.mainView}>
        <Text style={styles.text}>
          {isSetup && oldPin === ''
            ? "Let's setup your PIN"
            : isSetup && oldPin
            ? 'Ok. Re type your PIN again.'
            : 'Enter Your Pin'}{' '}
        </Text>
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
                ]}></View>
            );
          })}
        </View>
        <View>
          {matrix.map((row, rowIndex) => (
            <View style={{flexDirection: 'row'}} key={rowIndex}>
              {row.map((value, colIndex) => (
                <TouchableOpacity
                  key={colIndex}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: screenWidth / 3,
                    height: 125,
                  }}
                  onPress={async () => {
                    if (value === -1) {
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
                            .update({pin: pin.join('')});
                          navigation.navigate(NAVIGATION.BottomTab);
                          dispatch(userLoggedIn({...user, pin: pin.join('')}));
                        } else {
                          console.log("Pin doesn't match");
                        }
                      } else {
                        if (pin.join('') === user?.pin) {
                          navigation.replace(NAVIGATION.BottomTab);
                          console.log('home');
                        } else {
                          console.log('Incorrect Pin');
                          setPin([]);
                        }
                      }
                    } else if (pin.length < 4) {
                      setPin([...pin, value]);
                    }
                  }}>
                  {value === 99 ? (
                    ICONS.ArrowRight2({height: 30, width: 30})
                  ) : (
                    <Text
                      style={{
                        fontSize: 48,
                        fontWeight: '500',
                        color: 'white',
                        //   height: 80,
                      }}>
                      {value === -1 ? '' : value}
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
