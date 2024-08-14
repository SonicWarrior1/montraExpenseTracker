import React, {useCallback, useState} from 'react';
import {Dimensions, SafeAreaView, View} from 'react-native';
import style from './styles';
import {NAVIGATION, OnboardData} from '../../constants/strings';
import {OnboardingScreenProps} from '../../defs/navigation';
import {COLORS} from '../../constants/commonStyles';
import {useAppTheme} from '../../hooks/themeHook';
import CustomButton from '../../components/CustomButton';
// Third party libraries
import Carousel from 'react-native-reanimated-carousel';
import CarasoulCtr from './atoms/CarasoulCtr';
import { STRINGS } from '../../localization';

const screenWidth = Dimensions.get('screen').width;

function Onboarding({navigation}: Readonly<OnboardingScreenProps>) {
  // constants
  const styles = style(useAppTheme());
  // state
  const [index, setIndex] = useState<number>(0);
  // functions
  const handleSignup = useCallback(function handleSignup() {
    navigation.navigate(NAVIGATION.SIGNUP);
  }, []);
  const handleLogin = useCallback(function handleLogin() {
    navigation.navigate(NAVIGATION.LOGIN);
  }, []);

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.mainView}>
        <View>
          <View style={styles.carasoul}>
            <Carousel
              loop={false}
              width={screenWidth - 40}
              data={OnboardData}
              scrollAnimationDuration={300}
              onSnapToItem={index => {
                setIndex(index);
              }}
              renderItem={CarasoulCtr}
            />
          </View>
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
        <View style={styles.btnView}>
          <CustomButton title={STRINGS.SIGNUP} onPress={handleSignup} />
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

export default React.memo(Onboarding);
