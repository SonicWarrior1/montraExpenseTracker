import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {ChatMessage} from '../defs/ChatMessage';
import {decrypt, encrypt} from './encryption';

export const ChatToJson = ({
  id,
  text,
  time,
  sender,
  type,
  attachment,
}: ChatMessage): ChatMessage => {
  return {
    id,
    sender,
    time,
    type,
    text: encrypt(text, id),
    attachment: attachment,
  };
};
export const ChatFromJson = (
  json: FirebaseFirestoreTypes.DocumentData,
): ChatMessage => {
  return {
    id: json.id,
    sender: json.sender,
    time: json.time,
    type: json.type,
    text: decrypt(json.text, json.id),
    attachment: json.attachment,
  };
};
