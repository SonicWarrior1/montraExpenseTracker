import React, {useState} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './styles';
import CustomInput from '../../components/CustomInput';
import {EmailEmptyError, PassEmptyError} from '../../constants/errors';
import CustomPassInput from '../../components/CustomPassInput';
import CustomButton from '../../components/CustomButton';
import {NAVIGATION, STRINGS} from '../../constants/strings';
import Spacer from '../../components/Spacer';
import {ICONS} from '../../constants/icons';
import {LoginScreenProps} from '../../defs/navigation';
import {setLoading, userLoggedIn} from '../../redux/reducers/userSlice';
import {useAppDispatch} from '../../redux/store';
import {UserFromJson, UserToJson} from '../../utils/userFuncs';
import {useAppTheme} from '../../hooks/themeHook';
// Third Party Libraries
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';

function Login({navigation}: Readonly<LoginScreenProps>) {
  // constants
  const dispatch = useAppDispatch();
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const userCollection = firestore().collection('users');
  // state
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [form, setForm] = useState({
    email: false,
    pass: false,
  });
  // functions
  function onChangeEmail(str: string) {
    setEmail(str);
  }
  function onChangePass(str: string) {
    setPass(str);
  }
  async function handleLogin() {
    setForm({email: true, pass: true});
    if (email !== '' && pass !== '') {
      try {
        dispatch(setLoading(true));
        const creds = await auth().signInWithEmailAndPassword(email, pass);
        if (creds) {
          if (creds.user.emailVerified) {
            const data = await userCollection.doc(creds.user.uid).get();
            const user = UserFromJson(data.data()!);
            if (user.pin === '') {
              navigation.navigate(NAVIGATION.PIN, {
                pin: user.pin === '' ? undefined : user.pin,
                uid: creds.user.uid,
              });
            } else {
              dispatch(userLoggedIn(user));
            }
          } else {
            Alert.alert(
              'Please verify your email',
              'A verification email has already been sent to your registered email address, so verify your email before login.',
              [
                {
                  text: 'Resend',
                  onPress: () => {
                    (async () => {
                      try {
                        await creds.user.sendEmailVerification();
                        await auth().signOut();
                      } catch (e) {
                        console.log(e);
                        await auth().signOut();
                      }
                    })();
                  },
                },
                {
                  text: 'OK',
                  onPress: () => {
                    (async () => {
                      console.log('OK Pressed');
                      await auth().signOut();
                    })();
                  },
                },
              ],
            );
          }
        }
      } catch (e: any) {
        const error: FirebaseAuthTypes.NativeFirebaseAuthError = e;
        console.log(e);
        Toast.show({text1: error.nativeErrorMessage, type: 'error'});
      }
      dispatch(setLoading(false));
    }
  }
  async function onGoogleButtonPress() {
    try {
      dispatch(setLoading(true));
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const creds = await auth().signInWithCredential(googleCredential);
      if (creds) {
        const res = await userCollection.doc(creds.user.uid).get();
        if (!res.exists) {
          const user = UserToJson({
            name: creds.user.displayName!,
            email: creds.user.email!,
            uid: creds.user.uid,
            pin: '',
          });
          await userCollection.doc(creds.user.uid).set(user);
          navigation.navigate(NAVIGATION.PIN, {
            pin: user.pin === '' ? undefined : user.pin,
            uid: creds.user.uid,
          });
        } else {
          const data = await userCollection.doc(creds.user.uid).get();
          const user = UserFromJson(data.data()!);
          if (user) {
            dispatch(userLoggedIn(user));
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
    dispatch(setLoading(false));
  }
  return (
    <SafeAreaView style={styles.safeView}>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <View style={styles.mainView}>
          <CustomInput
            placeholderText={STRINGS.Email}
            onChangeText={onChangeEmail}
            type="email"
            value={email}
            inputColor={COLOR.DARK[100]}
            onBlur={e => {
              if (email === '') {
                setForm(formkey => ({...formkey, email: true}));
              }
            }}
          />
          <EmailEmptyError email={email} formKey={form.email} />
          <CustomPassInput
            onChangeText={onChangePass}
            placeholderText={STRINGS.Password}
            value={pass}
            inputColor={COLOR.DARK[100]}
            onBlur={e => {
              if (pass === '') {
                setForm(formkey => ({...formkey, pass: true}));
              }
            }}
          />
          <PassEmptyError pass={pass} formKey={form.pass} />
          <Spacer height={15} />
          <CustomButton title={STRINGS.LOGIN} onPress={handleLogin} />
          <Spacer height={10} />
          <Text style={styles.orText}>{STRINGS.Or}</Text>
          <Spacer height={10} />
          <TouchableOpacity onPress={onGoogleButtonPress} style={[styles.btn]}>
            <View style={styles.googleRow}>
              {ICONS.Google({height: 25, width: 25})}
              <Text style={styles.text}>{STRINGS.LoginGoogle}</Text>
            </View>
          </TouchableOpacity>
          <Spacer height={20} />
          <Pressable
            onPress={() => {
              navigation.push(NAVIGATION.FORGOTPASSWORD);
            }}>
            <Text style={styles.forgotText}>{STRINGS.ForgotPassword}</Text>
          </Pressable>
          <Spacer height={20} />
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.dontHaveAcc}>{STRINGS.DontHaveAccount} </Text>
            <Pressable
              onPress={() => {
                navigation.navigate(NAVIGATION.SIGNUP);
              }}>
              <Text style={styles.signupText}>{STRINGS.SIGNUP}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default React.memo(Login);
