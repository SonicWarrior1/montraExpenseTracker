import {Text, FlatList, Pressable, SafeAreaView} from 'react-native';
import React from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import CustomHeader from '../../components/CustomHeader';
import {CheckboxFillColor} from '../../constants/commonStyles';
import {languages} from '../../constants/strings';
import {useAppTheme} from '../../hooks/themeHook';
import {useAppSelector} from '../../redux/store';
import firestore from '@react-native-firebase/firestore';
// import {encrypt} from '../../utils/encryption';
import style from './styles';
import {STRINGS} from '../../localization';
// import RNRestart from 'react-native-restart';
import {useNetInfo} from '@react-native-community/netinfo';
import {LanguageScreenProps} from '../../defs/navigation';
import Toast from 'react-native-toast-message';

const LanguageScreen = ({navigation}: LanguageScreenProps) => {
  // redux
  const lang = useAppSelector(state => state.user.currentUser?.lang);
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  // constants
  const COLORS = useAppTheme();
  const styles = style(COLORS);
  const userDoc = firestore().collection('users').doc(uid);
  const {isConnected} = useNetInfo();
  return (
    <SafeAreaView style={styles.safeView}>
      <CustomHeader
        backgroundColor={COLORS.LIGHT[100]}
        navigation={navigation}
        title={STRINGS.Language}
        color={COLORS.DARK[100]}
        bottomBorder={true}
      />
      <FlatList
        data={Object.values(languages)}
        renderItem={({item}) => (
          <Pressable
            style={styles.row}
            onPress={async () => {
              if (lang !== item.locale) {
                if (isConnected) {
                  await userDoc.update({lang: item.locale});
                } else {
                  Toast.show({
                    text1:
                      'Language change when device has no internet access is not currently supported.',
                    type: 'error',
                  });
                  // STRINGS.setLanguage(item.locale);
                  // RNRestart.restart();
                }
              }
            }}>
            <Text style={styles.text}>{item.language}</Text>
            <BouncyCheckbox
              style={styles.checkbox}
              disabled
              disableText={false}
              fillColor={CheckboxFillColor}
              isChecked={lang === item.locale}
              onPress={async () => {
                if (lang !== item.locale) {
                  if (isConnected) {
                    await userDoc.update({lang: item.locale});
                  } else {
                    Toast.show({
                      text1:
                        'Language change when device has no internet access is not currently supported.',
                      type: 'error',
                    });
                    // STRINGS.setLanguage(item.locale);
                    // RNRestart.restart();
                  }
                }
              }}
              iconStyle={{height: 24, width: 24}}
              iconImageStyle={{height: 12.5, width: 12.5}}
            />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default LanguageScreen;
