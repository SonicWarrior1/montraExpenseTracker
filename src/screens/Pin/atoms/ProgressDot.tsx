import React from 'react';
import styles from '../styles';
import {View} from 'react-native';
import {COLORS} from '../../../constants/commonStyles';

function ProgressDot({i, pin}: Readonly<{i: number; pin: number[]}>) {
    console.log("djbjk")
  return (
    <View
      key={i}
      style={[
        styles.progressDot,
        {
          backgroundColor: pin.length > i ? 'white' : COLORS.VIOLET[100],
          borderWidth: pin.length > i ? 0 : 4,
          opacity: pin.length > i ? 1 : 0.4,
        },
      ]}
    />
  );
}

export default React.memo(ProgressDot);
