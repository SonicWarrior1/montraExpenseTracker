import {FlatList, Pressable, SafeAreaView, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAppTheme} from '../../hooks/themeHook';
import style from './styles';
import CustomHeader from '../../components/CustomHeader';
import {ICONS} from '../../constants/icons';
import QrModal from './atoms/QrModal';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {useAppSelector} from '../../redux/store';
import {UserFromJson} from '../../utils/userFuncs';
import {getMyColor} from '../../utils/commonFuncs';
import {ChatDashboardScreenProps} from '../../defs/navigation';
import {NAVIGATION} from '../../constants/strings';

const ChatDashboard = ({navigation}: ChatDashboardScreenProps) => {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const [showModal, setShowModal] = useState<boolean>(false);
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  const [chats, setChats] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chat')
      .where('users', 'array-contains', uid)
      .onSnapshot(async snapshot => {
        const chatData = await Promise.all(
          snapshot.docs.map(async doc => {
            const data = doc.data();
            const otherUserUid =
              data.users[0] !== uid ? data.users[0] : data.users[1];
            const otherUserData = await firestore()
              .collection('users')
              .doc(otherUserUid)
              .get();
            const otherUser = UserFromJson(otherUserData.data()!);
            return {
              ...data,
              to: {
                name: otherUser.name,
                uid: otherUser.uid,
                color: getMyColor(),
              },
            };
          }),
        );
        console.log(chatData);
        setChats(chatData);
      });
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.safeView}>
      <QrModal
        onDismiss={() => {
          setShowModal(false);
        }}
        setShowModal={setShowModal}
        showModal={showModal}
      />
      <CustomHeader
        title="Chat"
        backgroundColor="white"
        color="black"
        navigation={navigation}
      />
      <FlatList
        data={chats}
        renderItem={({item}) => (
          <Pressable
            onPress={() => {
              navigation.navigate(NAVIGATION.ChatScreen, {roomId: item.id});
            }}
            style={styles.card}>
            <View style={[styles.imgCtr, {backgroundColor: item.to.color}]}>
              <Text style={styles.photoText}>
                {item.to.name[0].toUpperCase()}
              </Text>
            </View>
            <Text style={styles.name}>
              {item.to.name[0].toUpperCase() + item.to.name.slice(1)}
            </Text>
          </Pressable>
        )}
      />
      <Pressable
        style={styles.newBtn}
        onPress={() => {
          setShowModal(true);
        }}>
        {ICONS.Close({height: 40, width: 40})}
      </Pressable>
    </SafeAreaView>
  );
};

export default ChatDashboard;
