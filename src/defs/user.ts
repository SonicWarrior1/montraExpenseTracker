import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type UserType = {
    name: string,
    email: string,
    uid: string,
    pin: string,
    expenseCategory: string[],
    incomeCategory: string[],
    budget: { [key: string]: { alert: boolean, limit: number, percentage: number } }
    spend: { [key: string]: number }
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
        pin: pin,
        expenseCategory: ['add', 'food', 'bill', 'shopping', 'subscription', 'transportation'],
        incomeCategory: ['add', 'salary', 'passive income'],
        budget: {},
        spend: {}
    };
}
export function UserFromJson(json: FirebaseFirestoreTypes.DocumentData): UserType {
    return {
        uid: json.uid,
        email: json.email,
        name: json.name,
        pin: json.pin ?? '',
        expenseCategory: json.expenseCategory ?? ['add', 'food', 'bill', 'shopping', 'subscription', 'transportation'],
        incomeCategory: json.incomeCategory ?? ['add', 'salary', 'passive income'],
        budget: json.budget ?? {},
        spend: json.spend ?? {}
    }
}
