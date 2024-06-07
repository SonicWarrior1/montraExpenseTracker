import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox/build/dist/BouncyCheckbox';
import {useAppSelector} from '../../redux/store';
import firestore from '@react-native-firebase/firestore';
import {encrypt} from '../../utils/encryption';
import style from './styles';
import { useAppTheme } from '../../hooks/themeHook';

function ThemeScreen() {
  const theme = useAppSelector(state => state.user.currentUser?.theme);
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  const COLORS=useAppTheme();
  const styles = style(COLORS);
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.row}>
        <Text style={styles.text}>Light</Text>
        <BouncyCheckbox
          style={{width: 28}}
          disableText={false}
          fillColor={COLORS.BLUE[100]}
          isChecked={theme === 'light'}
          onPress={async () => {
            await firestore()
              .collection('users')
              .doc(uid)
              .update({theme:  encrypt('light', uid!)});
          }}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Dark</Text>
        <BouncyCheckbox
          style={{width: 28}}
          disableText={false}
          fillColor={COLORS.BLUE[100]}
          isChecked={theme === 'dark'}
          onPress={async () => {
            await firestore()
              .collection('users')
              .doc(uid)
              .update({theme:  encrypt('dark', uid!)});
          }}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Use Device Theme</Text>
        <BouncyCheckbox
          style={{width: 28}}
          disableText={false}
          fillColor={COLORS.BLUE[100]}
          isChecked={theme === 'device'}
          onPress={async () => {
            await firestore()
              .collection('users')
              .doc(uid)
              .update({theme:  encrypt('device', uid!)});
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default ThemeScreen;
