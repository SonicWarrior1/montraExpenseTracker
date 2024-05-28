import { Timestamp } from "@react-native-firebase/firestore";

export type transactionType = {
    id:string,
    amount: number;
    category: string;
    desc: string;
    wallet: string;
    attachement: string;
    repeat: boolean;
    freq: repeatDataType | null;
    timeStamp:Timestamp,
    type:'expense'|'income'|'transfer'
}
export type repeatDataType = {
    freq: 'yearly' | 'monthly' | 'weekly' | 'daily';
    month?: number;
    day?: number;
    weekDay: number;
    end: 'date' | 'never';
    date?: Date;
}