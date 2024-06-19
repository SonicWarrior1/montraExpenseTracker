import React from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import style from './styles';
import {ProfileScreenProps} from '../../defs/navigation';
import {NAVIGATION, STRINGS} from '../../constants/strings';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {COLORS} from '../../constants/commonStyles';
import {ICONS} from '../../constants/icons';
import {useAppTheme} from '../../hooks/themeHook';
// Third Party Libraries
import {openLogoutSheet} from '../../redux/reducers/transactionSlice';
import TabBackdrop from '../../components/TabBackdrop';
import CustomButton from '../../components/CustomButton';
import {useQuery, useRealm} from '@realm/react';
import {OnlineTransactionModel} from '../../DbModels/OnlineTransactionModel';
import {OfflineTransactionModel} from '../../DbModels/OfflineTransactionModel';

function ProfileScreen({navigation}: Readonly<ProfileScreenProps>) {
  const dispatch = useAppDispatch();
  const username = useAppSelector(state => state.user.currentUser?.name);
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const realm = useRealm();
  const trans = useAppSelector(state => state.transaction.transactions);
  const online = useQuery(OnlineTransactionModel);
  const offline = useQuery(OfflineTransactionModel);
  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <ScrollView>
          <View style={styles.mainView}>
            <View style={styles.nameRow}>
              <View style={styles.innerRow}>
                <View style={styles.imgCtr}>
                  <Image
                    source={require('../../assets/Images/profileImg.jpeg')}
                    style={styles.img}
                  />
                </View>
                <View>
                  <Text style={styles.text1}>{STRINGS.Username}</Text>
                  <Text style={styles.text2}>{username}</Text>
                </View>
              </View>
            </View>
            <View style={styles.card}>
              <Pressable
                style={styles.btn}
                onPress={() => {
                  navigation.navigate(NAVIGATION.Settings);
                }}>
                <View style={styles.colorBox}>
                  {ICONS.Setting({height: 22, width: 22})}
                </View>
                <Text style={styles.btnText}>{STRINGS.Settings}</Text>
              </Pressable>
              <Pressable
                style={styles.btn}
                onPress={() => {
                  navigation.navigate(NAVIGATION.ExportData);
                }}>
                <View style={styles.colorBox}>
                  {ICONS.Upload({height: 22, width: 22, color: 'transparent'})}
                </View>
                <Text style={styles.btnText}>{STRINGS.ExportData}</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, {borderBottomWidth: 0}]}
                onPress={() => {
                  dispatch(openLogoutSheet(true));
                }}>
                <View
                  style={[styles.colorBox, {backgroundColor: COLORS.RED[20]}]}>
                  {ICONS.Logout({height: 22, width: 22, color: 'transparent'})}
                </View>
                <Text style={styles.btnText}>{STRINGS.Logout}</Text>
              </Pressable>
            </View>
          </View>
          <CustomButton
            title="RealmCheck"
            onPress={() => {
              realm.write(() => {
                realm.create('OnlineTransaction', Object.values(trans)[0]);
              });
              realm.write(() => {
                realm.create('OfflineTransaction', Object.values(trans)[1]);
              });
              // console.log(realm.objects('transaction'))
              console.log('Online', online);
              console.log('Offline', offline);
              // console.log(realm.isEmpty)
            }}
          />
        </ScrollView>
      </SafeAreaView>
      <TabBackdrop />
    </>
  );
}

export default ProfileScreen;
