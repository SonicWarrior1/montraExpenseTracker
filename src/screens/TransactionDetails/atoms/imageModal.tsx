import React, {useState} from 'react';
import {ActivityIndicator, Image, Modal, Pressable} from 'react-native';
import {ICONS} from '../../../constants/icons';
import {COLORS} from '../../../constants/commonStyles';
import style from '../styles';
import { useAppTheme } from '../../../hooks/themeHook';

function ImageModal({
  showImage,
  setShowImage,
  url,
}: Readonly<{
  showImage: boolean;
  setShowImage: React.Dispatch<React.SetStateAction<boolean>>;
  url:string
}>) {
  const [isLoading, setIsLoading] = useState(false);
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  return (
    <Modal transparent={true} visible={showImage} animationType="fade">
      <Pressable
        style={styles.modalBackground}
        onPress={() => {
          setShowImage(false);
          setIsLoading(false);
        }}>
        <Pressable
          onPress={() => {}}
          style={{
            width: '90%',
            height: '80%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={{uri: url}}
            style={{width: '100%', height: '100%'}}
            onLoadStart={()=>{
                setIsLoading(true)
            }}
            onLoadEnd={() => {
              setIsLoading(false);
            }}
          />
          {!isLoading && (
            <Pressable
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: '#00000050',
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 3,
              }}
              onPress={() => {
                setShowImage(false);
                setIsLoading(false);
              }}>
              {ICONS.Close({height: 22, width: 22})}
            </Pressable>
          )}
          {isLoading && (
            <ActivityIndicator
              style={{position: 'absolute'}}
              color={COLORS.VIOLET[40]}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default ImageModal;
