import React from 'react';
import {SafeAreaView} from 'react-native';
import Pdf from 'react-native-pdf';
import {DocScreenProps} from '../../defs/navigation';
import styles from './styles';

function DocView({route}: DocScreenProps) {
  const uri = route.params.uri;
  return (
    <SafeAreaView style={styles.flex}>
      <Pdf source={{uri}} style={styles.docView} />
    </SafeAreaView>
  );
}

export default DocView;
