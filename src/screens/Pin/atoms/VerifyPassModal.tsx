import React, {useState} from 'react';
import {ActivityIndicator, Alert, Modal, Pressable} from 'react-native';
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

function VerifyPassModal({
  showModal,
  setShowModal,
  setMenu,
}: Readonly<{
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMenu: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
  const email = useAppSelector(state => state.user.currentUser?.email);
  const [pass, setPass] = useState('');
  const [formKey, setFormKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  return (
    <Modal transparent={true} visible={showModal} animationType="fade">
      <Pressable
        style={styles.modalBackground}
        onPress={() => {
          setShowModal(false);
        }}>
        <Pressable
          onPress={() => {}}
          style={{
            width: '90%',
            paddingVertical: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            paddingHorizontal: 15,
            borderRadius: 16,
          }}>
          <CustomPassInput
            onChangeText={str => {
              setPass(str);
            }}
            placeholderText="Password"
            value={pass}
          />
          <PassEmptyError pass={pass} formKey={formKey} />
          {loading ? (
            <ActivityIndicator />
          ) : (
            <CustomButton
              title="Verify"
              onPress={async () => {
                setFormKey(true);
                if (pass !== '') {
                  try {
                    setLoading(true);
                    const creds = await auth().signInWithEmailAndPassword(
                      email!,
                      pass,
                    );
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
                      setMenu(false);
                      setShowModal(false);
                      setLoading(false);
                    } else {
                      Alert.alert('Error');
                      setLoading(false);
                    }
                  } catch (e: any) {
                    const error: FirebaseAuthTypes.NativeFirebaseAuthError = e;
                    Alert.alert(error.nativeErrorMessage);
                    setLoading(false);
                    console.log(e);
                  }
                  setLoading(false);
                }
              }}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default VerifyPassModal;
