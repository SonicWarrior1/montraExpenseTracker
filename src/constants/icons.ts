import { RFValue } from 'react-native-responsive-fontsize';
import User from '../assets/Svgs/user.svg';
import Onboard1 from '../assets/Svgs/Onboard1.svg';
import Onboard2 from '../assets/Svgs/Onboard2.svg';
import Onboard3 from '../assets/Svgs/Onboard3.svg';
import Show from '../assets/Svgs/show.svg';
import Hide from '../assets/Svgs/eye-off.svg';
import Google from '../assets/Svgs/google.svg';
import ArrowLeft from '../assets/Svgs/arrow left.svg';
import ArrowLeft2 from '../assets/Svgs/arrow-left-2.svg';
import EmailSent from '../assets/Svgs/emailSent.svg';
import Home from '../assets/Svgs/home.svg';
import Transaction from '../assets/Svgs/transaction.svg';
import Pie from '../assets/Svgs/pie-chart.svg';
import Close from '../assets/Svgs/close.svg';
import Income from '../assets/Svgs/income.svg';
import Expense from '../assets/Svgs/expense.svg';
import Transfer from '../assets/Svgs/currency-exchange.svg';
import Attachment from '../assets/Svgs/attachment.svg';
import Camera from '../assets/Svgs/camera.svg';
import Document from '../assets/Svgs/file.svg';
import Gallery from '../assets/Svgs/gallery.svg';
import Filter from '../assets/Svgs/sort.svg';
import ArrowDown from '../assets/Svgs/arrow down.svg';
import ArrowRight from '../assets/Svgs/arrow-right.svg';
import Trash from '../assets/Svgs/trash.svg';
import Alert from '../assets/Svgs/alert.svg';
import Notification from '../assets/Svgs/notifiaction.svg';
import ArrowRight2 from '../assets/Svgs/arrow right 2.svg';
import More from '../assets/Svgs/more-horizontal.svg';
import Car from '../assets/Svgs/car.svg';
import Bill from '../assets/Svgs/recurring bill.svg';
import Food from '../assets/Svgs/restaurant.svg';
import Salary from '../assets/Svgs/salary.svg';
import Shopping from '../assets/Svgs/shopping bag.svg';
import Money from '../assets/Svgs/money-bag.svg';
import Edit from '../assets/Svgs/edit.svg';
import Wallet from '../assets/Svgs/wallet.svg';
import Logout from '../assets/Svgs/logout.svg';
import Upload from '../assets/Svgs/upload.svg';
import Setting from '../assets/Svgs/settings.svg';
import Download from '../assets/Svgs/download.svg';
import LineChart from '../assets/Svgs/line chart.svg';
import SortwithArrow from '../assets/Svgs/sort1.svg';
import Transfer2 from '../assets/Svgs/transfer.svg';
import Success from '../assets/Svgs/success.svg';
import { COLORS } from './commonStyles';
const iconStyle = (
  { width = 0,
    height = 0,
    color = 'black',
    borderColor = 'none' }
) => ({
  width: RFValue(width),
  height: RFValue(height),
  fill: color,
  stroke: borderColor,
});
export type iconProps = { width: number, height: number, color?: string, borderColor?: string };

export const ICONS = {
  User: (params: iconProps) => User({ ...iconStyle({ ...params }) }),
  Onboard1: (params: iconProps) => Onboard1({ ...iconStyle({ ...params }) }),
  Onboard2: (params: iconProps) => Onboard2({ ...iconStyle({ ...params }) }),
  Onboard3: (params: iconProps) => Onboard3({ ...iconStyle({ ...params }) }),
  Show: (params: iconProps) => Show({ ...iconStyle({ ...params }) }),
  Hide: (params: iconProps) => Hide({ ...iconStyle({ ...params }) }),
  Google: (params: iconProps) => Google({ ...iconStyle({ ...params }) }),
  ArrowLeft: (params: iconProps) => ArrowLeft({ ...iconStyle({ ...params }) }),
  EmailSent: (params: iconProps) => EmailSent({ ...iconStyle({ ...params }) }),
  Home: (params: iconProps) => Home({ ...iconStyle({ ...params }) }),
  Transaction: (params: iconProps) => Transaction({ ...iconStyle({ ...params }) }),
  Pie: (params: iconProps) => Pie({ ...iconStyle({ ...params }) }),
  Close: (params: iconProps) => Close({ ...iconStyle({ ...params }) }),
  Income: (params: iconProps) => Income({ ...iconStyle({ ...params }) }),
  Expense: (params: iconProps) => Expense({ ...iconStyle({ ...params }) }),
  Transfer: (params: iconProps) => Transfer({ ...iconStyle({ ...params }) }),
  Attachment: (params: iconProps) => Attachment({ ...iconStyle({ ...params }) }),
  Camera: (params: iconProps) => Camera({ ...iconStyle({ ...params }) }),
  Document: (params: iconProps) => Document({ ...iconStyle({ ...params }) }),
  Gallery: (params: iconProps) => Gallery({ ...iconStyle({ ...params }) }),
  Filter: (params: iconProps) => Filter({ ...iconStyle({ ...params }) }),
  ArrowDown: (params: iconProps) => ArrowDown({ ...iconStyle({ ...params }) }),
  ArrowRight: (params: iconProps) => ArrowRight({ ...iconStyle({ ...params }) }),
  Trash: (params: iconProps) => Trash({ ...iconStyle({ ...params }) }),
  ArrowLeft2: (params: iconProps) => ArrowLeft2({ ...iconStyle({ ...params }) }),
  Alert: (params: iconProps) => Alert({ ...iconStyle({ ...params }) }),
  Notification: (params: iconProps) => Notification({ ...iconStyle({ ...params }) }),
  ArrowRight2: (params: iconProps) => ArrowRight2({ ...iconStyle({ ...params }) }),
  More: (params: iconProps) => More({ ...iconStyle({ ...params }) }),
  Car: (params: iconProps) => Car({ ...iconStyle({ ...params }) }),
  Bill: (params: iconProps) => Bill({ ...iconStyle({ ...params }) }),
  Food: (params: iconProps) => Food({ ...iconStyle({ ...params }) }),
  Salary: (params: iconProps) => Salary({ ...iconStyle({ ...params }) }),
  Shopping: (params: iconProps) => Shopping({ ...iconStyle({ ...params }) }),
  Money: (params: iconProps) => Money({ ...iconStyle({ ...params }) }),
  Edit: (params: iconProps) => Edit({ ...iconStyle({ ...params }) }),
  Wallet: (params: iconProps) => Wallet({ ...iconStyle({ ...params }) }),
  Logout: (params: iconProps) => Logout({ ...iconStyle({ ...params }) }),
  Upload: (params: iconProps) => Upload({ ...iconStyle({ ...params }) }),
  Setting: (params: iconProps) => Setting({ ...iconStyle({ ...params }) }),
  Download: (params: iconProps) => Download({ ...iconStyle({ ...params }) }),
  LineChart: (params: iconProps) => LineChart({ ...iconStyle({ ...params }) }),
  SortwithArrow: (params: iconProps) => SortwithArrow({ ...iconStyle({ ...params }) }),
  Transfer2: (params: iconProps) => Transfer2({ ...iconStyle({ ...params }) }),
  Success: (params: iconProps) => Success({ ...iconStyle({ ...params }) }),
};

export const catIcons: { [key: string]: { icon: (params: iconProps) => React.ReactNode, color: string } } = {
  'food': { icon: ICONS.Food, color: COLORS.RED[20] },
  'salary': { icon: ICONS.Salary, color: COLORS.GREEN[20] },
  'transportation': { icon: ICONS.Car, color: COLORS.BLUE[20] },
  'shopping': { icon: ICONS.Shopping, color: COLORS.YELLOW[20] },
  'bill': { icon: ICONS.Bill, color: COLORS.VIOLET[20] },
  'subscription': { icon: ICONS.Bill, color: COLORS.VIOLET[20] },
};
