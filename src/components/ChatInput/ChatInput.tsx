import {View, TextInput, Pressable, Image, Text} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {ICONS} from '../../constants/icons';
import {useAppSelector} from '../../redux/store';
import {sendMessage} from '../../utils/firebase';
import style from './styles';
import {useAppTheme} from '../../hooks/themeHook';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {ChatMessage} from '../../defs/ChatMessage';
import ChatFilePickerSheet from '../ChatFilePickerSheet';

const ChatInput = ({id}: {id: string}) => {
  const [msg, setMsg] = useState('');
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const ref = useRef<BottomSheetModalMethods>(null);
  const [doc, setDoc] = useState<
    {uri: string; name: string; type: string} | undefined
  >(undefined);
  const [audio, setAudio] = useState<
    {uri: string; name: string; type: string} | undefined
  >(undefined);
  const [img, setImage] = useState<string>();
  const getAttachmentAndType = useCallback(() => {
    let attachement = '';
    let attachementType: ChatMessage['type'] = 'text';
    if (img && img !== '') {
      attachement = img!;
      attachementType = 'image';
    } else if (doc) {
      attachement = doc.uri;
      attachementType = doc.type as ChatMessage['type'];
    }
    return {attachement, attachementType};
  }, [img, doc]);
  const send = useCallback(async () => {
    const {attachement, attachementType} = getAttachmentAndType();
    console.log(attachement, attachementType);
    if (msg) {
      const msgToSend = msg;
      setMsg('');
      await sendMessage({
        id: id,
        message: msgToSend,
        by: uid!,
        attachement: attachement,
        attachementType: attachementType,
      });
    }
  }, [getAttachmentAndType, id, msg, uid]);
  return (
    <>
      <View style={styles.view}>
        {img && (
          <View>
            <Pressable
              onPress={() => {
                setImage('');
              }}
              style={[styles.closeIcon, {left: 65}]}>
              {ICONS.Close({height: 20, width: 20})}
            </Pressable>
            <Image
              source={{uri: img}}
              height={80}
              width={80}
              style={{borderRadius: 10, marginBottom: 10}}
            />
          </View>
        )}
        {doc && (
          <View
            style={{
              width: 100,
              height: 120,
              padding: 10,
              overflow: 'hidden',
              borderWidth: 1,
              marginBottom: 10,
              borderRadius: 16,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Pressable
              onPress={() => {
                setDoc(undefined);
              }}
              style={[styles.closeIcon, {left: 70, top: 5}]}>
              {ICONS.Close({height: 20, width: 20})}
            </Pressable>
            {ICONS.Document({height: 40, width: 40})}
            <Text numberOfLines={2}>{doc.name}</Text>
          </View>
        )}
        <View style={styles.inputView}>
          {!img && !doc && (
            <Pressable
              onPress={() => {
                ref.current?.present();
              }}>
              {ICONS.Attachment({height: 25, width: 25, color: 'black'})}
            </Pressable>
          )}
          <TextInput
            autoCorrect={false}
            maxLength={200}
            style={styles.input}
            onChangeText={str => {
              setMsg(str);
            }}
            placeholder="Message"
            value={msg}
            onSubmitEditing={send}
          />
          <Pressable onPress={send}>
            {ICONS.Send({height: 35, width: 35, color: 'transparent'})}
          </Pressable>
        </View>
      </View>
      <BottomSheetModalProvider>
        <ChatFilePickerSheet
          bottomSheetModalRef={ref}
          setDoc={setDoc}
          setImage={setImage}
        />
      </BottomSheetModalProvider>
    </>
  );
};

export default ChatInput;
