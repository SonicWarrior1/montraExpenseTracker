import {Text, View} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import {currencies} from '../../constants/strings';
import {useAppSelector} from '../../redux/store';

const LinegraphLabel = ({items}: {items: {date: string; value: number}[]}) => {
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const {conversion} = useAppSelector(
    state => state.transaction,
  );
  return (
    <View
      style={{
        width: 100,
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: 'black',
          fontSize: 14,
          marginBottom: 6,
          textAlign: 'center',
        }}>
        {items[0].date}
      </Text>
      <View
        style={{
          paddingHorizontal: 14,
          paddingVertical: 6,
          borderRadius: 16,
          backgroundColor: COLORS.VIOLET[20],
        }}>
        <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
          {currencies[currency!].symbol}{' '}
          {(
            conversion['usd']?.[currency!.toLowerCase()] *
            Number(items[0].value)
          )
            .toFixed(1)
            .toString()}
        </Text>
      </View>
    </View>
  );
};

export default LinegraphLabel;
