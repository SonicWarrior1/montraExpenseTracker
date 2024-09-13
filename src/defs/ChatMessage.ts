import {Timestamp} from '@react-native-firebase/firestore';

export type ChatMessage = {
  id: string;
  text: string;
  time: Timestamp;
  sender: string;
  type:
    | 'text'
    | 'image'
    | 'pdf'
    | 'doc'
    | 'docx'
    | 'csv'
    | 'xls'
    | 'xlsx'
    | 'txt'
    | 'video'
    | 'audio';
  attachment: string | undefined;
};
