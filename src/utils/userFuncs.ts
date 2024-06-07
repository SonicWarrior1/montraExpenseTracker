import { FirebaseFirestoreTypes, Timestamp } from "@react-native-firebase/firestore";
import { UserType } from "../defs/user";
import { decrypt, encrypt } from "./encryption";

export async function UserToJson({
    uid,
    name,
    email,
    pin
}: {
    uid: string;
    name: string;
    email: string;
    pin: string
}): Promise<UserType> {
    return {
        uid: uid,
        name: await encrypt(name, uid),
        email: await encrypt(email, uid),
        pin: '',
        expenseCategory: await Promise.all(['add', 'food', 'bill', 'shopping', 'subscription', 'transportation'].map(async (item) => await encrypt(item, uid))),
        incomeCategory: await Promise.all(['add', 'salary', 'passive income'].map(async (item) => await encrypt(item, uid))),
        budget: {},
        spend: {},
        income: {},
        notification: {},
        currency: await encrypt('USD', uid),
    };
}
export async function UserFromJson(json: FirebaseFirestoreTypes.DocumentData): Promise<UserType> {
    return {
        uid: json.uid,
        email: await decrypt(json.email, json.uid) ?? json.email,
        name: await decrypt(json.name, json.uid) ?? json.name,
        pin: json.pin !== '' ? await decrypt(json.pin, json.uid) ?? json.pin : '',
        expenseCategory: await Promise.all(json.expenseCategory.map(async (item: string) => await decrypt(item, json.uid))) ?? ['add', 'food', 'bill', 'shopping', 'subscription', 'transportation'],
        incomeCategory: await Promise.all(json.incomeCategory.map(async (item: string) => await decrypt(item, json.uid))) ?? ['add', 'salary', 'passive income'],
        budget: await Promise.all(Object.entries<{ [key: string]: { alert: boolean, limit: string, percentage: string } }>(json.budget).map(async ([key, value]) => {
            return [key, await Promise.all(Object.entries(value).map(async ([subKey, subValue]) => {
                return {
                    [subKey]: {
                        alert: subValue['alert'],
                        limit: Number(await decrypt(subValue['limit'], json.uid)),
                        percentage: Number(await decrypt(subValue['percentage'], json.uid)),
                    }
                };
            })).then(entries => Object.assign({}, ...entries))];
        })).then(entries => Object.fromEntries(entries)) ?? {},
        spend: await Promise.all(Object.entries<{ [key: string]: string }>(json.spend).map(async ([key, value]) => {
            return [key, await Promise.all(Object.entries(value).map(async ([subkey, subval]) => {
                return {
                    [subkey]: Number(await decrypt(subval, json.uid))
                }
            })).then(entries => Object.assign({}, ...entries))];
        })).then(entries => Object.fromEntries(entries)) ?? {},
        income: await Promise.all(Object.entries<{ [key: string]: string }>(json.income).map(async ([key, value]) => {
            return [key, await Promise.all(Object.entries(value).map(async ([subkey, subval]) => {
                return {
                    [subkey]: Number(await decrypt(subval, json.uid))
                }
            })).then(entries => Object.assign({}, ...entries))];
        })).then(entries => Object.fromEntries(entries)) ?? {},
        notification: await Promise.all(Object.entries<{ category: string, type: string, id: string, time: Timestamp, read: boolean }>(json.notification).map(async ([key, val]) => {
            return [key, {
                category: await decrypt(val['category'], json.uid) ?? val['category'],
                type: await decrypt(val['type'], json.uid) ?? val['type'],
                id: val['id'],
                time: val['time'],
                read: val['read'],
            }]
        })).then(entries => Object.fromEntries(entries)) ?? {},
        currency: await decrypt(json.currency, json.uid) ?? 'USD'
    }
}
