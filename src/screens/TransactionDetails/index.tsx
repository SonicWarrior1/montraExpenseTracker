import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
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
import {useAppSelector} from '../../redux/store';
import {useAppTheme} from '../../hooks/themeHook';
// Third Party Libraries
import {Timestamp} from '@react-native-firebase/firestore';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import ImageModal from './atoms/imageModal';
import {OnlineTransactionModel} from '../../DbModels/OnlineTransactionModel';
import {useObject, useQuery} from '@realm/react';

function TransactionDetails({
  route,
  navigation,
}: Readonly<TransactionDetailScreenProps>) {
  // constants
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  // redux
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const conversion = useAppSelector(state => state.transaction.conversion);
  console.log(route.params.transaction.timeStamp.seconds)
  const trans = useObject(
    OnlineTransactionModel,
    String(route.params.transaction.timeStamp.seconds),
  );
  console.log(trans)
  // const data = Array(...dbData);
  // const trans = data[route.params.transaction.timeStamp.seconds];
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
        }}
        style={{marginRight: 15}}>
        {ICONS.Trash({height: 25, width: 25, color: COLOR.LIGHT[100]})}
      </Pressable>
    );
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: headerRight,
    });
  }, []);
  const getBackgroundColor = useMemo(() => {
    if (trans!.type === 'expense') {
      return COLORS.PRIMARY.RED;
    } else if (trans!.type === 'transfer') {
      return COLORS.PRIMARY.BLUE;
    } else {
      return COLORS.PRIMARY.GREEN;
    }
  }, [trans]);
  return (
    trans && (
      <View style={{flex: 1, backgroundColor: COLOR.LIGHT[100]}}>
        {trans.attachementType === 'image' && trans.attachement && (
          <ImageModal
            setShowImage={setShowImage}
            showImage={showImage}
            url={trans.attachement}
          />
        )}
        <SafeAreaView
          style={[
            styles.safeView,
            {
              backgroundColor: getBackgroundColor,
            },
          ]}>
          <Spacer height={Dimensions.get('screen').height * 0.075} />
          <Text style={styles.amt}>
            {currencies[currency!].symbol ?? '$'}{' '}
            {Number(
              (
                conversion.usd[(currency ?? 'USD').toLowerCase()] * trans.amount
              ).toFixed(1),
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
                  <Text style={styles.text2}>
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
                        setShowImage(true);
                      }}>
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
                    </Pressable>
                  </>
                ) : (
                  <CustomButton
                    title={STRINGS.ViewDocument}
                    onPress={() => {
                      navigation.navigate(NAVIGATION.DocView, {
                        uri: trans.attachement!,
                      });
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
                  type: trans.type,
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
          type={trans.type}
          category={trans.category}
          amt={trans.amount}
        />
      </View>
    )
  );
}

export default TransactionDetails;
