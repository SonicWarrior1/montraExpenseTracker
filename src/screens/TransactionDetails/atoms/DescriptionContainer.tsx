import React, {useState} from 'react';
import {View, Text, ActivityIndicator, Pressable, Image} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Toast from 'react-native-toast-message';
import CustomButton from '../../../components/CustomButton';
import {COLORS} from '../../../constants/commonStyles';
import {setLoading} from '../../../redux/reducers/userSlice';
import style from '../styles';
import {useAppTheme} from '../../../hooks/themeHook';
import {useNetInfo} from '@react-native-community/netinfo';
import FileViewer from 'react-native-file-viewer';
import {useAppDispatch} from '../../../redux/store';
import {OfflineTransactionModel} from '../../../DbModels/OfflineTransactionModel';
import {OnlineTransactionModel} from '../../../DbModels/OnlineTransactionModel';
import { STRINGS } from '../../../localization';

function DescriptionContainer({
  trans,
  setShowImage,
}: Readonly<{
  trans: OnlineTransactionModel | OfflineTransactionModel;
  setShowImage: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const {isConnected} = useNetInfo();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  return (
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
              {isLoading && <ActivityIndicator color={COLORS.VIOLET[40]} />}
              <Pressable
                onPress={() => {
                  if (isConnected) {
                    setShowImage(true);
                  }
                }}>
                {trans.attachement?.startsWith(
                  'https://firebasestorage.googleapis.com',
                ) ? (
                  <CustomImageCtr
                    isConnected={isConnected}
                    setIsLoading={setIsLoading}
                    styles={styles}
                    trans={trans}
                  />
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
                      text1: STRINGS.NoInternetAccess,
                      type: 'error',
                    });
                    return;
                  }
                  dispatch(setLoading(true));
                  console.log(trans.attachementType);
                  const res = await ReactNativeBlobUtil.config({
                    fileCache: true,
                    appendExt: trans.attachementType,
                  }).fetch('GET', trans.attachement ?? '');
                  // console.log(res.path())
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
  );
}

export default React.memo(DescriptionContainer);

function CustomImageCtr({
  isConnected,
  styles,
  trans,
  setIsLoading,
}: {
  isConnected: boolean | null;
  styles: any;
  trans: OnlineTransactionModel | OfflineTransactionModel;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return !isConnected ? (
    <Text style={styles.noInternetAccess}>{STRINGS.NoInternetAccess}</Text>
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
  );
}
