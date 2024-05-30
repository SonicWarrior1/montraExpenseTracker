import React from 'react';
import {SafeAreaView} from 'react-native';
import Pdf from 'react-native-pdf';
import {DocScreenProps} from '../../defs/navigation';

function DocView({route}: DocScreenProps) {
  const uri = route.params.uri;
  return (
    <SafeAreaView style={{flex: 1}}>
      <Pdf source={{uri}} style={{height: '100%', width: '100%'}} />
    </SafeAreaView>
  );
}

export default DocView;
