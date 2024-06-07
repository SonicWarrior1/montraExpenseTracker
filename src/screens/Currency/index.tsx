import React from 'react';
import {FlatList, SafeAreaView, Text, View} from 'react-native';
import {currencies} from '../../constants/strings';
import {COLORS} from '../../constants/commonStyles';
import BouncyCheckbox from 'react-native-bouncy-checkbox/build/dist/BouncyCheckbox';
import {useAppSelector} from '../../redux/store';
import firestore from '@react-native-firebase/firestore';
import {decrypt, encrypt} from '../../utils/encryption';

function CurrencyScreen() {
  const code = useAppSelector(state => state.user.currentUser?.currency);
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.LIGHT[100]}}>
      <FlatList
        data={Object.values(currencies)}
        renderItem={({item}) => (
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 20,
              paddingVertical: 10,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 14, fontWeight: '500'}}>
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
                  .update({currency: await encrypt(item.code, uid!)});
              }}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

export default CurrencyScreen;
