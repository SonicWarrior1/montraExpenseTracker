import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {ICONS} from '../../../constants/icons';
import style from '../styles';
import {STRINGS} from '../../../constants/strings';
import {useAppTheme} from '../../../hooks/themeHook';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {useNetInfo} from '@react-native-community/netinfo';

function AttachementContainer({
  image,
  doc,
  setZindex,
  filePickSheetRef,
  setImage,
  zindex,
  setDoc,
}: Readonly<{
  image: string;
  doc:
    | {
        uri: string;
        name: string;
      }
    | undefined;
  setZindex: React.Dispatch<React.SetStateAction<number>>;
  filePickSheetRef: React.RefObject<BottomSheetModalMethods>;
  setImage: React.Dispatch<React.SetStateAction<string | undefined>>;
  zindex: number;
  setDoc: React.Dispatch<
    React.SetStateAction<
      | {
          uri: string;
          name: string;
          type: string;
        }
      | undefined
    >
  >;
}>) {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const {isConnected} = useNetInfo();
  // console.log(isConnected)
  if (image === '' && doc === undefined) {
    return (
      <Pressable
        style={styles.attachementCtr}
        onPress={() => {
          setZindex(0);
          filePickSheetRef.current?.present();
        }}>
        {ICONS.Attachment({
          height: 25,
          width: 25,
          color: COLOR.DARK[25],
        })}
        <Text style={styles.attachementText}>{STRINGS.AddAttachement}</Text>
      </Pressable>
    );
  } else if (doc === undefined) {
    return (
      <View>
        <Pressable
          onPress={() => {
            setImage('');
          }}
          style={[styles.closeIcon, {left: 90, zIndex: zindex}]}>
          {ICONS.Close({height: 20, width: 20})}
        </Pressable>
        {isConnected ? (
          <Image
            source={{uri: image}}
            height={110}
            width={110}
            style={{borderRadius: 10}}
          />
        ) : (
          <Image
            source={{uri: 'data:image/png;base64,' + image}}
            height={110}
            width={110}
            style={{borderRadius: 10}}
          />
        )}
      </View>
    );
  } else {
    return (
      <View>
        <Pressable
          onPress={() => {
            setDoc(undefined);
          }}
          style={[styles.closeIcon, {left: 100, zIndex: zindex}]}>
          {ICONS.Close({height: 20, width: 20})}
        </Pressable>
        <Pressable
          style={[styles.sheetBtn, {paddingHorizontal: 10}]}
          onPress={() => {}}>
          {ICONS.Document({height: 30, width: 30})}
          <Text style={styles.sheetBtnText}>{doc.name}</Text>
        </Pressable>
      </View>
    );
  }
}

export default AttachementContainer;
