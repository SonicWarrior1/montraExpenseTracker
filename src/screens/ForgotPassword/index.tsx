import React, {useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import style from './styles';
import Spacer from '../../components/Spacer';
import CustomInput from '../../components/CustomInput';
import {
  EmailEmptyError,
  EmailValError,
  testInput,
} from '../../constants/errors';
import CustomButton from '../../components/CustomButton';
import {ForgotScreenProps} from '../../defs/navigation';
import {emailRegex, NAVIGATION, STRINGS} from '../../constants/strings';
import {useAppTheme} from '../../hooks/themeHook';
// Third Party Libraries
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useAppDispatch} from '../../redux/store';
import {setLoading} from '../../redux/reducers/userSlice';
import Toast from 'react-native-toast-message';
import {decrypt} from '../../utils/encryption';
import CustomHeader from '../../components/CustomHeader';

function ForgotPassword({navigation}: Readonly<ForgotScreenProps>) {
  // constants
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const dispatch = useAppDispatch();
  // state
  const [email, setEmail] = useState('');
  const [form, setForm] = useState(false);
  // functions
  function onChangeEmail(str: string) {
    setEmail(str);
  }
  async function isUserExist(email: string) {
    try {
      const snapshot = await firestore().collection('users').get();
      const res = snapshot.docs.filter(doc => {
        return (
          (decrypt(doc.data()['email'], doc.data()['uid']) ?? '') === email
        );
      });
      return res.length !== 0;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  async function handleForgot() {
    setForm(true);
    if (email !== '' && testInput(emailRegex, email)) {
      try {
        dispatch(setLoading(true));
        if (await isUserExist(email)) {
          await auth().sendPasswordResetEmail(email);
          navigation.reset({
            index: 2,
            routes: [
              {name: NAVIGATION.ONBOARDING},
              {name: NAVIGATION.LOGIN},
              {name: NAVIGATION.FORGOTEMAILSENT, params: {email: email}},
            ],
          });
        } else {
          Toast.show({text1: 'This email is not registered', type: 'error'});
        }
        dispatch(setLoading(false));
      } catch (e: any) {
        console.log(e);
        const error: FirebaseAuthTypes.NativeFirebaseAuthError = e;
        Toast.show({text1: error.nativeErrorMessage, type: 'error'});
        dispatch(setLoading(false));
      }
    }
  }

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.flex}>
        <CustomHeader
          backgroundColor={COLOR.LIGHT[100]}
          title="Forgot Password"
          color={COLOR.DARK[100]}
          navigation={navigation}
        />
        <View style={styles.mainView}>
          <Text style={styles.text}>{STRINGS.DontWorry}</Text>
          <Text style={styles.text}>{STRINGS.EnterEmailForReset}</Text>
          <Spacer height={30} />
          <CustomInput
            placeholderText={STRINGS.Email}
            onChangeText={onChangeEmail}
            type="email"
            value={email}
            inputColor={COLOR.DARK[100]}
          />
          <EmailValError email={email} formKey={form} />
          <Spacer height={20} />
          <CustomButton onPress={handleForgot} title={STRINGS.Continue} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ForgotPassword;
