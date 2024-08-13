import React, {useMemo} from 'react';
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
  isEdit,
  editAmt,
}: Readonly<{
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  currency: string;
  formKey: boolean;
  isEdit: boolean;
  editAmt?: string;
}>) {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const fontSize = useMemo(() => {
    if (currencies[currency].symbol.length + amount.length > 13) {
      return RFValue(64 - 33);
    } else if (currencies[currency].symbol.length + amount.length > 10) {
      return RFValue(64 - 25);
    } else if (currencies[currency].symbol.length + amount.length > 7) {
      return RFValue(64 - 15);
    } else {
      return RFValue(64 - 0);
    }
  }, [amount, currency]);
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
            {
              fontSize: fontSize,
            },
          ]}>
          {currencies[currency].symbol}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              fontSize: fontSize,
            },
          ]}
          // maxLength={12}
          numberOfLines={1}
          onPress={() => {
            if (amount === '0') {
              setAmount('');
            }
          }}
          onChangeText={str =>
            AmountInputSetter(str, setAmount, isEdit, editAmt)
          }
          onBlur={() => {
            if (amount === '') {
              setAmount('0');
            }
          }}
          contextMenuHidden={true}
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
          value={amount.replace(/,/g, '')}
          formKey={formKey}
          color={COLOR.LIGHT[100]}
          size={18}
        />
      </View>
    </View>
  );
}

export default React.memo(MoneyInput);
