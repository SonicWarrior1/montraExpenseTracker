import {useBottomSheetModal} from '@gorhom/bottom-sheet';
import React from 'react';
import {Pressable, useColorScheme} from 'react-native';
import {useAppSelector} from '../../redux/store';

function SheetBackdrop() {
  const sheet = useBottomSheetModal();
  const scheme = useColorScheme();
  const theme = useAppSelector(state => state.user.currentUser?.theme);
  return (
    <Pressable
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor:
          (theme === 'device' ? scheme : theme) === 'dark'
            ? 'rgba(255,255,255,0.2)'
            : 'rgba(0,0,0,0.5)',
        position: 'absolute',
      }}
      onPress={() => {
        sheet.dismissAll();
      }}
    />
  );
}

export default SheetBackdrop;
