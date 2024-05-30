import {Pressable, View} from 'react-native';
import {ICONS} from '../../constants/icons';
import {COLORS} from '../../constants/commonStyles';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import styles from './styles';
import TabButton from './TabButton';
import {NAVIGATION} from '../../constants/strings';
import AnimatedBtn from './animatedButton';

function CustomTab(props: Readonly<BottomTabBarProps>): React.JSX.Element {
  const deg = useSharedValue('-45deg');
  const translate1X = useSharedValue(0);
  const translate1Y = useSharedValue(0);
  const translate2X = useSharedValue(0);
  const translate2Y = useSharedValue(0);
  const translate3X = useSharedValue(0);
  const translate3Y = useSharedValue(0);
  const zIndex = useSharedValue(0);

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
      zIndex.value = 1;
    } else {
      zIndex.value = 0;
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
        isActive={props.state.index === 0}
      />
      <TabButton
        icon={ICONS.Transaction}
        onPress={() => {
          props.navigation.navigate('Transaction');
        }}
        title="Transaction"
        isActive={props.state.index === 1}
      />
      <AnimatedBtn
        icon={ICONS.Expense}
        onPress={() => {
          props.navigation.navigate(NAVIGATION.AddExpense, {
            type: 'expense',
            isEdit: false,
          });
          handleAddBtnPress();
        }}
        translateX={translate3X}
        translateY={translate3Y}
        backgrounColor={COLORS.PRIMARY.RED}
        zIndex={zIndex}
      />
      <AnimatedBtn
        icon={ICONS.Transfer}
        onPress={() => {}}
        translateX={translate2X}
        translateY={translate2Y}
        backgrounColor={COLORS.PRIMARY.BLUE}
        zIndex={zIndex}
      />
      <AnimatedBtn
        icon={ICONS.Income}
        onPress={() => {
          props.navigation.navigate(NAVIGATION.AddExpense, {
            type: 'income',
            isEdit: false,
          });
          handleAddBtnPress();
        }}
        translateX={translate1X}
        translateY={translate1Y}
        backgrounColor={COLORS.PRIMARY.GREEN}
        zIndex={zIndex}
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
          props.navigation.navigate(NAVIGATION.Budget);
        }}
        title="Budget"
        isActive={props.state.index === 2}
      />
      <TabButton
        icon={ICONS.User}
        onPress={() => {
          props.navigation.navigate('Home');
        }}
        title="Profile"
        isActive={props.state.index === 3}
      />
    </View>
  );
}
export default CustomTab;
