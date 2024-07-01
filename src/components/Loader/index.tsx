import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import styles from './styles';
import {useAppSelector} from '../../redux/store';
import { COLORS } from '../../constants/commonStyles';

function Loader({children}: Readonly<{children: React.JSX.Element}>) {
  // redux
  console.log('isLoading under component')
  const isLoading = useAppSelector(state => state.user.loading);
  console.log(isLoading,'isLoading under component')
  return isLoading ? (
    <>
      {children}
      <View style={styles.loader}>
        <ActivityIndicator size={60} color={COLORS.VIOLET[100]}/>
      </View>
    </>
  ) : (
    children
  );
}

export default Loader;
