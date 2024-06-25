import React from 'react';
import {Dimensions, Platform, Pressable, Text, View} from 'react-native';
import {ICONS} from '../../constants/icons';
import {useAppTheme} from '../../hooks/themeHook';
import {RootStackParamList} from '../../defs/navigation';
import {StackNavigationProp} from '@react-navigation/stack';
function CustomHeader({
  backgroundColor,
  title,
  HeaderRight = () => <View style={{width: 25}}></View>,
  navigation,
  color,
  bottomBorder,
  onPress = () => {
    navigation.goBack();
  },
}: Readonly<{
  backgroundColor: string;
  title: string;
  HeaderRight?: () => React.JSX.Element;
  navigation: StackNavigationProp<
    RootStackParamList,
    | 'Signup'
    | 'Login'
    | 'ForgotPassword'
    | 'AddExpense'
    | 'TransactionDetail'
    | 'CreateBudget'
    | 'DetailBudget'
    | 'FinancialReport'
    | 'Settings'
    | 'Currency'
    | 'ExportData'
    | 'Theme'
  >;
  color?: string;
  bottomBorder?: boolean;
  onPress?: () => void;
}>) {
  const COLOR = useAppTheme();
  return (
    <View
      style={{
        width: Dimensions.get('screen').width,
        paddingTop: Platform.OS === 'ios' ? 10 : 20,
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: backgroundColor,
        flexDirection: 'row',
        borderBottomWidth: bottomBorder ? 1 : 0,
        borderColor: COLOR.LIGHT[40],
        paddingBottom: bottomBorder ? 15 : 0,
      }}>
      <Pressable onPress={onPress}>
        {ICONS.ArrowLeft({
          height: 25,
          width: 25,
          color: color ?? COLOR.LIGHT[100],
          borderColor: color ?? COLOR.LIGHT[100],
        })}
      </Pressable>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          color: color ?? COLOR.LIGHT[100],
        }}>
        {title}
      </Text>
      <HeaderRight />
    </View>
  );
}

export default React.memo(CustomHeader);
