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
import Sapcer from '../../components/Spacer';
import {
  ConfirmPassError,
  EmailValError,
  NameValError,
  PassValidationError,
  testInput,
} from '../../constants/errors';
import CustomPassInput from '../../components/CustomPassInput';
import BouncyCheckbox from 'react-native-bouncy-checkbox/build/dist/BouncyCheckbox';
import CustomButton from '../../components/CustomButton';
import {
  emailRegex,
  nameRegex,
  NAVIGATION,
  passRegex,
  STRINGS,
} from '../../constants/strings';
import {COLORS} from '../../constants/commonStyles';
import {ICONS} from '../../constants/icons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {SignupScreenProps} from '../../defs/navigation';
import {setLoading, userLoggedIn} from '../../redux/reducers/userSlice.ts';
import {useAppDispatch} from '../../redux/store/index.ts';
import Toast from 'react-native-toast-message';
import {UserFromJson, UserToJson} from '../../utils/userFuncs.ts';
import {singupUser} from '../../utils/firebase.ts';
function Signup({navigation}: Readonly<SignupScreenProps>) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setconfirmPass] = useState('');
  const [checked, setChecked] = useState(false);

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
    setconfirmPass(str);
  }
  const dispatch = useAppDispatch();

  async function handleSignup() {
    setForm(true);
    if (
      name !== '' &&
      testInput(nameRegex, name) &&
      email !== '' &&
      testInput(emailRegex, email) &&
      testInput(passRegex, pass) &&
      pass === confirmPass &&
      checked
    ) {
      try {
        dispatch(setLoading(true));
        const res = await singupUser({name: name, email: email, pass: pass});
        if (res) {
          Toast.show({text1: STRINGS.SignupSuccesful});
          navigation.replace(NAVIGATION.LOGIN);
        }
        dispatch(setLoading(false));
      } catch (e) {
        console.log(e);
        dispatch(setLoading(false));
      }
    }
  }
  async function onGoogleButtonPress() {
    try {
      dispatch(setLoading(true));
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const creds = await auth().signInWithCredential(googleCredential);
      if (creds) {
        const res = await firestore()
          .collection('users')
          .doc(creds.user.uid)
          .get();
        if (!res.exists) {
          const user = await UserToJson({
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
          const user = await UserFromJson(data.data()!);
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
  const [form, setForm] = useState(false);
  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{
          flex: 1,
        }}>
        <View style={styles.mainView}>
          <CustomInput
            placeholderText={STRINGS.Name}
            onChangeText={onChangeName}
            type="name"
            value={name}
          />
          <NameValError name={name} formKey={form} />
          <CustomInput
            placeholderText={STRINGS.Email}
            onChangeText={onChangeEmail}
            type="email"
            value={email}
          />
          <EmailValError email={email} formKey={form} />
          <CustomPassInput
            onChangeText={onChangePass}
            placeholderText={STRINGS.Password}
            value={pass}
          />
          <PassValidationError pass={pass} formKey={form} />
          <CustomPassInput
            onChangeText={onChangeConfirmPass}
            placeholderText={STRINGS.ConfrimPassword}
            value={confirmPass}
          />
          <ConfirmPassError
            pass={pass}
            confirmPass={confirmPass}
            formKey={form}
          />
          <Sapcer height={10} />
          <BouncyCheckbox
            size={25}
            fillColor={
              !checked && form ? COLORS.RED[100] : COLORS.PRIMARY.VIOLET
            }
            unFillColor="#FFFFFF"
            iconStyle={{borderRadius: 5}}
            innerIconStyle={{borderWidth: 2, borderRadius: 5}}
            onPress={(isChecked: boolean) => {
              setChecked(isChecked);
            }}
            isChecked={checked}
            textComponent={
              <View style={{flex: 1, marginLeft: 16}}>
                <Text style={{}}>
                  {STRINGS.BySigningUp}{' '}
                  <Text style={{color: COLORS.PRIMARY.VIOLET}}>
                    {STRINGS.Terms}
                  </Text>
                </Text>
              </View>
            }
            disableText={false}
          />
          <Sapcer height={20} />
          <CustomButton title={STRINGS.SIGNUP} onPress={handleSignup} />
          <Sapcer height={10} />
          <Text style={styles.orText}>{STRINGS.OrWith}</Text>
          <Sapcer height={10} />
          <TouchableOpacity onPress={onGoogleButtonPress} style={[styles.btn]}>
            <View style={styles.googleBtn}>
              {ICONS.Google({height: 25, width: 25})}
              <Text style={styles.text}>{STRINGS.SignupWithGoogle}</Text>
            </View>
          </TouchableOpacity>
          <Sapcer height={10} />
          <Text style={{color: COLORS.DARK[25]}}>
            {STRINGS.AlreadyHaveAccount}{' '}
            <Pressable
              onPress={() => {
                navigation.navigate(NAVIGATION.LOGIN);
              }}>
              <Text
                style={{
                  color: COLORS.PRIMARY.VIOLET,
                  textDecorationLine: 'underline',
                }}>
                {STRINGS.LOGIN}
              </Text>
            </Pressable>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Signup;
