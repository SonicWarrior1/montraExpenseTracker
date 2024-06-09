import React from 'react';
import {Dimensions, SafeAreaView, ScrollView, Text, View} from 'react-native';
import styles from './styles';
import {ICONS} from '../../constants/icons';
import Sapcer from '../../components/Spacer';
import CustomButton from '../../components/CustomButton';
import {ForgotSentScreenProps} from '../../defs/navigation';
import { STRINGS} from '../../constants/strings';

function ForgotEmailSent({navigation, route}: ForgotSentScreenProps) {
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;
  const email = route.params.email;
  function handlePress() {
    navigation.pop();
  }
  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.flex}>
        <View style={styles.mainView}>
          <ICONS.EmailSent
            height={screenWidth * 0.7}
            width={screenWidth * 0.7}
          />
          <Text style={styles.text1}>{STRINGS.EmailOnWay}</Text>
          <Sapcer height={20} />
          <Text style={styles.text2}>
            {STRINGS.CheckYourEmail} {email} {STRINGS.InstructionResetPass}
          </Text>
          <Sapcer height={screenHeight * 0.3} />
          <CustomButton title={STRINGS.BackToLogin} onPress={handlePress} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ForgotEmailSent;
