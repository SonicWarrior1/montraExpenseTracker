import React from 'react';
import {View} from 'react-native';

function Spacer({height, width}: Readonly<{height?: number; width?: number}>) {
  return <View style={{height, width}}></View>;
}

export default React.memo(Spacer);
