import React, {useState} from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './styles';
import CustomInput from '../../components/CustomInput';
import Spacer from '../../components/Spacer';
import {
  ConfirmPassError,
  EmailValError,
  NameValError,
  PassValidationError,
  testInput,
} from '../../constants/errors';
import CustomPassInput from '../../components/CustomPassInput';
import CustomButton from '../../components/CustomButton';
import {
  emailRegex,
  nameRegex,
  NAVIGATION,
  STRINGS,
} from '../../constants/strings';
import {COLORS} from '../../constants/commonStyles';
import {ICONS} from '../../constants/icons';
import {SignupScreenProps} from '../../defs/navigation';
import {
  setLoading,
  setTheme,
  userLoggedIn,
} from '../../redux/reducers/userSlice.ts';
import {useAppDispatch} from '../../redux/store/index.ts';
import {UserFromJson, UserToJson} from '../../utils/userFuncs.ts';
import {FirebaseAuthErrorHandler, singupUser} from '../../utils/firebase.ts';
import {useAppTheme} from '../../hooks/themeHook.ts';
// Third party libraries
import BouncyCheckbox from 'react-native-bouncy-checkbox/build/dist/BouncyCheckbox';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../components/CustomHeader/index.tsx';
import {useFocusEffect} from '@react-navigation/native';
function Signup({navigation}: Readonly<SignupScreenProps>) {
  // constants
  const dispatch = useAppDispatch();
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const userCollection = firestore().collection('users');
  // state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [checked, setChecked] = useState(false);
  const [form, setForm] = useState({
    name: false,
    email: false,
    pass: false,
    confirmPass: false,
    terms: false,
  });
  // functions
  function onChangeName(str: string) {
    setName(str);
  }
  function onChangeEmail(str: string) {
    setEmail(str);
  }
  function onChangePass(str: string) {
    setPass(str);
  }
  function onChangeConfirmPass(str: string) {
    setConfirmPass(str);
  }

  async function handleSignup() {
    setForm({
      name: true,
      email: true,
      pass: true,
      confirmPass: true,
      terms: true,
    });
    if (
      name.trim() !== '' &&
      testInput(nameRegex, name) &&
      email !== '' &&
      testInput(emailRegex, email) &&
      pass.trim() !== '' &&
      pass.length >= 6 &&
      pass === confirmPass &&
      checked
    ) {
      try {
        dispatch(setLoading(true));
        const res = await singupUser({name: name, email: email, pass: pass});
        if (res) {
          Toast.show({text1: STRINGS.SignupSuccesful, visibilityTime: 2000});
          navigation.replace(NAVIGATION.LOGIN);
        }
        dispatch(setLoading(false));
      } catch (e: any) {
        const error: FirebaseAuthTypes.NativeFirebaseAuthError = e;
        Toast.show({
          text1: FirebaseAuthErrorHandler(error.code),
          type: 'error',
        });
        console.log(e);
        dispatch(setLoading(false));
      }
    }
  }

  async function onGoogleButtonPress() {
    try {
      dispatch(setLoading(true));
      if (await GoogleSignin.isSignedIn()) {
        await GoogleSignin.signOut();
      }
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
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
          // });
          dispatch(userLoggedIn(user));
          dispatch(setTheme(undefined));
        } else {
          const data = await userCollection.doc(creds.user.uid).get();
          const user = UserFromJson(data.data()!);
          if (user) {
            dispatch(userLoggedIn(user));
            dispatch(setTheme(undefined));
          }
        }
      }
      dispatch(setLoading(false));
    } catch (e) {
      console.log(e);
      dispatch(setLoading(false));
    }
  }
  return (
    <SafeAreaView style={styles.safeView}>
      <KeyboardAwareScrollView style={{flex: 1}}>
        <CustomHeader
          backgroundColor={COLOR.LIGHT[100]}
          title="Sign Up"
          color={COLOR.DARK[100]}
          navigation={navigation}
        />
        <View style={styles.mainView}>
          <CustomInput
            placeholderText={STRINGS.Name}
            onChangeText={onChangeName}
            type="name"
            value={name}
            inputColor={COLOR.DARK[100]}
            onBlur={e => {
              if (name === '') {
                setForm(formkey => ({...formkey, name: true}));
              }
            }}
            maxLength={30}
          />
          <NameValError name={name.trim()} formKey={form.name} />
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
          <EmailValError email={email} formKey={form.email} />
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
          <PassValidationError pass={pass} formKey={form.pass} />
          <CustomPassInput
            onChangeText={onChangeConfirmPass}
            placeholderText={STRINGS.ConfrimPassword}
            value={confirmPass}
            inputColor={COLOR.DARK[100]}
            onBlur={e => {
              if (confirmPass === '') {
                setForm(formkey => ({...formkey, confirmPass: true}));
              }
            }}
          />
          <ConfirmPassError
            pass={pass}
            confirmPass={confirmPass}
            formKey={form.confirmPass}
          />
          <BouncyCheckbox
            size={25}
            fillColor={
              !checked && form.terms ? COLORS.RED[100] : COLORS.PRIMARY.VIOLET
            }
            unFillColor={COLOR.LIGHT[100]}
            iconStyle={{borderRadius: 5}}
            innerIconStyle={{borderWidth: 2, borderRadius: 5}}
            onPress={(isChecked: boolean) => {
              setChecked(isChecked);
              setForm(form => ({...form, terms: true}));
            }}
            isChecked={checked}
            textComponent={
              <View style={{flex: 1, marginLeft: 16}}>
                <Text style={{color: COLOR.DARK[100]}}>
                  {STRINGS.BySigningUp}{' '}
                  <Text style={{color: COLORS.PRIMARY.VIOLET}}>
                    {STRINGS.Terms}
                  </Text>
                </Text>
              </View>
            }
            disableText={false}
          />
          <Spacer height={20} />
          <CustomButton title={STRINGS.SIGNUP} onPress={handleSignup} />
          <Spacer height={10} />
          <Text style={styles.orText}>{STRINGS.OrWith}</Text>
          <Spacer height={10} />
          <TouchableOpacity onPress={onGoogleButtonPress} style={[styles.btn]}>
            <View style={styles.googleBtn}>
              {ICONS.Google({height: 25, width: 25})}
              <Text style={styles.text}>{STRINGS.SignupWithGoogle}</Text>
            </View>
          </TouchableOpacity>
          <Spacer height={10} />
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.text2}>{STRINGS.AlreadyHaveAccount} </Text>
            <Pressable
              onPress={() => {
                navigation.navigate(NAVIGATION.LOGIN);
                setEmail('');
                setName('');
                setChecked(false);
                setPass('');
                setConfirmPass('');
                setForm({
                  name: false,
                  email: false,
                  pass: false,
                  confirmPass: false,
                  terms: false,
                });
              }}>
              <Text style={styles.text3}>{STRINGS.LOGIN}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default React.memo(Signup);
