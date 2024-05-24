import React from 'react';
import {View} from 'react-native';

function Sapcer({height, width}: Readonly<{height?: number; width?: number}>) {
  return <View style={{height, width}}></View>;
}

export default Sapcer;
