import React, {useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import style from './styles';
import Sapcer from '../../components/Spacer';
import CustomInput from '../../components/CustomInput';
import {EmailEmptyError} from '../../constants/errors';
import CustomButton from '../../components/CustomButton';
import {ForgotScreenProps} from '../../defs/navigation';
import {NAVIGATION, STRINGS} from '../../constants/strings';
import {useAppTheme} from '../../hooks/themeHook';
// Third Party Libraries
import auth from '@react-native-firebase/auth';
import {useAppDispatch} from '../../redux/store';
import {setLoading} from '../../redux/reducers/userSlice';

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
  async function handleForgot() {
    setForm(true);
    if (email !== '') {
      try {
        dispatch(setLoading(true));
        await auth().sendPasswordResetEmail(email);
        navigation.reset({
          index: 2,
          routes: [
            {name: NAVIGATION.ONBOARDING},
            {name: NAVIGATION.LOGIN},
            {name: NAVIGATION.FORGOTEMAILSENT, params: {email: email}},
          ],
        });
        dispatch(setLoading(false));
      } catch (e) {
        console.log(e);
        dispatch(setLoading(false));
      }
    }
  }

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.flex}>
        <View style={styles.mainView}>
          <Text style={styles.text}>{STRINGS.DontWorry}</Text>
          <Text style={styles.text}>{STRINGS.EnterEmailForReset}</Text>
          <Sapcer height={30} />
          <CustomInput
            placeholderText={STRINGS.Email}
            onChangeText={onChangeEmail}
            type="email"
            value={email}
            inputColor={COLOR.DARK[100]}
          />
          <EmailEmptyError email={email} formKey={form} />
          <Sapcer height={20} />
          <CustomButton onPress={handleForgot} title={STRINGS.Continue} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ForgotPassword;
