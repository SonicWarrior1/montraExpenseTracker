import {Pressable, View} from 'react-native';
import {iconProps, ICONS} from '../../constants/icons';
import {COLORS} from '../../constants/commonStyles';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import Animated, {
  SharedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import styles from './styles';
import TabButton from './TabButton';
import {NAVIGATION} from '../../constants/strings';

function CustomTab(props: Readonly<BottomTabBarProps>): React.JSX.Element {
  const deg = useSharedValue('-45deg');
  const translate1X = useSharedValue(0);
  const translate1Y = useSharedValue(0);
  const translate2X = useSharedValue(0);
  const translate2Y = useSharedValue(0);
  const translate3X = useSharedValue(0);
  const translate3Y = useSharedValue(0);

  function handleAddBtnPress() {
    if (deg.value === '-45deg') {
      translate1X.value = withTiming(-80);
      translate1Y.value = withTiming(-80);
      translate2X.value = withSequence(withTiming(-80), withTiming(0));
      translate2Y.value = withSequence(withTiming(-80), withTiming(-120));
      translate3X.value = withSequence(
        withTiming(-80),
        withTiming(0),
        withTiming(80),
      );
      translate3Y.value = withSequence(
        withTiming(-80),
        withTiming(-120),
        withTiming(-80),
      );
      deg.value = withTiming('0deg');
    } else {
      translate3X.value = withSequence(
        withTiming(0),
        withTiming(-80),
        withTiming(0),
      );
      translate3Y.value = withSequence(
        withTiming(-120),
        withTiming(-80),
        withTiming(0),
      );
      translate2Y.value = withSequence(withTiming(-80), withTiming(0));
      translate2X.value = withSequence(withTiming(-80), withTiming(0));
      translate1Y.value = withTiming(0);
      translate1X.value = withTiming(0);
      deg.value = withTiming('-45deg');
    }
  }
  return (
    <View style={styles.tabCtr}>
      <TabButton
        icon={ICONS.Home}
        onPress={() => {
          props.navigation.navigate('Home');
        }}
        title="Home"
      />
      <TabButton
        icon={ICONS.Transaction}
        onPress={() => {
          props.navigation.navigate('Home');
        }}
        title="Transaction"
      />
      <AnimatedBtn
        icon={ICONS.Expense}
        onPress={() => {
          props.navigation.navigate(NAVIGATION.AddExpense);
        }}
        translateX={translate3X}
        translateY={translate3Y}
        backgrounColor={COLORS.PRIMARY.RED}
      />
      <AnimatedBtn
        icon={ICONS.Transfer}
        onPress={() => {}}
        translateX={translate2X}
        translateY={translate2Y}
        backgrounColor={COLORS.PRIMARY.BLUE}
      />
      <AnimatedBtn
        icon={ICONS.Income}
        onPress={() => {}}
        translateX={translate1X}
        translateY={translate1Y}
        backgrounColor={COLORS.PRIMARY.GREEN}
      />
      <Animated.View
        style={[
          styles.animatedBtnOuter,
          {transform: [{translateY: -15}, {rotateZ: deg}]},
        ]}>
        <Pressable style={styles.animatedBtn} onPress={handleAddBtnPress}>
          {ICONS.Close({height: 40, width: 40})}
        </Pressable>
      </Animated.View>
      <TabButton
        icon={ICONS.Pie}
        onPress={() => {
          props.navigation.navigate('Home');
        }}
        title="Budget"
      />
      <TabButton
        icon={ICONS.User}
        onPress={() => {
          props.navigation.navigate('Home');
        }}
        title="Profile"
      />
    </View>
  );
}
export default CustomTab;

function AnimatedBtn({
  translateX,
  translateY,
  icon,
  onPress,
  backgrounColor,
}: Readonly<{
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
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
          zIndex: 0,
          transform: [{translateY: -15}, {translateX}, {translateY}],
        },
      ]}>
      <Pressable
        style={[styles.animatedBtn, {backgroundColor: backgrounColor}]}
        onPress={onPress}>
        {icon({height: 30, width: 30})}
      </Pressable>
    </Animated.View>
  );
}
