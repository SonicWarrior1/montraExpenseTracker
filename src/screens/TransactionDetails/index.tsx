import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import style from './styles';
import {TransactionDetailScreenProps} from '../../defs/navigation';
import {COLORS} from '../../constants/commonStyles';
import {ICONS} from '../../constants/icons';
import {
  currencies,
  monthData,
  NAVIGATION,
  STRINGS,
  weekData,
} from '../../constants/strings';
import Spacer from '../../components/Spacer';
import CustomButton from '../../components/CustomButton';
import DeleteTransactionSheet from '../../components/DeleteTransSheet';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {useAppTheme} from '../../hooks/themeHook';
// Third Party Libraries
import {Timestamp} from '@react-native-firebase/firestore';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import ImageModal from './atoms/imageModal';
import {OnlineTransactionModel} from '../../DbModels/OnlineTransactionModel';
import {useObject} from '@realm/react';
import {OfflineTransactionModel} from '../../DbModels/OfflineTransactionModel';
import ReactNativeBlobUtil from 'react-native-blob-util';
import FileViewer from 'react-native-file-viewer';
import {setLoading} from '../../redux/reducers/userSlice';
import {useNetInfo} from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import CustomHeader from '../../components/CustomHeader';
import {formatWithCommas} from '../../utils/commonFuncs';

function TransactionDetails({
  route,
  navigation,
}: Readonly<TransactionDetailScreenProps>) {
  // constants
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  // redux
  const dispatch = useAppDispatch();
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const conversion = useAppSelector(state => state.transaction.conversion);
  const online = useObject(OnlineTransactionModel, route.params.transaction.id);
  const offline = useObject(
    OfflineTransactionModel,
    route.params.transaction.id,
  );
  // console.log('djsfskdfnl', online, offline);
  const trans = offline ?? online;
  const {isConnected} = useNetInfo();
  // console.log(trans, route.params.transaction.id, online, offline);
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModalMethods>(null);
  // state
  const [showImage, setShowImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // functions
  const headerRight = () => {
    return (
      <Pressable
        onPress={() => {
          bottomSheetModalRef.current?.present();
        }}>
        {ICONS.Trash({height: 25, width: 25, color: COLOR.LIGHT[100]})}
      </Pressable>
    );
  };
  const getBackgroundColor = useMemo(() => {
    if (trans) {
      if (trans.type === 'expense') {
        return COLORS.PRIMARY.RED;
      } else if (trans.type === 'transfer') {
        return COLORS.PRIMARY.BLUE;
      } else {
        return COLORS.PRIMARY.GREEN;
      }
    }
  }, [trans]);
  return (
    trans !== null && (
      <View style={{flex: 1, backgroundColor: COLOR.LIGHT[100]}}>
        {trans.attachementType === 'image' && trans.attachement && (
          <ImageModal
            setShowImage={setShowImage}
            showImage={showImage}
            url={
              trans.attachement?.startsWith(
                'https://firebasestorage.googleapis.com',
              )
                ? trans.attachement
                : 'data:image/png;base64,' + trans.attachement
            }
          />
        )}
        <SafeAreaView
          style={[
            styles.safeView,
            {
              backgroundColor: getBackgroundColor,
            },
          ]}>
          <CustomHeader
            backgroundColor={getBackgroundColor!}
            title="Detail Transaction"
            navigation={navigation}
            HeaderRight={headerRight}
          />
          <Spacer height={Dimensions.get('screen').height * 0.025} />
          <Text style={styles.amt} numberOfLines={1}>
            {currencies[currency!].symbol ?? '$'}{' '}
            {formatWithCommas(
              Number(
                (
                  conversion.usd[(currency ?? 'USD').toLowerCase()] *
                  trans.amount
                ).toFixed(1),
              ).toString(),
            )}
          </Text>
          <Text style={styles.desc} numberOfLines={1}>
            {trans.desc ?? ''}
          </Text>
          <Text style={styles.time}>
            {
              weekData[
                Timestamp.fromMillis(trans.timeStamp.seconds * 1000)
                  .toDate()
                  .getDay()
              ].label
            }{' '}
            {Timestamp.fromMillis(trans.timeStamp.seconds * 1000)
              .toDate()
              .getDate()}{' '}
            {
              monthData[
                Timestamp.fromMillis(trans.timeStamp.seconds * 1000)
                  .toDate()
                  .getMonth()
              ].label
            }{' '}
            {Timestamp.fromMillis(trans.timeStamp.seconds * 1000)
              .toDate()
              .getFullYear()}{' '}
            {Timestamp.fromMillis(trans.timeStamp.seconds * 1000)
              .toDate()
              .getHours()}
            :
            {Timestamp.fromMillis(trans.timeStamp.seconds * 1000)
              .toDate()
              .getMinutes()}
          </Text>
        </SafeAreaView>
        <View style={styles.bottomView}>
          <View style={styles.ctr}>
            <View style={styles.ctrColumn}>
              <Text style={styles.text1}>{STRINGS.Type}</Text>
              <Text style={styles.text2}>
                {trans.type[0].toLocaleUpperCase() + trans.type.slice(1)}
              </Text>
            </View>
            {trans.type === 'transfer' ? (
              <>
                <View style={styles.ctrColumn}>
                  <Text style={styles.text1}>{STRINGS.From}</Text>
                  <Text style={styles.text2}>
                    {(trans.from ?? '')[0].toLocaleUpperCase() +
                      (trans.from ?? '').slice(1)}
                  </Text>
                </View>
                <View style={styles.ctrColumn}>
                  <Text style={styles.text1}>{STRINGS.To}</Text>
                  <Text style={styles.text2}>
                    {trans.to[0].toLocaleUpperCase() + trans.to.slice(1)}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.ctrColumn}>
                  <Text style={styles.text1}>{STRINGS.Category}</Text>
                  <Text
                    style={[styles.text2, {maxWidth: 140}]}
                    numberOfLines={1}>
                    {(trans.category ?? '')[0].toLocaleUpperCase() +
                      (trans.category ?? '').slice(1)}
                  </Text>
                </View>
                <View style={styles.ctrColumn}>
                  <Text style={styles.text1}>{STRINGS.Wallet}</Text>
                  <Text style={styles.text2}>
                    {trans.wallet === undefined || trans.wallet === ''
                      ? ''
                      : trans.wallet[0].toLocaleUpperCase() +
                        trans.wallet.slice(1)}
                  </Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.descCtr}>
            {(trans.desc ?? '') !== '' && (
              <Text style={styles.descTitle}>{STRINGS.Description}</Text>
            )}
            {(trans.desc ?? '') !== '' && (
              <Text style={styles.descText}>{trans.desc}</Text>
            )}
            {trans.attachementType !== 'none' && (
              <View>
                <Text style={styles.descTitle}>{STRINGS.Attachement}</Text>
                {trans.attachementType === 'image' ? (
                  <>
                    {isLoading && (
                      <ActivityIndicator color={COLORS.VIOLET[40]} />
                    )}
                    <Pressable
                      onPress={() => {
                        if (isConnected) {
                          setShowImage(true);
                        }
                      }}>
                      {trans.attachement?.startsWith(
                        'https://firebasestorage.googleapis.com',
                      ) ? (
                        !isConnected ? (
                          <Text
                            style={{
                              alignSelf: 'center',
                              fontSize: 16,
                              fontWeight: '500',
                              color: COLOR.RED[40],
                              marginTop: 20,
                            }}>
                            No Internet Access
                          </Text>
                        ) : (
                          <Image
                            source={{uri: trans.attachement}}
                            style={styles.img}
                            onLoadStart={() => {
                              setIsLoading(true);
                            }}
                            onLoadEnd={() => {
                              setIsLoading(false);
                            }}
                          />
                        )
                      ) : (
                        <Image
                          source={{
                            uri: 'data:image/png;base64,' + trans.attachement,
                          }}
                          style={styles.img}
                          onLoadStart={() => {
                            setIsLoading(true);
                          }}
                          onLoadEnd={() => {
                            setIsLoading(false);
                          }}
                        />
                      )}
                    </Pressable>
                  </>
                ) : (
                  <CustomButton
                    title={STRINGS.ViewDocument}
                    onPress={async () => {
                      try {
                        if (!isConnected) {
                          Toast.show({
                            text1: 'No Internet Access',
                            type: 'error',
                          });
                          return;
                        }
                        dispatch(setLoading(true));
                        const res = await ReactNativeBlobUtil.config({
                          fileCache: true,
                          appendExt: 'pdf',
                        }).fetch('GET', trans.attachement ?? '');
                        // console.log(res.path());
                        dispatch(setLoading(false));
                        FileViewer.open(res.path(), {showOpenWithDialog: true});
                      } catch (e) {
                        console.log(e);
                        dispatch(setLoading(false));
                      }
                    }}
                    backgroundColor={COLORS.VIOLET[20]}
                    textColor={COLORS.VIOLET[100]}
                  />
                )}
              </View>
            )}
          </View>

          <View style={styles.btnView}>
            <CustomButton
              title={STRINGS.Edit}
              onPress={() => {
                navigation.navigate(NAVIGATION.AddExpense, {
                  type: trans.type as 'income' | 'expense' | 'transfer',
                  isEdit: true,
                  transaction: trans,
                });
              }}
            />
          </View>
        </View>
        <DeleteTransactionSheet
          bottomSheetModalRef={bottomSheetModalRef}
          id={trans.id}
          navigation={navigation}
          type={trans.type as 'income' | 'expense' | 'transfer'}
          category={trans.category}
          amt={trans.amount}
          url={trans.attachement ?? ''}
        />
      </View>
    )
  );
}

export default TransactionDetails;
