import React from 'react';
import {Pressable, SafeAreaView, Text} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox/build/dist/BouncyCheckbox';
import {useAppSelector} from '../../redux/store';
import firestore from '@react-native-firebase/firestore';
import {encrypt} from '../../utils/encryption';
import style from './styles';
import {useAppTheme} from '../../hooks/themeHook';
import {STRINGS} from '../../constants/strings';

function ThemeScreen() {
  // redux
  const theme = useAppSelector(state => state.user.currentUser?.theme);
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  // constants
  const COLORS = useAppTheme();
  const styles = style(COLORS);
  const userDoc = firestore().collection('users').doc(uid);
  return (
    <SafeAreaView style={styles.safeView}>
      <Pressable
        style={styles.row}
        onPress={async () => {
          if (theme !== 'light') {
            await userDoc.update({theme: encrypt('light', uid!)});
          }
        }}>
        <Text style={styles.text}>{STRINGS.Light}</Text>
        {theme === 'light' && (
          <BouncyCheckbox
            disabled
            style={{width: 28}}
            disableText={false}
            fillColor={'#5233FF'}
            isChecked={theme === 'light'}
            iconStyle={{height: 24, width: 24}}
            iconImageStyle={{height: 12.5, width: 12.5}}
          />
        )}
      </Pressable>
      <Pressable
        style={styles.row}
        onPress={async () => {
          if (theme !== 'dark') {
            await userDoc.update({theme: encrypt('dark', uid!)});
          }
        }}>
        <Text style={styles.text}>{STRINGS.Dark}</Text>
        {theme === 'dark' && (
          <BouncyCheckbox
            disabled
            style={{width: 28}}
            disableText={false}
            fillColor={'#5233FF'}
            isChecked={theme === 'dark'}
            iconStyle={{height: 24, width: 24}}
            iconImageStyle={{height: 12.5, width: 12.5}}
          />
        )}
      </Pressable>
      <Pressable
        style={styles.row}
        onPress={async () => {
          if (theme !== 'device') {
            await userDoc.update({theme: encrypt('device', uid!)});
          }
        }}>
        <Text style={styles.text}>{STRINGS.UseDeviceTheme}</Text>
        {theme === 'device' && (
          <BouncyCheckbox
            disabled
            style={{width: 28}}
            disableText={false}
            fillColor={'#5233FF'}
            isChecked={theme === 'device'}
            iconStyle={{height: 24, width: 24}}
            iconImageStyle={{height: 12.5, width: 12.5}}
          />
        )}
      </Pressable>
    </SafeAreaView>
  );
}

export default ThemeScreen;
