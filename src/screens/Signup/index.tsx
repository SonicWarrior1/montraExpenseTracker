import React, {useState} from 'react';
import {
  ActivityIndicator,
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
  passRegex,
  STRINGS,
} from '../../constants/strings';
import {COLORS} from '../../constants/commonStyles';
import {ICONS} from '../../constants/icons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {User} from '../../defs/user.ts';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
function Signup() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setconfirmPass] = useState('');
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
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
        setLoading(true);
        const creds = await auth().createUserWithEmailAndPassword(email, pass);
        if (creds) {
          await firestore()
            .collection('users')
            .doc(creds.user.uid)
            .set(User({name: name, email: email, uid: creds.user.uid}));
        }
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
  }
//   async function onGoogleButtonPress() {
//     try {
//       // Check if your device supports Google Play
//       await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
//       // Get the users ID token
//       const {idToken} = await GoogleSignin.signIn();

//       // Create a Google credential with the token
//       const googleCredential = auth.GoogleAuthProvider.credential(idToken);

//       // Sign-in the user with the credential
//       const creds = await auth().signInWithCredential(googleCredential);
//       //   if (creds) {
//       //     const res = await firestore()
//       //       .collection('users')
//       //       .doc(creds.user.uid)
//       //       .get();
//       //     if (!res.exists) {
//       //     //   const user: User = {
//       //     //     firstName: creds.user.displayName?.split(' ')[0]!,
//       //     //     lastName: creds.user.displayName?.split(' ')[1]!,
//       //     //     email: creds.user.email!,
//       //     //     phone: creds.user.phoneNumber ?? '1234567890',
//       //     //     uid: creds.user.uid,
//       //     //     image: creds.user.photoURL!,
//       //     //     dob: Timestamp.now(),
//       //     //   };
//       //       await firestore().collection('users').doc(creds.user.uid).set(user);
//       //     //   dispatch(
//       //     //     setCurrentUser({
//       //     //       ...user,
//       //     //       dob: (user.dob as Timestamp)?.toDate().toLocaleDateString(),
//       //     //     }),
//       //     //   );
//       //     } else {
//       //       const data = await firestore()
//       //         .collection('users')
//       //         .doc(creds.user.uid)
//       //         .get();
//       //       const user = data.data();
//       //     //   if (user) {
//       //     //     dispatch(
//       //     //       setCurrentUser({
//       //     //         ...user,
//       //     //         dob: user.dob?.toDate().toLocaleDateString(),
//       //     //       }),
//       //     //     );
//       //     //   }
//       //     }
//       //   }
//     } catch (e) {
//       console.log(e);
//     }
//   }
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
            placeholderText="Name"
            onChangeText={onChangeName}
            type="name"
            value={name}
          />
          <NameValError name={name} formKey={form} />
          <CustomInput
            placeholderText="Email"
            onChangeText={onChangeEmail}
            type="email"
            value={email}
          />
          <EmailValError email={email} formKey={form} />
          <CustomPassInput
            onChangeText={onChangePass}
            placeholderText="Password"
            value={pass}
          />
          <PassValidationError pass={pass} formKey={form} />
          <CustomPassInput
            onChangeText={onChangeConfirmPass}
            placeholderText="Confirm Password"
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
            //   ref={ref}
            isChecked={checked}
            textComponent={
              <View style={{flex: 1, marginLeft: 16}}>
                <Text style={{}}>
                  By signing up, you agree to the{' '}
                  <Text style={{color: COLORS.PRIMARY.VIOLET}}>
                    Terms of Service and Privacy Policy
                  </Text>
                </Text>
              </View>
            }
            disableText={false}
          />
          <Sapcer height={20} />
          {loading ? (
            <ActivityIndicator size={30} />
          ) : (
            <CustomButton title={STRINGS.SIGNUP} onPress={handleSignup} />
          )}
          <Sapcer height={10} />
          <Text style={styles.orText}>Or With</Text>
          <Sapcer height={10} />
          <TouchableOpacity onPress={()=>{}} style={[styles.btn]}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
              {ICONS.Google({height: 25, width: 25})}
              <Text style={[styles.text]}>Sign Up with Google</Text>
            </View>
          </TouchableOpacity>
          <Sapcer height={10} />
          <Text style={{color: COLORS.DARK[25]}}>
            Already have an Account?{' '}
            <Text
              style={{
                color: COLORS.PRIMARY.VIOLET,
                textDecorationLine: 'underline',
              }}>
              Login
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Signup;
