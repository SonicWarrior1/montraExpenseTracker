import {View} from 'react-native';
import React, {SetStateAction, useEffect} from 'react';
import ReactNativeModal from 'react-native-modal';
import style from '../styles';
import {useAppTheme} from '../../../hooks/themeHook';
import QRCode from 'react-native-qrcode-svg';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {createRoom} from '../../../utils/firebase';
import {setLoading} from '../../../redux/reducers/userSlice';

const QrModal = ({
  showModal,
  setShowModal,
  onDismiss,
}: {
  showModal: boolean;
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
  onDismiss: () => void;
}) => {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  const device = useCameraDevice('back');
  const {hasPermission, requestPermission} = useCameraPermission();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: async codes => {
      //   console.log(`Scanned ${codes[0].value} codes!`);
      if (codes[0].value) {
        dispatch(setLoading(true));
        await createRoom({myUid: uid!, otherUserUid: codes[0].value});
        setShowModal(false)
        dispatch(setLoading(false));
      }
    },
  });
  return (
    <ReactNativeModal
      isVisible={showModal}
      avoidKeyboard={true}
      onBackdropPress={onDismiss}
      onBackButtonPress={onDismiss}
      style={styles.modalBackground}>
      <View style={styles.modal}>
        {device ? (
          <Camera
            //   style={StyleSheet.absoluteFill}
            style={{height: 200, width: 200}}
            device={device}
            isActive={true}
            codeScanner={codeScanner}
          />
        ) : (
          <QRCode value={uid} size={200} />
        )}
      </View>
    </ReactNativeModal>
  );
};

export default QrModal;
