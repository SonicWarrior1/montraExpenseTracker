import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {useEffect, useMemo, useRef} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {View} from 'react-native';
import {openCatSheet} from '../../redux/reducers/transactionSlice';
import SheetBackdrop from '../SheetBackDrop';

function CategorySelectionSheet() {
  const dispatch = useAppDispatch();
  const snapPoints = useMemo(() => ['35%'], []);
  const ref = useRef<BottomSheetModal>(null);
  const isOpen = useAppSelector(state => state.transaction.isCatOpen);
  useEffect(() => {
    if (isOpen === true) {
      ref.current?.present();
    } else {
      ref.current?.close();
    }
  }, [isOpen]);
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        enablePanDownToClose
        index={0}
        snapPoints={snapPoints}
        ref={ref}
        onDismiss={() => {
          dispatch(openCatSheet(false));
        }}
        backdropComponent={SheetBackdrop}
        backgroundStyle={{borderTopLeftRadius: 32, borderTopRightRadius: 32}}>
        <BottomSheetView style={{paddingHorizontal: 20}}>
          <View></View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

export default CategorySelectionSheet;
