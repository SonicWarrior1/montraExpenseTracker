import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import {ICONS} from '../../constants/icons';
import CustomButton from '../CustomButton';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import style from './styles';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  clearCatFilter,
  openCatSheet,
  openFilterSheet,
  setFilters,
  setSortFilter,
} from '../../redux/reducers/transactionSlice';
import SheetBackdrop from '../SheetBackDrop';
import {STRINGS} from '../../constants/strings';
import {useAppTheme} from '../../hooks/themeHook';

function FilterSheet() {
  const snapPoints = useMemo(() => ['55%'], []);
  const ref = useRef<BottomSheetModal>(null);
  const isOpen = useAppSelector(state => state.transaction.isFilterOpen);
  const selectedCats = useAppSelector(state => state.transaction.filters.cat);
  console.log(isOpen);
  useEffect(() => {
    if (isOpen === true) {
      ref.current?.present();
    } else {
      ref.current?.close();
    }
  }, [isOpen]);
  const [filter, setFilter] = useState(-1);
  const [sort, setSort] = useState(-1);
  const dispatch = useAppDispatch();
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        enablePanDownToClose
        index={0}
        snapPoints={snapPoints}
        ref={ref}
        backdropComponent={SheetBackdrop}
        backgroundStyle={styles.sheetBack}
        handleIndicatorStyle={{backgroundColor: COLOR.DARK[100]}}
        onDismiss={() => {
          dispatch(openFilterSheet(false));
        }}>
        <BottomSheetView style={{paddingHorizontal: 20}}>
          <View style={styles.sheetView}>
            <Text style={styles.text1}>{STRINGS.FilterTransaction}</Text>
            <Pressable
              style={styles.editBtn}
              onPress={() => {
                setFilter(-1);
                setSort(-1);
                dispatch(setFilters(-1));
                dispatch(setSortFilter(2));
                dispatch(clearCatFilter());
              }}>
              <Text style={styles.editBtnText}>{STRINGS.Reset}</Text>
            </Pressable>
          </View>
          <Text style={[styles.text1, {marginBottom: 10}]}>
            {STRINGS.FilterBy}
          </Text>
          <View style={styles.flexRow}>
            <Pressable
              style={[
                styles.filterBtn,
                {
                  backgroundColor:
                    filter === 0 ? COLOR.VIOLET[20] : COLOR.LIGHT[100],
                },
              ]}
              onPress={() => {
                setFilter(0);
              }}>
              <Text
                style={[
                  styles.filterBtnText,
                  {color: filter === 0 ? COLOR.VIOLET[100] : COLOR.DARK[100]},
                ]}>
                {STRINGS.Income}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterBtn,
                {
                  backgroundColor:
                    filter === 1 ? COLOR.VIOLET[20] : COLOR.LIGHT[100],
                },
              ]}
              onPress={() => {
                setFilter(1);
              }}>
              <Text
                style={[
                  styles.filterBtnText,
                  {color: filter === 1 ? COLOR.VIOLET[100] : COLOR.DARK[100]},
                ]}>
                {STRINGS.Expense}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterBtn,
                {
                  backgroundColor:
                    filter === 2 ? COLOR.VIOLET[20] : COLOR.LIGHT[100],
                },
              ]}
              onPress={() => {
                setFilter(2);
              }}>
              <Text
                style={[
                  styles.filterBtnText,
                  {color: filter === 2 ? COLOR.VIOLET[100] : COLOR.DARK[100]},
                ]}>
                {STRINGS.Transfer}
              </Text>
            </Pressable>
          </View>
          <Text
            style={[
              styles.text1,
              {
                marginBottom: 10,
                marginTop: 10,
              },
            ]}>
            {STRINGS.SortBy}
          </Text>
          <View style={styles.wrapRow}>
            <Pressable
              style={[
                styles.filterBtn,
                {
                  backgroundColor:
                    sort === 0 ? COLOR.VIOLET[20] : COLOR.LIGHT[100],
                },
              ]}
              onPress={() => {
                setSort(0);
              }}>
              <Text
                style={[
                  styles.filterBtnText,
                  {color: sort === 0 ? COLOR.VIOLET[100] : COLOR.DARK[100]},
                ]}>
                {STRINGS.Highest}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterBtn,
                {
                  backgroundColor:
                    sort === 1 ? COLOR.VIOLET[20] : COLOR.LIGHT[100],
                },
              ]}
              onPress={() => {
                setSort(1);
              }}>
              <Text
                style={[
                  styles.filterBtnText,
                  {color: sort === 1 ? COLOR.VIOLET[100] : COLOR.DARK[100]},
                ]}>
                {STRINGS.Lowest}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterBtn,
                {
                  backgroundColor:
                    sort === 2 ? COLOR.VIOLET[20] : COLOR.LIGHT[100],
                },
              ]}
              onPress={() => {
                setSort(2);
              }}>
              <Text
                style={[
                  styles.filterBtnText,
                  {color: sort === 2 ? COLOR.VIOLET[100] : COLOR.DARK[100]},
                ]}>
                {STRINGS.Newest}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterBtn,
                {
                  backgroundColor:
                    sort === 3 ? COLOR.VIOLET[20] : COLOR.LIGHT[100],
                },
              ]}
              onPress={() => {
                setSort(3);
              }}>
              <Text
                style={[
                  styles.filterBtnText,
                  {color: sort === 3 ? COLOR.VIOLET[100] : COLOR.DARK[100]},
                ]}>
                {STRINGS.Oldest}
              </Text>
            </Pressable>
          </View>
          <Text
            style={[
              styles.text1,
              {
                marginBottom: 15,
                marginTop: 10,
              },
            ]}>
            {STRINGS.Category}
          </Text>
          <View style={styles.catRow}>
            <Text style={styles.text1}>{STRINGS.ChooseCategory}</Text>
            <Pressable
              onPress={() => {
                console.log('jdnk');
                dispatch(openCatSheet(true));
              }}
              style={styles.pressable}>
              <Text style={styles.text2}>{selectedCats?.length?? 0} Selected</Text>
              {ICONS.ArrowRight({
                height: 20,
                width: 20,
                color: COLOR.DARK[100],
              })}
            </Pressable>
          </View>
          <CustomButton
            title={STRINGS.Apply}
            onPress={() => {
              dispatch(setFilters(filter));
              dispatch(setSortFilter(sort));
            }}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

export default React.memo(FilterSheet);
