import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
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
      <View style={styles.row}>
        <Text style={styles.text}>{STRINGS.Light}</Text>
        <BouncyCheckbox
          style={{width: 28}}
          disableText={false}
          fillColor={COLORS.BLUE[100]}
          isChecked={theme === 'light'}
          onPress={async () => {
            await userDoc.update({theme: encrypt('light', uid!)});
          }}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>{STRINGS.Dark}</Text>
        <BouncyCheckbox
          style={{width: 28}}
          disableText={false}
          fillColor={COLORS.BLUE[100]}
          isChecked={theme === 'dark'}
          onPress={async () => {
            await userDoc.update({theme: encrypt('dark', uid!)});
          }}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>{STRINGS.UseDeviceTheme}</Text>
        <BouncyCheckbox
          style={{width: 28}}
          disableText={false}
          fillColor={COLORS.BLUE[100]}
          isChecked={theme === 'device'}
          onPress={async () => {
            await userDoc.update({theme: encrypt('device', uid!)});
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default ThemeScreen;
