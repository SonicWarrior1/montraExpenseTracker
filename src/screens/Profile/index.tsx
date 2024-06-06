import React from 'react';
import {Image, Pressable, SafeAreaView, Text, View} from 'react-native';
import {ProfileScreenProps} from '../../defs/navigation';
import {NAVIGATION} from '../../constants/strings';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {userLoggedIn} from '../../redux/reducers/userSlice';
import auth from '@react-native-firebase/auth';
import {COLORS} from '../../constants/commonStyles';
import {ICONS} from '../../constants/icons';
import styles from './styles';

function ProfileScreen({navigation}: Readonly<ProfileScreenProps>) {
  const dispatch = useAppDispatch();
  const username = useAppSelector(state => state.user.currentUser?.name);
  return (
    <SafeAreaView style={styles.safeView}>
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
              <Text style={styles.text1}>Username</Text>
              <Text style={styles.text2}>{username}</Text>
            </View>
          </View>
          {ICONS.Edit({height: 32, width: 32, color: 'transparent'})}
        </View>
        <View style={styles.card}>
          <Pressable style={styles.btn}>
            <View style={styles.colorBox}>
              {ICONS.Wallet({height: 24, width: 24})}
            </View>
            <Text style={styles.btnText}>Account</Text>
          </Pressable>
          <Pressable
            style={styles.btn}
            onPress={() => {
              navigation.navigate(NAVIGATION.Settings);
            }}>
            <View style={styles.colorBox}>
              {ICONS.Setting({height: 24, width: 24})}
            </View>
            <Text style={styles.btnText}>Settings</Text>
          </Pressable>
          <Pressable
            style={styles.btn}
            onPress={() => {
              navigation.navigate(NAVIGATION.ExportData);
            }}>
            <View style={styles.colorBox}>
              {ICONS.Upload({height: 24, width: 24, color: 'transparent'})}
            </View>
            <Text style={styles.btnText}>Export Data</Text>
          </Pressable>
          <Pressable
            style={[styles.btn, {borderBottomWidth: 0}]}
            onPress={async () => {
              try {
                await auth().signOut();
                dispatch(userLoggedIn(undefined));
              } catch (e) {
                console.log(e);
              }
            }}>
            <View style={[styles.colorBox, {backgroundColor: COLORS.RED[20]}]}>
              {ICONS.Logout({height: 24, width: 24, color: 'transparent'})}
            </View>
            <Text style={styles.btnText}>Logout</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default ProfileScreen;
