import React from 'react';
import {SafeAreaView} from 'react-native';
import Pdf from 'react-native-pdf';
import {DocScreenProps} from '../../defs/navigation';
import styles from './styles';

function DocView({route}: Readonly<DocScreenProps>) {
  const uri = route.params.uri;
  console.log(uri);
  return (
    <SafeAreaView style={styles.flex}>
      <Pdf source={{uri: uri}} style={styles.docView} trustAllCerts={false} />
    </SafeAreaView>
  );
}

export default DocView;
