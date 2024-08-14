import React from 'react';
import {Pressable, SafeAreaView, Text} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox/build/dist/BouncyCheckbox';
import {useAppSelector} from '../../redux/store';
import firestore from '@react-native-firebase/firestore';
import {encrypt} from '../../utils/encryption';
import style from './styles';
import {useAppTheme} from '../../hooks/themeHook';
import CustomHeader from '../../components/CustomHeader';
import {ThemeScreenProps} from '../../defs/navigation';
import { STRINGS } from '../../localization';

function ThemeScreen({navigation}: Readonly<ThemeScreenProps>) {
  // redux
  const theme = useAppSelector(state => state.user.currentUser?.theme);
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  // constants
  const COLORS = useAppTheme();
  const styles = style(COLORS);
  const userDoc = firestore().collection('users').doc(uid);
  return (
    <SafeAreaView style={styles.safeView}>
      <CustomHeader
        backgroundColor={COLORS.LIGHT[100]}
        navigation={navigation}
        title={STRINGS.Theme}
        color={COLORS.DARK[100]}
        bottomBorder={true}
      />
      {['light', 'dark', 'device'].map(item => (
        <Pressable
          key={item}
          style={styles.row}
          onPress={async () => {
            if (theme !== item) {
              await userDoc.update({theme: encrypt(item, uid!)});
            }
          }}>
          <Text style={styles.text}>
            {item[0].toUpperCase() + item.slice(1)}
          </Text>
          <BouncyCheckbox
            disabled
            style={{width: 28}}
            disableText={false}
            fillColor={'#5233FF'}
            isChecked={theme === item}
            iconStyle={{height: 24, width: 24}}
            iconImageStyle={{height: 12.5, width: 12.5}}
          />
        </Pressable>
      ))}
    </SafeAreaView>
  );
}

export default React.memo(ThemeScreen);
