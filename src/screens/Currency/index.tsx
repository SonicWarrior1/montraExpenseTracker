import React from 'react';
import {FlatList, Pressable, SafeAreaView, Text, View} from 'react-native';
import {currencies} from '../../constants/strings';
import BouncyCheckbox from 'react-native-bouncy-checkbox/build/dist/BouncyCheckbox';
import {useAppSelector} from '../../redux/store';
import firestore from '@react-native-firebase/firestore';
import {encrypt} from '../../utils/encryption';
import {useAppTheme} from '../../hooks/themeHook';
import style from './styles';

function CurrencyScreen() {
  // redux
  const code = useAppSelector(state => state.user.currentUser?.currency);
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  // constants
  const COLORS = useAppTheme();
  const styles = style(COLORS);
  const userDoc = firestore().collection('users').doc(uid);
  return (
    <SafeAreaView style={styles.safeView}>
      <FlatList
        data={Object.values(currencies)}
        renderItem={({item}) => (
          <Pressable
            style={styles.row}
            onPress={async () => {
              if (code !== item.code) {
                await userDoc.update({currency: encrypt(item.code, uid!)});
              }
            }}>
            <Text style={styles.text}>
              {item.name} {'(' + item.code + ')'}{' '}
            </Text>
            <BouncyCheckbox
              style={styles.checkbox}
              disableText={false}
              fillColor={COLORS.BLUE[100]}
              isChecked={code === item.code}
              onPress={async () => {
                if (code !== item.code) {
                  await userDoc.update({currency: encrypt(item.code, uid!)});
                }
              }}
            />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

export default CurrencyScreen;
