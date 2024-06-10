import Animated, { SharedValue } from 'react-native-reanimated';
import { iconProps } from '../../../constants/icons';
import style from '../styles';
import { Pressable } from 'react-native';
import { COLORS } from '../../../constants/commonStyles';
import { useAppTheme } from '../../../hooks/themeHook';

function AnimatedBtn({
    translateX,
    translateY,
    icon,
    onPress,
    backgrounColor,
    zIndex,
  }: Readonly<{
    translateX: SharedValue<number>;
    translateY: SharedValue<number>;
    zIndex: SharedValue<number>;
    icon: (params: iconProps) => React.ReactNode;
    onPress: () => void;
    backgrounColor: string;
  }>) {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
    return (
      <Animated.View
        style={[
          styles.animatedBtnOuter,
          {
            position: 'absolute',
            marginLeft: '39%',
            zIndex: zIndex,
            transform: [{translateY: -15}, {translateX}, {translateY}],
          },
        ]}>
        <Pressable
          style={[styles.animatedBtn, {backgroundColor: backgrounColor}]}
          onPress={onPress}>
          {icon({height: 30, width: 30, color: COLORS.LIGHT[100]})}
        </Pressable>
      </Animated.View>
    );
  }

  export default AnimatedBtn;
