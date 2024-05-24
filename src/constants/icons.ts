import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import User from '../assets/Svgs/user.svg'
import Onboard1 from '../assets/Svgs/Onboard1.svg';
import Onboard2 from '../assets/Svgs/Onboard2.svg';
import Onboard3 from '../assets/Svgs/Onboard3.svg';
import Show from '../assets/Svgs/show.svg';
import Hide from '../assets/Svgs/eye-off.svg';
import Google from '../assets/Svgs/google.svg';
import ArrowLeft from '../assets/Svgs/arrow left.svg';
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
  Onboard1: (params: iconProps) => Onboard1({ ...iconStyle({ ...params }) }),
  Onboard2: (params: iconProps) => Onboard2({ ...iconStyle({ ...params }) }),
  Onboard3: (params: iconProps) => Onboard3({ ...iconStyle({ ...params }) }),
  Show: (params: iconProps) => Show({ ...iconStyle({ ...params }) }),
  Hide: (params: iconProps) => Hide({ ...iconStyle({ ...params }) }),
  Google: (params: iconProps) => Google({ ...iconStyle({ ...params }) }),
  ArrowLeft: (params: iconProps) => ArrowLeft({ ...iconStyle({ ...params }) }),
};
