import {View, SafeAreaView} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../components/CustomHeader';
import {NAVIGATION, passRegex, STRINGS} from '../../constants/strings';
import CustomPassInput from '../../components/CustomPassInput';
import {
  ConfirmPassError,
  PassValidationError,
  testInput,
} from '../../constants/errors';
import Spacer from '../../components/Spacer';
import CustomButton from '../../components/CustomButton';
import {useAppTheme} from '../../hooks/themeHook';
import style from './styles';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {setLoading, userLoggedIn} from '../../redux/reducers/userSlice';
import {FirebaseAuthErrorHandler} from '../../utils/firebase';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import {ResetPasswordScreenProps} from '../../defs/navigation';

function ResetPassword({route, navigation}: ResetPasswordScreenProps) {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const oobCode = route.params.oobCode;
  const mode = route.params.mode;
  const [pass, setPass] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');
  const [form, setForm] = useState<{
    pass: boolean;
    confirmPass: boolean;
  }>({
    pass: false,
    confirmPass: false,
  });
  function onChangePass(str: string) {
    setPass(str);
  }
  function onChangeConfirmPass(str: string) {
    setConfirmPass(str);
  }
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.currentUser);
  const handlePress = useCallback(async () => {
    setForm({pass: true, confirmPass: true});
    if (
      pass.trim() !== '' &&
      testInput(passRegex, pass) &&
      pass === confirmPass
    ) {
      dispatch(setLoading(true));
      try {
        await auth().confirmPasswordReset(oobCode!, confirmPass);
        dispatch(userLoggedIn(undefined));
        setTimeout(() => {
          navigation.reset({
            index: 1,
            routes: [{name: NAVIGATION.ONBOARDING}, {name: NAVIGATION.LOGIN}],
          });
        }, 250);
        Toast.show({text1: STRINGS.PasswordResetSucessful, type: 'success'});
      } catch (e) {
        const error: FirebaseAuthTypes.NativeFirebaseAuthError =
          e as FirebaseAuthTypes.NativeFirebaseAuthError;
        Toast.show({text1: FirebaseAuthErrorHandler(error.code)});
      } finally {
        dispatch(setLoading(false));
      }
    }
  }, [confirmPass, oobCode, pass]);
  useEffect(() => {
    (async () => {
      dispatch(setLoading(true));
      if (oobCode === null || mode !== 'resetPassword') {
        navigation.navigate(user ? NAVIGATION.LOGIN : NAVIGATION.BottomTab);
      } else {
        try {
          await auth().verifyPasswordResetCode(oobCode ?? '');
        } catch (e) {
          // console.log(e);
          navigation.replace(user ? NAVIGATION.LOGIN : NAVIGATION.BottomTab);
          Toast.show({text1: 'Link Expired/Already Used', type: 'error'});
        } finally {
          dispatch(setLoading(false));
        }
      }
      dispatch(setLoading(false));
    })();
  }, [mode, oobCode]);
  return (
    <SafeAreaView style={styles.safeView}>
      <KeyboardAwareScrollView
        style={{flex: 1}}
        keyboardShouldPersistTaps="handled">
        <CustomHeader
          backgroundColor={COLOR.LIGHT[100]}
          title={STRINGS.ResetPassword}
          color={COLOR.DARK[100]}
          navigation={navigation}
        />
        <View style={styles.mainView}>
          <CustomPassInput
            onChangeText={onChangePass}
            placeholderText={STRINGS.NewPassword}
            value={pass}
            inputColor={COLOR.DARK[100]}
            onBlur={() => {
              if (pass === '') {
                setForm(formkey => ({...formkey, pass: true}));
              }
            }}
          />
          <PassValidationError pass={pass} formKey={form.pass} />
          <CustomPassInput
            onChangeText={onChangeConfirmPass}
            placeholderText={STRINGS.RetypeNewPassword}
            value={confirmPass}
            inputColor={COLOR.DARK[100]}
            onBlur={() => {
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

          <Spacer height={30} />
          <CustomButton title={STRINGS.ResetPassword} onPress={handlePress} />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
export default React.memo(ResetPassword);
