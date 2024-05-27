import React, {useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import styles from './styles';
import Sapcer from '../../components/Spacer';
import CustomInput from '../../components/CustomInput';
import {EmailEmptyError} from '../../constants/errors';
import CustomButton from '../../components/CustomButton';
import auth from '@react-native-firebase/auth';
import {ForgotScreenProps} from '../../defs/navigation';
import {NAVIGATION, STRINGS} from '../../constants/strings';

function ForgotPassword({navigation}: ForgotScreenProps) {
  const [email, setEmail] = useState('');
  function onChangeEmail(str: string) {
    setEmail(str);
  }
  const [form, setForm] = useState(false);
  async function handleForgot() {
    setForm(true);
    if (email !== '') {
      try {
        await auth().sendPasswordResetEmail(email);
        navigation.reset({
          index: 2,
          routes: [
            {name: NAVIGATION.ONBOARDING},
            {name: NAVIGATION.LOGIN},
            {name: NAVIGATION.FORGOTEMAILSENT, params: {email: email}},
          ],
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{
          flex: 1,
        }}>
        <View style={styles.mainView}>
          <Text style={styles.text}>{STRINGS.DontWorry}</Text>
          <Text style={styles.text}>{STRINGS.EnterEmailForReset}</Text>
          <Sapcer height={30} />
          <CustomInput
            placeholderText={STRINGS.Email}
            onChangeText={onChangeEmail}
            type="email"
            value={email}
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
