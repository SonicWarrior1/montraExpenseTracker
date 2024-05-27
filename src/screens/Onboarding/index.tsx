import React, {useState} from 'react';
import {Dimensions, SafeAreaView, Text, View} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import {ICONS} from '../../constants/icons';
import styles from './styles';
import CustomButton from '../../components/CustomButton';
import {NAVIGATION, STRINGS} from '../../constants/strings';
import {COLORS} from '../../constants/commonStyles';
import {OnboardingScreenProps} from '../../defs/navigation';
import Sapcer from '../../components/Spacer';
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const data = [
  {
    icon: (
      <ICONS.Onboard1 height={screenWidth * 0.75} width={screenWidth * 0.65} />
    ),
    text1: 'Gain total control of your money',
    text2: 'Become your own money manager and make every cent count',
  },
  {
    icon: (
      <ICONS.Onboard2 height={screenWidth * 0.75} width={screenWidth * 0.65} />
    ),
    text1: 'Know where your money goes',
    text2:
      'Track your transaction easily,with categories and financial report ',
  },
  {
    icon: (
      <ICONS.Onboard3 height={screenWidth * 0.75} width={screenWidth * 0.65} />
    ),
    text1: 'Planning ahead',
    text2: 'Setup your budget for each category so you in control',
  },
];
function Onboarding({navigation}: Readonly<OnboardingScreenProps>) {
  function handleSignup() {
    navigation.navigate(NAVIGATION.SIGNUP);
  }
  function handleLogin() {
    navigation.navigate(NAVIGATION.LOGIN);
  }
  const [index, setIndex] = useState(0);
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.mainView}>
        <Carousel
          loop={false}
          width={screenWidth - 40}
          height={screenHeight * 0.6}
          data={data}
          scrollAnimationDuration={1000}
          onSnapToItem={index => {
            setIndex(index);
          }}
          // onProgressChange={(offset, number) => {
          //   console.log(number - index);
          // }}
          renderItem={({item}) => (
            <View style={styles.carouselCtr}>
              {item.icon}
              <Text style={styles.text1}>{item.text1}</Text>
              <View style={{height: screenHeight * 0.025}}></View>
              <Text style={styles.text2}>{item.text2}</Text>
            </View>
          )}
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
                ]}></View>
            );
          })}
        </View>
        <Sapcer height={screenHeight * 0.03} />
        <CustomButton title={STRINGS.SIGNUP} onPress={handleSignup} />
        <Sapcer height={screenHeight * 0.025} />
        <CustomButton
          title={STRINGS.LOGIN}
          onPress={handleLogin}
          backgroundColor={COLORS.SECONDARY.VIOLET}
          textColor={COLORS.PRIMARY.VIOLET}
        />
        <Sapcer height={screenHeight * 0.08} />
      </View>
    </SafeAreaView>
  );
}

export default Onboarding;
