import {useBottomSheetModal} from '@gorhom/bottom-sheet';
import React from 'react';
import {Pressable} from 'react-native';

function SheetBackdrop() {
  const sheet = useBottomSheetModal();
  return (
    <Pressable
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
      }}
      onPress={() => {
        sheet.dismissAll();
      }}
    />
  );
}

export default SheetBackdrop;
