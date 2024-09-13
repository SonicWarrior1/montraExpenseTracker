import {Text, SafeAreaView, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {ChatScreenProps} from '../../defs/navigation';
import {useAppSelector} from '../../redux/store';
import ChatInput from '../../components/ChatInput/ChatInput';
import ChatTextCard from '../../components/ChatTextCard';
import {ChatMessage} from '../../defs/ChatMessage';
import {ChatFromJson} from '../../utils/chatFuncs';

const ChatScreen = ({route}: ChatScreenProps) => {
  const id = route.params?.roomId;
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chat')
      .doc(id)
      .collection('messages')
      .orderBy('time', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ChatFromJson(doc.data()));
        console.log(data);
        setChat(data);
      });
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text>ChatScreen</Text>
      <FlatList
        style={{paddingHorizontal: 15, marginBottom: 5}}
        data={chat}
        inverted
        renderItem={({item}) => <ChatTextCard item={item} uid={uid!} />}
      />
      <ChatInput id={id} />
    </SafeAreaView>
  );
};

export default ChatScreen;
