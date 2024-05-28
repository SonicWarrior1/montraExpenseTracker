import {Pressable, Text} from 'react-native';
import {iconProps} from '../../constants/icons';
import Sapcer from '../Spacer';
import {COLORS} from '../../constants/commonStyles';

function TabButton({
  onPress,
  icon,
  title,
  isActive,
}: Readonly<{
  onPress: () => void;
  icon: (params: iconProps) => React.ReactNode;
  title: string;
  isActive: boolean;
}>) {
  return (
    <Pressable
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
      }}
      onPress={onPress}>
      {icon({
        height: 25,
        width: 25,
        color: isActive ? COLORS.PRIMARY.VIOLET : '#C6C6C6',
      })}
      <Sapcer height={10} />
      <Text
        style={{
          color: isActive ? COLORS.PRIMARY.VIOLET : '#C6C6C6',
          fontSize: 10,
          fontWeight: '500',
        }}>
        {title}
      </Text>
    </Pressable>
  );
}

export default TabButton;
