import React, {useEffect, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import Spacer from '../../../components/Spacer';
import {ICONS} from '../../../constants/icons';
import styles from '../styles';
import {STRINGS} from '../../../localization';

function PinHeader({
  isSetup,
  oldPin,
  backAction,
  setMenu,
}: Readonly<{
  isSetup: boolean;
  oldPin: string;
  backAction: () => boolean;
  setMenu: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
  const [temp, setTemp] = useState(true);
  useEffect(() => {
    if (temp) {
      setTemp(false);
    }
  }, [temp]);
  const getTitleText = () => {
    if (isSetup && oldPin === '') {
      return STRINGS.SetupPin;
    } else if (isSetup && oldPin) {
      return STRINGS.RetypePin;
    } else {
      return STRINGS.EnterPin;
    }
  };
  return (
    <View style={styles.headerRow}>
      {isSetup ? (
        <Pressable onPress={backAction}>
          {ICONS.ArrowLeft({
            height: 25,
            width: 25,
            color: 'white',
            borderColor: 'white',
          })}
        </Pressable>
      ) : (
        <Spacer width={25} />
      )}
      <Text style={styles.text}>{getTitleText()}</Text>
      {isSetup ? (
        <Spacer width={25} />
      ) : (
        <Pressable
          style={{transform: [{rotateZ: '90deg'}]}}
          onPress={() => {
            setMenu(menu => !menu);
          }}>
          {ICONS.More({height: 20, width: 20, color: 'white'})}
        </Pressable>
      )}
    </View>
  );
}

export default PinHeader;
