import {Image, View, Text, Dimensions} from 'react-native';
import {useAppTheme} from '../../../hooks/themeHook';
import style from '../styles';
import {useMemo} from 'react';
import {isTablet} from 'react-native-device-info';

const CarasoulCtr = ({
  item,
  index,
}: {
  item: {
    icon: string;
    text1: string;
    text2: string;
  };
  index: number;
}) => {
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('window').height;
  const styles = style(useAppTheme());
  const getImage = useMemo(() => {
    if (index === 0) {
      return require('../../../assets/Images/onboarding1.png');
    } else if (index == 1) {
      return require('../../../assets/Images/onboarding2.png');
    } else {
      return require('../../../assets/Images/onboarding3.png');
    }
  }, [index]);
  return (
    <View style={styles.carouselCtr}>
      <Image
        source={getImage}
        style={{
          height: screenHeight * 0.4,
          width: screenWidth * (isTablet() ? 0.77 : 0.9),
          transform: [{scale: 0.9}],
        }}
      />
      <View>
        <Text style={styles.text1}>{item.text1}</Text>
        <View style={{height: screenHeight * 0.025}} />
        <Text style={styles.text2}>{item.text2}</Text>
      </View>
    </View>
  );
};

export default CarasoulCtr;
