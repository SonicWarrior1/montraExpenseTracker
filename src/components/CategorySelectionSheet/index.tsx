import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {useEffect, useMemo, useRef} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {Pressable, Text, View} from 'react-native';
import {
  openCatSheet,
  setCatFilter,
} from '../../redux/reducers/transactionSlice';
import SheetBackdrop from '../SheetBackDrop';
import style from './styles';
import CustomButton from '../CustomButton';
import {useAppTheme} from '../../hooks/themeHook';

function CategorySelectionSheet() {
  // constants
  const dispatch = useAppDispatch();
  const snapPoints = useMemo(() => ['35%'], []);
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  // ref
  const ref = useRef<BottomSheetModal>(null);
  // redux
  const isOpen = useAppSelector(state => state.transaction.isCatOpen);
  const selected = useAppSelector(state => state.transaction.filters.cat);
  const incomeCats = useAppSelector(
    state => state.user.currentUser?.incomeCategory,
  );
  const expenseCats = useAppSelector(
    state => state.user.currentUser?.expenseCategory,
  );

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
        backgroundStyle={styles.sheetBack}
        handleIndicatorStyle={{backgroundColor: COLOR.DARK[100]}}>
        <BottomSheetView style={{paddingHorizontal: 20}}>
          <View style={styles.row}>
            {expenseCats
              ?.slice(1)
              ?.concat(incomeCats?.slice(1)!)
              ?.map(item => (
                <Pressable
                  key={item}
                  style={[
                    styles.filterBtn,
                    {
                      backgroundColor: selected.includes(item)
                        ? COLOR.VIOLET[20]
                        : COLOR.LIGHT[100],
                    },
                  ]}
                  onPress={() => {
                    dispatch(setCatFilter(item));
                  }}>
                  <Text
                    style={[
                      styles.filterBtnText,
                      {
                        color: selected.includes(item)
                          ? COLOR.VIOLET[100]
                          : COLOR.DARK[100],
                      },
                    ]}>
                    {item[0].toUpperCase() + item.slice(1)}
                  </Text>
                </Pressable>
              ))}
            <CustomButton
              title="Continue"
              onPress={() => {
                dispatch(openCatSheet(false));
              }}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

export default CategorySelectionSheet;
