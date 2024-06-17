import React, {useState} from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  View,
} from 'react-native';
import style from './styles';
import {NAVIGATION, STRINGS} from '../../constants/strings';
import {OnboardingScreenProps} from '../../defs/navigation';
import {COLORS} from '../../constants/commonStyles';
import {useAppTheme} from '../../hooks/themeHook';
import Sapcer from '../../components/Spacer';
import CustomButton from '../../components/CustomButton';
// Third party libraries
import Carousel from 'react-native-reanimated-carousel';
import CarasoulCtr from './atoms/CarasoulCtr';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('window').height;
const data = [
  {
    icon: '../../assets/Images/onboarding1.png',
    text1: 'Gain total control of your money',
    text2: 'Become your own money manager and make every cent count',
  },
  {
    icon: '../../assets/Images/onboarding2.png',
    text1: 'Know where your money goes',
    text2:
      'Track your transaction easily,with categories and financial report ',
  },
  {
    icon: '../../assets/Images/onboarding3.png',
    text1: 'Planning ahead',
    text2: 'Setup your budget for each category so you in control',
  },
];
function Onboarding({navigation}: Readonly<OnboardingScreenProps>) {
  // constants
  const styles = style(useAppTheme());
  // state
  const [index, setIndex] = useState(0);
  // functions
  function handleSignup() {
    navigation.navigate(NAVIGATION.SIGNUP);
  }
  function handleLogin() {
    navigation.navigate(NAVIGATION.LOGIN);
  }
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.mainView}>
        <View>
          {Platform.OS !== 'ios' ? (
            <Sapcer height={screenHeight * 0.055} />
          ) : (
            <Sapcer height={screenHeight * 0.025} />
          )}
          <View style={{height: screenHeight * 0.64}}>
            <Carousel
              loop={false}
              width={screenWidth - 40}
              data={data}
              scrollAnimationDuration={300}
              onSnapToItem={index => {
                setIndex(index);
              }}
              renderItem={CarasoulCtr}
            />
          </View>
          <Sapcer
            height={
              Platform.OS !== 'ios' ? screenHeight * 0.05 : screenHeight * 0.03
            }
          />
          <View style={styles.progressDotCtr}>
            {[0, 1, 2].map(i => {
              return (
                <View
                  key={i}
                  style={[
                    styles.progressDot,
                    {
                      height: index == i ? 16 : 8,
                      width: index == i ? 16 : 8,
                      backgroundColor:
                        index == i
                          ? COLORS.PRIMARY.VIOLET
                          : COLORS.SECONDARY.VIOLET,
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>
        <View
          style={{
            paddingBottom: screenHeight * 0.03,
            paddingTop: screenHeight * 0.03,
          }}>
          <CustomButton title={STRINGS.SIGNUP} onPress={handleSignup} />
          <Sapcer height={screenHeight * 0.015} />
          <CustomButton
            title={STRINGS.LOGIN}
            onPress={handleLogin}
            backgroundColor={COLORS.SECONDARY.VIOLET}
            textColor={COLORS.PRIMARY.VIOLET}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Onboarding;
