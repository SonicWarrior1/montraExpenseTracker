import React, {useState} from 'react';
import {Dimensions, Platform, SafeAreaView, Text, View} from 'react-native';
import style from './styles';
import {NAVIGATION, STRINGS} from '../../constants/strings';
import {OnboardingScreenProps} from '../../defs/navigation';
import {COLORS} from '../../constants/commonStyles';
import {ICONS} from '../../constants/icons';
import {useAppTheme} from '../../hooks/themeHook';
import Sapcer from '../../components/Spacer';
import CustomButton from '../../components/CustomButton';
// Third party libraries
import Carousel from 'react-native-reanimated-carousel';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('window').height;
const data = [
  {
    icon: ICONS.Onboard1,
    text1: 'Gain total control of your money',
    text2: 'Become your own money manager and make every cent count',
  },
  {
    icon: ICONS.Onboard2,
    text1: 'Know where your money goes',
    text2:
      'Track your transaction easily,with categories and financial report ',
  },
  {
    icon: ICONS.Onboard3,
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
          {Platform.OS !== 'ios' && <Sapcer height={screenHeight * 0.035} />}
          <View style={{height: screenHeight * 0.66}}>
            <Carousel
              loop={false}
              width={screenWidth - 40}
              data={data}
              scrollAnimationDuration={300}
              onSnapToItem={index => {
                setIndex(index);
              }}
              renderItem={({item}) => (
                <View style={styles.carouselCtr}>
                  {item.icon({
                    height: screenWidth * 0.8,
                    width: screenWidth * 0.7,
                  })}
                  <View>
                    <Text style={styles.text1}>{item.text1}</Text>
                    <View style={{height: screenHeight * 0.025}} />
                    <Text style={styles.text2}>{item.text2}</Text>
                  </View>
                </View>
              )}
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
