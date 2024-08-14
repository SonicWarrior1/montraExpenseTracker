import React, {useCallback, useState} from 'react';
import {ActivityIndicator, Alert, View} from 'react-native';
import styles from '../styles';
import CustomPassInput from '../../../components/CustomPassInput';
import CustomButton from '../../../components/CustomButton';
import {PassEmptyError} from '../../../constants/errors';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
// Third Party Libraries
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {UserFromJson} from '../../../utils/userFuncs';
import {encrypt} from '../../../utils/encryption';
import {userLoggedIn} from '../../../redux/reducers/userSlice';
import {FirebaseAuthErrorHandler} from '../../../utils/firebase';
import Modal from 'react-native-modal';
import { STRINGS } from '../../../localization';

function VerifyPassModal({
  showModal,
  setShowModal,
  setMenu,
  setPin,
}: Readonly<{
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setPin: React.Dispatch<React.SetStateAction<number[]>>;
}>) {
  const email = useAppSelector(state => state.user.currentUser?.email);
  const [pass, setPass] = useState<string>('');
  const [formKey, setFormKey] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const onPress = useCallback(async () => {
    setFormKey(true);
    if (pass !== '') {
      try {
        setLoading(true);
        const creds = await auth().signInWithEmailAndPassword(email!, pass);
        if (creds) {
          const res = await firestore()
            .collection('users')
            .doc(creds.user.uid)
            .get();
          const user = UserFromJson(res.data()!);
          await firestore()
            .collection('users')
            .doc(creds.user.uid)
            .update({pin: encrypt('', creds.user.uid)});
          dispatch(userLoggedIn({...user, pin: ''}));
          setPin([]);
          setMenu(false);
          setShowModal(false);
          setLoading(false);
        } else {
          Alert.alert('Error');
          setLoading(false);
        }
      } catch (e: any) {
        const error: FirebaseAuthTypes.NativeFirebaseAuthError = e;
        Alert.alert(FirebaseAuthErrorHandler(error.code));
        setLoading(false);
        console.log(e);
      }
      setLoading(false);
    }
  }, [email, pass]);
  const onDismiss = useCallback(() => {
    setPass('');
    setShowModal(false);
    setFormKey(false);
  }, [setShowModal]);
  return (
    <Modal
      isVisible={showModal}
      avoidKeyboard={true}
      onBackdropPress={onDismiss}
      onBackButtonPress={onDismiss}
      style={styles.modalBackground}>
      <View style={styles.modal}>
        <CustomPassInput
          onChangeText={str => {
            setPass(str);
          }}
          placeholderText={STRINGS.Password}
          value={pass}
        />
        <PassEmptyError pass={pass} formKey={formKey} />
        {loading ? (
          <ActivityIndicator />
        ) : (
          <CustomButton title={STRINGS.Verify} onPress={onPress} />
        )}
      </View>
    </Modal>
  );
}

export default React.memo(VerifyPassModal);
