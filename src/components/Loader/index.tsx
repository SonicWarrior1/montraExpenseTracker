import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import { useAppSelector } from '../../redux/store';

function Loader({children}: Readonly<{children: React.JSX.Element}>) {
  const isLoading=useAppSelector(state=>state.user.loading);
  return isLoading ? (
    <>
      {children}
      <View
        style={{
          position: 'absolute',
          flex: 1,
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <ActivityIndicator/>
      </View>
    </>
  ) : (
    children
  );
}

export default Loader;
