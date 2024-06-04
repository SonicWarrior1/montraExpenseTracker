import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import {ICONS} from '../../constants/icons';
import CustomButton from '../CustomButton';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {COLORS} from '../../constants/commonStyles';
import styles from './styles';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  openCatSheet,
  openFilterSheet,
  setFilters,
  setSortFilter,
} from '../../redux/reducers/transactionSlice';

function FilterSheet() {
  const snapPoints = useMemo(() => ['55%'], []);
  const ref = useRef<BottomSheetModal>(null);
  const isOpen = useAppSelector(state => state.transaction.isFilterOpen);
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
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        enablePanDownToClose
        index={0}
        snapPoints={snapPoints}
        ref={ref}
        onDismiss={() => {
          dispatch(openFilterSheet(false));
        }}>
        <BottomSheetView style={{paddingHorizontal: 20}}>
          <View style={styles.sheetView}>
            <Text style={styles.text1}>Filter Transaction</Text>
            <Pressable
              style={styles.editBtn}
              onPress={() => {
                setFilter(-1);
                setSort(-1);
                dispatch(setFilters(-1));
                dispatch(setSortFilter(2));
              }}>
              <Text style={styles.editBtnText}>Reset</Text>
            </Pressable>
          </View>
          <Text style={[styles.text1, {marginBottom: 10}]}>Filter By</Text>
          <View style={styles.flexRow}>
            <Pressable
              style={[
                styles.filterBtn,
                {
                  backgroundColor:
                    filter === 0 ? COLORS.VIOLET[20] : COLORS.LIGHT[100],
                },
              ]}
              onPress={() => {
                setFilter(0);
              }}>
              <Text
                style={[
                  styles.filterBtnText,
                  {color: filter === 0 ? COLORS.VIOLET[100] : COLORS.DARK[100]},
                ]}>
                Income
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterBtn,
                {
                  backgroundColor:
                    filter === 1 ? COLORS.VIOLET[20] : COLORS.LIGHT[100],
                },
              ]}
              onPress={() => {
                setFilter(1);
              }}>
              <Text
                style={[
                  styles.filterBtnText,
                  {color: filter === 1 ? COLORS.VIOLET[100] : COLORS.DARK[100]},
                ]}>
                Expense
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterBtn,
                {
                  backgroundColor:
                    filter === 2 ? COLORS.VIOLET[20] : COLORS.LIGHT[100],
                },
              ]}
              onPress={() => {
                setFilter(2);
              }}>
              <Text
                style={[
                  styles.filterBtnText,
                  {color: filter === 2 ? COLORS.VIOLET[100] : COLORS.DARK[100]},
                ]}>
                Transfer
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
            Sort By
          </Text>
          <View style={styles.wrapRow}>
            <Pressable
              style={[
                styles.filterBtn,
                {
                  backgroundColor:
                    sort === 0 ? COLORS.VIOLET[20] : COLORS.LIGHT[100],
                },
              ]}
              onPress={() => {
                setSort(0);
              }}>
              <Text
                style={[
                  styles.filterBtnText,
                  {color: sort === 0 ? COLORS.VIOLET[100] : COLORS.DARK[100]},
                ]}>
                Highest
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterBtn,
                {
                  backgroundColor:
                    sort === 1 ? COLORS.VIOLET[20] : COLORS.LIGHT[100],
                },
              ]}
              onPress={() => {
                setSort(1);
              }}>
              <Text
                style={[
                  styles.filterBtnText,
                  {color: sort === 1 ? COLORS.VIOLET[100] : COLORS.DARK[100]},
                ]}>
                Lowest
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterBtn,
                {
                  backgroundColor:
                    sort === 2 ? COLORS.VIOLET[20] : COLORS.LIGHT[100],
                },
              ]}
              onPress={() => {
                setSort(2);
              }}>
              <Text
                style={[
                  styles.filterBtnText,
                  {color: sort === 2 ? COLORS.VIOLET[100] : COLORS.DARK[100]},
                ]}>
                Newest
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterBtn,
                {
                  backgroundColor:
                    sort === 3 ? COLORS.VIOLET[20] : COLORS.LIGHT[100],
                },
              ]}
              onPress={() => {
                setSort(3);
              }}>
              <Text
                style={[
                  styles.filterBtnText,
                  {color: sort === 3 ? COLORS.VIOLET[100] : COLORS.DARK[100]},
                ]}>
                Oldest
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
            Category
          </Text>
          <View style={styles.catRow}>
            <Text style={styles.text1}>Choose Category</Text>
            <Pressable
              onPress={() => {
                dispatch(openCatSheet(true));
              }}
              style={styles.pressable}>
              <Text style={styles.text2}>0 Selected</Text>

              {ICONS.ArrowRight({height: 20, width: 20})}
            </Pressable>
          </View>
          <CustomButton
            title="Apply"
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

export default FilterSheet;
