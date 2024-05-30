import Animated, { SharedValue } from "react-native-reanimated";
import { iconProps } from "../../constants/icons";
import styles from "./styles";
import { Pressable } from "react-native";

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
          {icon({height: 30, width: 30, color: 'green'})}
        </Pressable>
      </Animated.View>
    );
  }

  export default AnimatedBtn