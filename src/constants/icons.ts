import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import User from '../assets/Svgs/user.svg'
const iconStyle = (
  { width = 0,
    height = 0,
    color = 'black',
    borderColor = 'none', }
) => ({
  width: RFValue(width),
  height: RFValue(height),
  fill: color,
  stroke: borderColor,
});
type iconProps = { width: number, height: number, color?: string, borderColor?: string };

export const ICONS = {
  User: (params: iconProps) => User({ ...iconStyle({ ...params }) }),
};
