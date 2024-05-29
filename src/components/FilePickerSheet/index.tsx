import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {useCallback, useMemo} from 'react';
import {iconProps, ICONS} from '../../constants/icons';
import {Pressable, Text} from 'react-native';
import {pickSingle} from 'react-native-document-picker';
import {
  ImageLibraryOptions,
  launchImageLibrary,
  CameraOptions,
  launchCamera,
} from 'react-native-image-picker';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import styles from './styles';

function FilePickerSheet({
  bottomSheetModalRef,
  setImage,
  setDoc,
}: Readonly<{
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  setImage: React.Dispatch<React.SetStateAction<string|undefined>>;
  setDoc: React.Dispatch<
    React.SetStateAction<
      | {
          uri: string;
          name: string;
        }
      | undefined
    >
  >;
}>) {
  const snapPoints = useMemo(() => ['25%'], []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const openImagePicker = useCallback(async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    let response = await launchImageLibrary(options);
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else {
      let imageUri = response.assets![0].uri;
      setImage(imageUri!);
      bottomSheetModalRef.current?.close();
    }
  }, []);
  const openCamera = useCallback(async () => {
    const options: CameraOptions = {
      mediaType: 'photo',
    };
    let response = await launchCamera(options);
    console.log(response);
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else {
      let imageUri = response.assets![0].uri;
      setImage(imageUri!);
      bottomSheetModalRef.current?.close();
    }
  }, []);
  const docPicker = useCallback(async () => {
    try {
      let res = await pickSingle();
      console.log(res);
      if (res) {
        setDoc({uri: res.uri, name: res.name!});
        bottomSheetModalRef.current?.close();
      } else {
        console.log('User cancelled doc picker');
      }
    } catch (e) {
      console.log(e);
    }
  }, []);
  return (
    <BottomSheetModal
      enablePanDownToClose
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <BottomSheetView style={styles.sheetView}>
        <SheetButtons title="Camera" icon={ICONS.Camera} onPress={openCamera} />
        <SheetButtons
          title="Gallery"
          icon={ICONS.Gallery}
          onPress={openImagePicker}
        />
        <SheetButtons
          title="Document"
          icon={ICONS.Document}
          onPress={docPicker}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

export default FilePickerSheet;
function SheetButtons({
  icon,
  title,
  onPress,
}: Readonly<{
  icon: (params: iconProps) => React.ReactNode;
  title: string;
  onPress: () => void;
}>) {
  return (
    <Pressable style={styles.sheetBtn} onPress={onPress}>
      {icon({height: 30, width: 30})}
      <Text style={styles.sheetBtnText}>{title}</Text>
    </Pressable>
  );
}
