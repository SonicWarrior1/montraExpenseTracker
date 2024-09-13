import React, { useRef } from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import {useAppTheme} from '../../hooks/themeHook';
import style from './styles';
import {ChatMessage} from '../../defs/ChatMessage';
import {formatAMPM} from '../../utils/firebase';
import {ICONS} from '../../constants/icons';
import {setLoading} from '../../redux/reducers/userSlice';
import {useAppDispatch} from '../../redux/store';
import ReactNativeBlobUtil from 'react-native-blob-util';
import FileViewer from 'react-native-file-viewer';
import Video, { VideoRef } from 'react-native-video';

const ChatTextCard = ({item, uid}: {item: ChatMessage; uid: string}) => {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const dispatch = useAppDispatch();
  const videoRef = useRef<VideoRef>(null);

  return (
    <View
      style={[
        styles.card,
        {
          alignSelf: item.sender === uid ? 'flex-end' : 'flex-start',
        },
      ]}>
      {item.type !== 'text' && (
        <View>
          {item.type === 'image' ? (
            <Image
              source={{uri: item.attachment}}
              height={200}
              width={200}
              style={{
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                marginTop: 5,
                marginBottom: 10,
              }}
            />
          ) : item.type === 'video' ? (
            <Video
              source={{uri: item.attachment}}
              style={{height: 200, width: 200}}
              ref={videoRef}
            />
          ) : item.type === 'audio' ? (
            <></>
          ) : (
            <Pressable
              onPress={async () => {
                try {
                  dispatch(setLoading(true));
                  console.log(item.type);
                  const res = await ReactNativeBlobUtil.config({
                    fileCache: true,
                    appendExt: item.type,
                  }).fetch('GET', item.attachment ?? '');
                  dispatch(setLoading(false));
                  FileViewer.open(res.path(), {showOpenWithDialog: true});
                } catch (e) {
                  console.log(e);
                  dispatch(setLoading(false));
                }
              }}>
              {ICONS.Document({height: 40, width: 40})}
            </Pressable>
          )}
        </View>
      )}
      <Text style={styles.msg}>{item.text}</Text>
      <Text style={styles.time}>{formatAMPM(item.time.toDate())}</Text>
    </View>
    // </Swipeable>
  );
};

export default ChatTextCard;
