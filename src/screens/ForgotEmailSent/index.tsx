import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import style from './styles';
import Spacer from '../../components/Spacer';
import CustomButton from '../../components/CustomButton';
import {ForgotSentScreenProps} from '../../defs/navigation';
import {useAppTheme} from '../../hooks/themeHook';
import { STRINGS } from '../../localization';

function ForgotEmailSent({navigation, route}: Readonly<ForgotSentScreenProps>) {
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;
  const email = route.params.email;
  function handlePress() {
    navigation.pop();
  }
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.flex}>
        <View style={styles.mainView}>
          <Image
            source={require('../../assets/Images/EmailSent.png')}
            style={{height: screenWidth * 0.8, width: screenWidth * 0.8}}
          />
          <Spacer height={15} />
          <Text style={styles.text1}>{STRINGS.EmailOnWay}</Text>
          <Spacer height={20} />
          <Text style={styles.text2}>
            {STRINGS.CheckYourEmail} {email} {STRINGS.InstructionResetPass}
          </Text>
          <Spacer height={screenHeight * 0.2} />
          <CustomButton title={STRINGS.BackToLogin} onPress={handlePress} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default React.memo(ForgotEmailSent);
