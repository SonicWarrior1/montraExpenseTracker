import {Pressable, useColorScheme, View} from 'react-native';
import {ICONS} from '../../constants/icons';
import {COLORS} from '../../constants/commonStyles';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import style from './styles';
import TabButton from './atoms/TabButton';
import {NAVIGATION, STRINGS} from '../../constants/strings';
import AnimatedBtn from './atoms/animatedButton';
import {useAppTheme} from '../../hooks/themeHook';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {useEffect} from 'react';
import {setTabButton} from '../../redux/reducers/transactionSlice';

function CustomTab(props: Readonly<BottomTabBarProps>): React.JSX.Element {
  const deg = useSharedValue('-45deg');
  const translate1X = useSharedValue(0);
  const translate1Y = useSharedValue(0);
  const translate2X = useSharedValue(0);
  const translate2Y = useSharedValue(0);
  const translate3X = useSharedValue(0);
  const translate3Y = useSharedValue(0);
  const zIndex = useSharedValue(0);
  function handleClose() {
    zIndex.value = 0;
    translate3X.value = withSequence(
      withTiming(0, {duration: 200}),
      withTiming(-80, {duration: 200}),
      withTiming(0, {duration: 200}),
    );
    translate3Y.value = withSequence(
      withTiming(-120, {duration: 200}),
      withTiming(-80, {duration: 200}),
      withTiming(0, {duration: 200}),
    );
    translate2Y.value = withSequence(
      withTiming(-80, {duration: 200}),
      withTiming(0, {duration: 200}),
    );
    translate2X.value = withSequence(
      withTiming(-80, {duration: 200}),
      withTiming(0, {duration: 200}),
    );
    translate1Y.value = withTiming(0, {duration: 200});
    translate1X.value = withTiming(0, {duration: 200});
    deg.value = withTiming('-45deg', {duration: 200});
  }
  function handleOpen() {
    translate1X.value = withTiming(-80, {duration: 200});
    translate1Y.value = withTiming(-80, {duration: 200});
    translate2X.value = withSequence(
      withTiming(-80, {duration: 200}),
      withTiming(0, {duration: 200}),
    );
    translate2Y.value = withSequence(
      withTiming(-80, {duration: 200}),
      withTiming(-120, {duration: 200}),
    );
    translate3X.value = withSequence(
      withTiming(-80, {duration: 200}),
      withTiming(0, {duration: 200}),
      withTiming(80, {duration: 200}),
    );
    translate3Y.value = withSequence(
      withTiming(-80, {duration: 200}),
      withTiming(-120, {duration: 200}),
      withTiming(-80, {duration: 200}),
    );
    deg.value = withTiming('0deg', {duration: 200});
    zIndex.value = 1;
  }
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const scheme = useColorScheme();
  const theme = useAppSelector(state => state.user.currentUser?.theme);
  const isOpen = useAppSelector(state => state.transaction.isTabButtonOpen);
  console.log(isOpen);
  const finalTheme = theme === 'device' ? scheme : theme;
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isOpen) {
      handleOpen();
    } else if (!isOpen && deg.value === '0deg') {
      handleClose();
    }
  }, [isOpen]);
  return (
    <View style={styles.tabCtr}>
      <TabButton
        icon={ICONS.Home}
        onPress={() => {
          props.navigation.navigate(NAVIGATION.Home);
          dispatch(setTabButton(false));
        }}
        title={STRINGS.Home}
        isActive={props.state.index === 0}
      />
      <TabButton
        icon={ICONS.Transaction}
        onPress={() => {
          props.navigation.navigate(NAVIGATION.Transaction);
          dispatch(setTabButton(false));
        }}
        title={STRINGS.Transaction}
        isActive={props.state.index === 1}
      />
      <AnimatedBtn
        icon={ICONS.Expense}
        onPress={() => {
          props.navigation.navigate(NAVIGATION.AddExpense, {
            type: 'expense',
            isEdit: false,
          });
          dispatch(setTabButton(false));
        }}
        translateX={translate3X}
        translateY={translate3Y}
        backgrounColor={COLORS.PRIMARY.RED}
        zIndex={zIndex}
      />
      <AnimatedBtn
        icon={ICONS.Transfer}
        onPress={() => {
          props.navigation.navigate(NAVIGATION.AddExpense, {
            type: 'transfer',
            isEdit: false,
          });
          dispatch(setTabButton(false));
        }}
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
          dispatch(setTabButton(false));
        }}
        translateX={translate1X}
        translateY={translate1Y}
        backgrounColor={COLORS.PRIMARY.GREEN}
        zIndex={zIndex}
      />
      <Animated.View
        style={[
          styles.animatedBtnOuter,
          {
            transform: [{translateY: -15}, {rotateZ: deg}],
            backgroundColor:
              finalTheme === 'dark'
                ? isOpen
                  ? '#c0afe1'
                  : COLOR.LIGHT[40]
                : isOpen
                ? '#ddccff'
                : props.state.index === 2 || props.state.index === 3
                ? COLOR.LIGHT[40]
                : COLOR.LIGHT[100],
          },
        ]}>
        <Pressable
          style={styles.animatedBtn}
          onPress={() => {
            if (!isOpen) {
              dispatch(setTabButton(true));
            } else {
              dispatch(setTabButton(false));
            }
          }}>
          {ICONS.Close({height: 40, width: 40})}
        </Pressable>
      </Animated.View>
      <TabButton
        icon={ICONS.Pie}
        onPress={() => {
          props.navigation.navigate(NAVIGATION.Budget);
          dispatch(setTabButton(false));
        }}
        title={STRINGS.Budget}
        isActive={props.state.index === 2}
      />
      <TabButton
        icon={ICONS.User}
        onPress={() => {
          props.navigation.navigate(NAVIGATION.Profile);
          dispatch(setTabButton(false));
        }}
        title={STRINGS.Profile}
        isActive={props.state.index === 3}
      />
    </View>
  );
}
export default CustomTab;
