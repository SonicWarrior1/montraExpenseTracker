import { Timestamp } from '@react-native-firebase/firestore';
import { TimestampModel } from '../DbModels/TimestampModel';

export type transactionType = {
    id: string,
    amount: number;
    category: string;
    desc: string;
    wallet: string;
    attachement?: string;
    repeat: boolean;
    freq: repeatDataType | null;
    timeStamp: Timestamp | TimestampModel,
    type: 'expense' | 'income' | 'transfer',
    attachementType: 'image' | 'doc' | 'none',
    from:string,
    to:string
}
export type repeatDataType = {
    freq: 'yearly' | 'monthly' | 'weekly' | 'daily';
    month?: number;
    day?: number;
    weekDay: number;
    end: 'date' | 'never';
    date?: Date | Timestamp;
}
