import {Pressable, Text} from 'react-native';
import {iconProps} from '../../constants/icons';
import Sapcer from '../Spacer';

function TabButton({
  onPress,
  icon,
  title,
}: Readonly<{
  onPress: () => void;
  icon: (params: iconProps) => React.ReactNode;
  title: string;
}>) {
  return (
    <Pressable
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
      }}
      onPress={onPress}>
      {icon({height: 25, width: 25})}
      <Sapcer height={10} />
      <Text style={{color: '#C6C6C6', fontSize: 10, fontWeight: '500'}}>
        {title}
      </Text>
    </Pressable>
  );
}

export default TabButton