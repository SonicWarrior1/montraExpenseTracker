import React from 'react';
import {FlatList, SafeAreaView, Text, View} from 'react-native';
import {currencies} from '../../constants/strings';
import BouncyCheckbox from 'react-native-bouncy-checkbox/build/dist/BouncyCheckbox';
import {useAppSelector} from '../../redux/store';
import firestore from '@react-native-firebase/firestore';
import {encrypt} from '../../utils/encryption';
import { useAppTheme } from '../../hooks/themeHook';
import style from './styles';

function CurrencyScreen() {
  const COLORS=useAppTheme();
  const code = useAppSelector(state => state.user.currentUser?.currency);
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  const styles=style(COLORS)
  return (
    <SafeAreaView style={styles.safeView}>
      <FlatList
        data={Object.values(currencies)}
        renderItem={({item}) => (
          <View
            style={styles.row}>
            <Text style={styles.text}>
              {item.name} {'(' + item.code + ')'}{' '}
            </Text>
            <BouncyCheckbox
              style={{width: 28}}
              disableText={false}
              fillColor={COLORS.BLUE[100]}
              isChecked={code === item.code}
              onPress={async () => {
                await firestore()
                  .collection('users')
                  .doc(uid)
                  .update({currency: encrypt(item.code, uid!)});
              }}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

export default CurrencyScreen;
