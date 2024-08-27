import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {ICONS} from '../../constants/icons';
import {useAppTheme} from '../../hooks/themeHook';
import {RootStackParamList} from '../../defs/navigation';
import {StackNavigationProp} from '@react-navigation/stack';
import style from './styles';
function CustomHeader({
  backgroundColor,
  title,
  HeaderRight = () => <View style={{width: 25}} />,
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
    | 'ResetPassword'
    | 'Language'
  >;
  color?: string;
  bottomBorder?: boolean;
  onPress?: () => void;
}>) {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  return (
    <View
      style={[
        styles.view,
        {
          backgroundColor: backgroundColor,
          borderBottomWidth: bottomBorder ? 1 : 0,
          paddingBottom: bottomBorder ? 15 : 0,
        },
      ]}>
      <Pressable onPress={onPress}>
        {ICONS.ArrowLeft({
          height: 25,
          width: 25,
          color: color ?? COLOR.LIGHT[100],
          borderColor: color ?? COLOR.LIGHT[100],
        })}
      </Pressable>
      <Text
        style={[
          styles.text,
          {
            color: color ?? COLOR.LIGHT[100],
          },
        ]}>
        {title}
      </Text>
      <HeaderRight />
    </View>
  );
}

export default React.memo(CustomHeader);
