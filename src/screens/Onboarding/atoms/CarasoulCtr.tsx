import {Image, View, Text, Dimensions} from 'react-native';
import {useAppTheme} from '../../../hooks/themeHook';
import style from '../styles';
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
  return (
    <View style={styles.carouselCtr}>
      <Image
        source={
          index === 0
            ? require('../../../assets/Images/onboarding1.png')
            : index == 1
            ? require('../../../assets/Images/onboarding2.png')
            : require('../../../assets/Images/onboarding3.png')
        }
        style={{
          height: screenHeight * 0.4,
          width: screenWidth * 0.9,
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

export default CarasoulCtr