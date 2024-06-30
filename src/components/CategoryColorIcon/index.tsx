import {View} from 'react-native';
import React from 'react';
import styles from './styles';

export default function CategoryDropdownIcon(
  category: string,
  catColors: {[key: string]: string},
): ((visible?: boolean) => JSX.Element | null | undefined) | undefined {
  return visible => {
    return !visible && category !== '' ? (
      <View
        style={[
          styles.icon,
          {
            backgroundColor: catColors?.[category ?? ''] ?? 'green',
          },
        ]}
      />
    ) : undefined;
  };
}
