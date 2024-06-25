import React from 'react';
import {Text, TextInput, View} from 'react-native';
import {EmptyZeroError} from '../../../constants/errors';
import {currencies, STRINGS} from '../../../constants/strings';
import {useAppTheme} from '../../../hooks/themeHook';
import style from '../styles';
import { formatWithCommas } from '../../../utils/commonFuncs';

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
        <Text style={styles.text2}>{currencies[currency].symbol}</Text>
        <TextInput
          style={styles.input}
          maxLength={10}
          onPress={() => {
            if (amount === '0') {
              setAmount('');
            }
          }}
          onChangeText={str => {
            let numericValue = str.replace(/[^0-9.]+/g, '');
            const decimalCount = numericValue.split('.').length - 1;

            if (decimalCount > 1) {
              const parts = numericValue.split('.');
              numericValue = parts[0] + '.' + parts.slice(1).join('');
            }

            if (
              numericValue.length > 0 &&
              numericValue[numericValue.length - 1] === '.'
            ) {
              // Allow only if it is not the only character
              if (numericValue.length === 1) {
                numericValue = numericValue.slice(0, -1);
              } else if (numericValue[numericValue.length - 2] === '.') {
                // Remove last character if there are two consecutive decimal points
                numericValue = numericValue.slice(0, -1);
              }
            }

            // Limit to 1 digit after decimal point
            if (decimalCount === 1) {
              const parts = numericValue.split('.');
              if (parts[1].length > 1) {
                numericValue = parts[0] + '.' + parts[1].slice(0, 1);
              }
            }

            if (decimalCount === 1 && numericValue.length > 8) {
              numericValue = numericValue.slice(0, 8);
            } else if (decimalCount === 0 && numericValue.length > 7) {
              numericValue = numericValue.slice(0, 7);
            }

            setAmount(formatWithCommas(numericValue));
          }}
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
          errorText={STRINGS.PleaseFillAnAmount}
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
