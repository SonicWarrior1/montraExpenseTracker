import React, {useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import CustomInput from '../../components/CustomInput';
import {EmailEmptyError, PassEmptyError} from '../../constants/errors';
import CustomPassInput from '../../components/CustomPassInput';
import CustomButton from '../../components/CustomButton';
import {NAVIGATION, STRINGS} from '../../constants/strings';
import {COLORS} from '../../constants/commonStyles';
import Sapcer from '../../components/Spacer';
import {ICONS} from '../../constants/icons';
import {LoginScreenProps} from '../../defs/navigation';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {setLoading, userLoggedIn} from '../../redux/reducers/userSlice';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useAppDispatch} from '../../redux/store';
import { UserFromJson, UserToJson } from '../../utils/userFuncs';

function Login({navigation}: Readonly<LoginScreenProps>) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [form, setForm] = useState(false);
  const dispatch = useAppDispatch();
  function onChangeEmail(str: string) {
    setEmail(str);
  }
  function onChangePass(str: string) {
    setPass(str);
  }
  async function handleLogin() {
    setForm(true);
    if (email !== '' && pass !== '') {
      try {
        dispatch(setLoading(true));
        const creds = await auth().signInWithEmailAndPassword(email, pass);
        if (creds) {
          const data = await firestore()
            .collection('users')
            .doc(creds.user.uid)
            .get();
          const user = UserFromJson(data.data()!);
          dispatch(userLoggedIn(user));
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
        const res = await firestore()
          .collection('users')
          .doc(creds.user.uid)
          .get();
        if (!res.exists) {
          const user = UserToJson({
            name: creds.user.displayName!,
            email: creds.user.email!,
            uid: creds.user.uid,
            pin: '',
          });
          await firestore().collection('users').doc(creds.user.uid).set(user);
          dispatch(userLoggedIn({
            name: creds.user.displayName!,
            email: creds.user.email!,
            uid: creds.user.uid,
            pin: '',
          }));
        } else {
          const data = await firestore()
            .collection('users')
            .doc(creds.user.uid)
            .get();
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
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{
          flex: 1,
        }}>
        <View style={styles.mainView}>
          <CustomInput
            placeholderText="Email"
            onChangeText={onChangeEmail}
            type="email"
            value={email}
          />
          <EmailEmptyError email={email} formKey={form} />
          <CustomPassInput
            onChangeText={onChangePass}
            placeholderText="Password"
            value={pass}
          />
          <PassEmptyError pass={pass} formKey={form} />
          <Sapcer height={30} />
          <CustomButton title={STRINGS.LOGIN} onPress={handleLogin} />
          <Sapcer height={10} />
          <Text style={styles.orText}>Or With</Text>
          <Sapcer height={10} />
          <TouchableOpacity onPress={onGoogleButtonPress} style={[styles.btn]}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
              {ICONS.Google({height: 25, width: 25})}
              <Text style={[styles.text]}>Log in with Google</Text>
            </View>
          </TouchableOpacity>
          <Sapcer height={20} />
          <Pressable
            onPress={() => {
              navigation.push(NAVIGATION.FORGOTPASSWORD);
            }}>
            <Text
              style={{
                color: COLORS.PRIMARY.VIOLET,
                fontSize: 18,
                fontWeight: '600',
              }}>
              Forgot Password ?
            </Text>
          </Pressable>
          <Sapcer height={20} />
          <Text style={{color: COLORS.DARK[25]}}>
            Don't have an account yet?{' '}
            <Pressable
              onPress={() => {
                navigation.navigate(NAVIGATION.SIGNUP);
              }}>
              <Text
                style={{
                  color: COLORS.PRIMARY.VIOLET,
                  textDecorationLine: 'underline',
                }}>
                {STRINGS.SIGNUP}
              </Text>
            </Pressable>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Login;
