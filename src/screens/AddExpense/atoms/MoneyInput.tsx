import React from 'react';
import {Text, TextInput, View} from 'react-native';
import {EmptyZeroError} from '../../../constants/errors';
import {currencies, STRINGS} from '../../../constants/strings';
import {useAppTheme} from '../../../hooks/themeHook';
import style from '../styles';
import {AmountInputSetter} from '../../../utils/commonFuncs';
import {RFValue} from 'react-native-responsive-fontsize';

function MoneyInput({
  amount,
  setAmount,
  currency,
  formKey,
}: Readonly<{
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  currency: string;
  formKey: boolean;
}>) {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  return (
    <View
      style={[
        styles.mainView,
        {
          flex: 1,
          // height:
          //   pageType === 'transfer'
          //     ? Dimensions.get('screen').height / 2.4
          //     : Dimensions.get('screen').height / 4,
        },
      ]}>
      <Text style={styles.text1}>{STRINGS.HowMuch}</Text>
      <View style={styles.moneyCtr}>
        <Text
          style={[
            styles.text2,
            {fontSize: RFValue(64 - (amount.length > 9 ? 25 : amount.length > 7 ? 15 : 0))},
          ]}>
          {currencies[currency].symbol}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              fontSize: RFValue(
                64 - (amount.length > 9 ? 30 : amount.length > 7 ? 15 : 0),
              ),
            },
          ]}
          maxLength={12}
          numberOfLines={1}
          onPress={() => {
            if (amount === '0') {
              setAmount('');
            }
          }}
          onChangeText={str => AmountInputSetter(str, setAmount)}
          onBlur={() => {
            if (amount === '') {
              setAmount('0');
            }
          }}
          value={amount}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.amtError}>
        <EmptyZeroError
          errorText={
            (Number(amount.replace(/,/g, '')) > 0 || amount.trim() !== '.') &&
            amount.trim() === ''
              ? STRINGS.PleaseFillAnAmount
              : STRINGS.PleaseFillValidAmount
          }
          value={amount}
          formKey={formKey}
          color={COLOR.LIGHT[100]}
          size={18}
        />
      </View>
    </View>
  );
}

export default React.memo(MoneyInput);
