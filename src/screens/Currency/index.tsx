import React from 'react';
import {FlatList, Pressable, SafeAreaView, Text} from 'react-native';
import {currencies} from '../../constants/strings';
import BouncyCheckbox from 'react-native-bouncy-checkbox/build/dist/BouncyCheckbox';
import {useAppSelector} from '../../redux/store';
import firestore from '@react-native-firebase/firestore';
import {encrypt} from '../../utils/encryption';
import {useAppTheme} from '../../hooks/themeHook';
import style from './styles';
import CustomHeader from '../../components/CustomHeader';
import {CurrencyScreenProps} from '../../defs/navigation';
import {CheckboxFillColor} from '../../constants/commonStyles';

function CurrencyScreen({navigation}: Readonly<CurrencyScreenProps>) {
  // redux
  const code = useAppSelector(state => state.user.currentUser?.currency);
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
        title="Currency"
        color={COLORS.DARK[100]}
        bottomBorder={true}
      />
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
              disabled
              disableText={false}
              fillColor={CheckboxFillColor}
              isChecked={code === item.code}
              onPress={async () => {
                if (code !== item.code) {
                  await userDoc.update({currency: encrypt(item.code, uid!)});
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
}

export default CurrencyScreen;
