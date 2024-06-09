import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useAppSelector} from '../../redux/store';
import styles from './styles';

function Loader({children}: Readonly<{children: React.JSX.Element}>) {
  const isLoading = useAppSelector(state => state.user.loading);
  return isLoading ? (
    <>
      {children}
      <View style={styles.loader}>
        <ActivityIndicator />
      </View>
    </>
  ) : (
    children
  );
}

export default Loader;
