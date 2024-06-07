import { FirebaseFirestoreTypes, Timestamp } from "@react-native-firebase/firestore";
import { UserType } from "../defs/user";
import { decrypt, encrypt } from "./encryption";

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
        name: encrypt(name, uid),
        email: encrypt(email, uid),
        pin: '',
        expenseCategory: ['add', 'food', 'bill', 'shopping', 'subscription', 'transportation'].map((item) => encrypt(item, uid)),
        incomeCategory: ['add', 'salary', 'passive income'].map((item) => encrypt(item, uid)),
        budget: {},
        spend: {},
        income: {},
        notification: {},
        currency: encrypt('USD', uid),
        theme: encrypt('device', uid)
    };
}
export function UserFromJson(json: FirebaseFirestoreTypes.DocumentData): UserType {
    return {
        uid: json.uid,
        email: decrypt(json.email, json.uid) ?? json.email,
        name: decrypt(json.name, json.uid) ?? json.name,
        pin: json.pin !== '' ? decrypt(json.pin, json.uid) ?? json.pin : '',
        expenseCategory: json.expenseCategory.map((item: string) => decrypt(item, json.uid)) ?? ['add', 'food', 'bill', 'shopping', 'subscription', 'transportation'],
        incomeCategory: json.incomeCategory.map((item: string) => decrypt(item, json.uid)) ?? ['add', 'salary', 'passive income'],
        budget: Object.fromEntries(Object.entries<{ [key: string]: { alert: boolean, limit: string, percentage: string } }>(json.budget).map(([key, value]) => {
            return [key, Object.assign({}, ...Object.entries(value).map(([subKey, subValue]) => {
                return {
                    [subKey]: {
                        alert: subValue['alert'],
                        limit: Number(decrypt(subValue['limit'], json.uid)),
                        percentage: Number(decrypt(subValue['percentage'], json.uid)),
                    }
                };
            }))];
        })) ?? {},
        spend: Object.fromEntries(Object.entries<{ [key: string]: string }>(json.spend).map(([key, value]) => {
            return [key, Object.assign({}, ...Object.entries(value).map(([subkey, subval]) => {
                return {
                    [subkey]: Number(decrypt(subval, json.uid))
                }
            }))];
        })) ?? {},
        income: Object.fromEntries(Object.entries<{ [key: string]: string }>(json.income).map(([key, value]) => {
            return [key, Object.assign({}, ...Object.entries(value).map(([subkey, subval]) => {
                return {
                    [subkey]: Number(decrypt(subval, json.uid))
                }
            }))];
        })) ?? {},
        notification: Object.fromEntries(Object.entries<{ category: string, type: string, id: string, time: Timestamp, read: boolean }>(json.notification).map(([key, val]) => {
            return [key, {
                category: decrypt(val['category'], json.uid) ?? val['category'],
                type: decrypt(val['type'], json.uid) ?? val['type'],
                id: val['id'],
                time: val['time'],
                read: val['read'],
            }]
        })) ?? {},
        currency: decrypt(json.currency, json.uid) ?? 'USD',
        theme: (decrypt(json.theme, json.uid) as "device" | "light" | "dark"
        ) ?? 'device'
    }
}
