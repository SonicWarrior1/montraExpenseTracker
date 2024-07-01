import {Text, View} from 'react-native';
import style from './styles';
import {currencies} from '../../constants/strings';
import { COLORS } from '../../constants/commonStyles';

function LinegraphLabel({
  items,
  currency,
  conversion,
  COLOR
}: Readonly<{
  items: {date: string; value: number}[];
  currency: string | undefined;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  COLOR:typeof COLORS
}>) {

  const styles = style(COLOR);
  return (
    <View style={styles.ctr}>
      <Text style={styles.text1}>{items[0].date}</Text>
      <View style={styles.amtCtr}>
        <Text style={styles.amt} numberOfLines={1}>
          {currencies[currency!].symbol}{' '}
          {(conversion.usd?.[currency!.toLowerCase()] * Number(items[0].value))
            .toFixed(1)
            .toString()}
        </Text>
      </View>
    </View>
  );
}

export default LinegraphLabel;
