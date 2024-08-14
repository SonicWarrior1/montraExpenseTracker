import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {useCallback, useMemo} from 'react';
import {ICONS} from '../../constants/icons';
import {
  ImageLibraryOptions,
  launchImageLibrary,
  CameraOptions,
  launchCamera,
} from 'react-native-image-picker';
import style from './styles';
import SheetBackdrop from '../SheetBackDrop';
import {useAppTheme} from '../../hooks/themeHook';
import SheetButtons from '../SheetButton';
// Third Party Libraries
import RNBlobUtil from 'react-native-blob-util';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {pickSingle, types} from 'react-native-document-picker';
import {useNetInfo} from '@react-native-community/netinfo';
import {Platform} from 'react-native';
import {throttle} from '../../utils/transFuncs';
import Toast from 'react-native-toast-message';
import {MimeToExtension} from '../../utils/commonFuncs';
import { STRINGS } from '../../localization';

function FilePickerSheet({
  bottomSheetModalRef,
  setImage,
  setDoc,
  onDismiss,
}: Readonly<{
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  setImage: React.Dispatch<React.SetStateAction<string | undefined>>;
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
  onDismiss?: () => void;
}>) {
  // constants
  const snapPoints = useMemo(() => ['25%'], []);
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const {isConnected} = useNetInfo();
  // functions
  const openImagePicker = useCallback(async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: !isConnected,
    };
    let response = await launchImageLibrary(options);
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else {
      let imageUri = response.assets![0].uri;
      if (!isConnected) {
        imageUri = response.assets![0].base64;
      }
      setImage(imageUri);
      bottomSheetModalRef.current?.close();
    }
  }, [isConnected]);
  const openCamera = useCallback(async () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      includeBase64: !isConnected,
    };
    let response = await launchCamera(options);
    console.log(response);
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else {
      let imageUri = response.assets![0].uri;
      if (!isConnected) {
        imageUri = response.assets![0].base64;
      }
      setImage(imageUri);
      bottomSheetModalRef.current?.close();
    }
  }, [isConnected]);
  const docPicker = async () => {
    try {
      let res = await pickSingle({
        copyTo: 'cachesDirectory',
        allowMultiSelection: false,
        type: [
          types.pdf,
          types.doc,
          types.docx,
          types.plainText,
          types.csv,
          types.xls,
          types.xlsx,
        ],
      });
      if (res.size! < 10485760) {
        let uri = res.fileCopyUri ?? res.uri;
        if (!isConnected) {
          const filePath = Platform.OS === 'ios' ? res.uri.slice(7) : res.uri;
          uri = await RNBlobUtil.fs.readFile(filePath, 'base64');
        }
        if (res) {
          setDoc({uri: uri, name: res.name!, type: MimeToExtension[res.type!]});
          bottomSheetModalRef.current?.close();
        } else {
          console.log('User cancelled doc picker');
        }
      } else {
        Toast.show({text1: STRINGS.FileError, type: 'error'});
        bottomSheetModalRef.current?.close();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <BottomSheetModal
      enablePanDownToClose
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={SheetBackdrop}
      backgroundStyle={styles.sheetBack}
      onDismiss={onDismiss}
      handleIndicatorStyle={{backgroundColor: COLOR.VIOLET[40]}}>
      <BottomSheetView style={styles.sheetView}>
        <SheetButtons
          title={STRINGS.Camera}
          icon={ICONS.Camera}
          onPress={throttle(openCamera, 1000)}
        />
        <SheetButtons
          title={STRINGS.Image}
          icon={ICONS.Gallery}
          onPress={throttle(openImagePicker, 1000)}
        />
        <SheetButtons
          title={STRINGS.Document}
          icon={ICONS.Document}
          onPress={throttle(docPicker, 1000)}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

export default React.memo(FilePickerSheet);
