import React from 'react';
import {ActivityIndicator, View} from 'react-native';

function Loader({children}: Readonly<{children: React.JSX.Element}>) {
  return false ? (
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
