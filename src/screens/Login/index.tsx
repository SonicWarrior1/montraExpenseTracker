import React, {useState} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
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
import {COLORS} from '../../constants/commonStyles';
import Sapcer from '../../components/Spacer';
import {ICONS} from '../../constants/icons';
import {LoginScreenProps} from '../../defs/navigation';
import {setLoading, userLoggedIn} from '../../redux/reducers/userSlice';
import {useAppDispatch} from '../../redux/store';
import {UserFromJson, UserToJson} from '../../utils/userFuncs';
import {useAppTheme} from '../../hooks/themeHook';
// Third Party Libraries
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {RFValue} from 'react-native-responsive-fontsize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

function Login({navigation}: Readonly<LoginScreenProps>) {
  // constants
  const dispatch = useAppDispatch();
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const userCollection = firestore().collection('users');
  // state
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [form, setForm] = useState(false);
  // functions
  function onChangeEmail(str: string) {
    setEmail(str);
  }
  function onChangePass(str: string) {
    setPass(str);
  }
  async function handleLogin() {+
    setForm(true);
    if (email !== '' && pass !== '') {
      try {
        dispatch(setLoading(true));
        const creds = await auth().signInWithEmailAndPassword(email, pass);
        if (creds) {
          if (creds.user.emailVerified) {
            const data = await userCollection.doc(creds.user.uid).get();
            const user = UserFromJson(data.data()!);
            dispatch(userLoggedIn(user));
          } else {
            Alert.alert('Please verify your email', '', [
              {
                text: 'Resend',
                onPress: async () => {
                  try {
                    await creds.user.sendEmailVerification();
                    await auth().signOut();
                  } catch (e) {
                    console.log(e);
                    await auth().signOut();
                  }
                },
              },
              {
                text: 'OK',
                onPress: async () => {
                  console.log('OK Pressed');
                  await auth().signOut();
                },
              },
            ]);
          }
        }
      } catch (e) {
        console.log(e);
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
          dispatch(
            userLoggedIn({
              name: creds.user.displayName!,
              email: creds.user.email!,
              uid: creds.user.uid,
              pin: '',
            }),
          );
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
      <KeyboardAwareScrollView style={styles.flex} contentContainerStyle={styles.flex}>
        <View style={styles.mainView}>
          <CustomInput
            placeholderText={STRINGS.Email}
            onChangeText={onChangeEmail}
            type="email"
            value={email}
            inputColor={COLOR.DARK[100]}
          />
          <EmailEmptyError email={email} formKey={form} />
          <CustomPassInput
            onChangeText={onChangePass}
            placeholderText={STRINGS.Password}
            value={pass}
            inputColor={COLOR.DARK[100]}
          />
          <PassEmptyError pass={pass} formKey={form} />
          <Sapcer height={15} />
          <CustomButton title={STRINGS.LOGIN} onPress={handleLogin} />
          <Sapcer height={10} />
          <Text style={styles.orText}>{STRINGS.OrWith}</Text>
          <Sapcer height={10} />
          <TouchableOpacity onPress={onGoogleButtonPress} style={[styles.btn]}>
            <View style={styles.googleRow}>
              {ICONS.Google({height: 25, width: 25})}
              <Text style={styles.text}>{STRINGS.LoginGoogle}</Text>
            </View>
          </TouchableOpacity>
          <Sapcer height={20} />
          <Pressable
            onPress={() => {
              navigation.push(NAVIGATION.FORGOTPASSWORD);
            }}>
            <Text style={styles.forgotText}>{STRINGS.ForgotPassword}</Text>
          </Pressable>
          <Sapcer height={20} />
          <Text style={{color: COLORS.DARK[25], fontSize: RFValue(16)}}>
            {STRINGS.DontHaveAccount}{' '}
            <Pressable
              onPress={() => {
                navigation.navigate(NAVIGATION.SIGNUP);
              }}>
              <Text style={styles.signupText}>{STRINGS.SIGNUP}</Text>
            </Pressable>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default Login;
