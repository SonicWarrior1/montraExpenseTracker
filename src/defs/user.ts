import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type UserType = {
    name: string,
    email: string,
    uid: string,
    pin: string
}
export function UserToJson({
    uid,
    name,
    email,
    pin
}: {
    uid: string;
    name: string;
    email: string;
    pin: string
}): UserType {
    return {
        uid: uid,
        name: name,
        email: email,
        pin: pin
    };
}
export function UserFromJson(json: FirebaseFirestoreTypes.DocumentData): UserType {
    return {
        uid: json.uid,
        email: json.email,
        name: json.name,
        pin: json.pin ?? ''
    }
}