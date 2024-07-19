import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../styles';
import {ICONS} from '../../../constants/icons';
import {COLORS} from '../../../constants/commonStyles';
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [-1, 0, 99],
];
function Keypad({
  handlePin,
}: {
  handlePin: (value: number) => () => Promise<void>;
}) {
  return matrix.map((row, i) => (
    <View style={styles.flexRow} key={`row_${row[i]}`}>
      {row.map(value => {
        return (
          <TouchableOpacity
            key={`col_${value}`}
            style={styles.btn}
            onPress={handlePin(value)}>
            {value === 99 ? (
              ICONS.ArrowRight2({
                height: 43,
                width: 43,
                color: COLORS.VIOLET[100],
              })
            ) : (
              <Text style={[styles.number, {fontSize: value === -1 ? 36 : 48}]}>
                {value === -1 ? 'DEL' : value}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  ));
}

export default React.memo(Keypad);
