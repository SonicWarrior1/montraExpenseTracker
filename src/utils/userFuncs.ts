import {
  FirebaseFirestoreTypes,
  Timestamp,
} from '@react-native-firebase/firestore';
import {UserType} from '../defs/user';
import {decrypt, encrypt} from './encryption';
import {
  initialExpenseCategories,
  initialIncomeCategories,
} from '../constants/strings';

export function UserToJson({
  uid,
  name,
  email,
  isSocial,
}: {
  uid: string;
  name: string;
  email: string;
  isSocial: boolean;
}): UserType {
  return {
    uid: uid,
    name: encrypt(name, uid),
    email: encrypt(email, uid),
    pin: '',
    expenseCategory: initialExpenseCategories.map(item => encrypt(item, uid)),
    incomeCategory: initialIncomeCategories.map(item => encrypt(item, uid)),
    budget: {},
    spend: {},
    income: {},
    notification: {},
    currency: encrypt('USD', uid),
    theme: encrypt('device', uid),
    isSocial: isSocial,
  };
}
export function UserFromJson(
  json: FirebaseFirestoreTypes.DocumentData,
): UserType {
  return {
    uid: json.uid,
    email: decrypt(json.email, json.uid),
    name: decrypt(json.name, json.uid),
    pin: json.pin !== '' ? decrypt(json.pin, json.uid) ?? json.pin : '',
    expenseCategory:
      json?.expenseCategory?.map((item: string) => decrypt(item, json.uid)) ??
      initialExpenseCategories,
    incomeCategory:
      json?.incomeCategory?.map((item: string) => decrypt(item, json.uid)) ??
      initialIncomeCategories,
    budget: decryptBudget(json),
    spend: decryptExpense(json),
    income: decryptIncome(json),
    notification: decryptNotifications(json),
    currency: decrypt(json.currency, json.uid) ?? 'USD',
    theme:
      (decrypt(json.theme, json.uid) as 'device' | 'light' | 'dark') ??
      'device',
    isSocial: json.isSocial ?? false,
  };
}

const decryptNotifications = (json: FirebaseFirestoreTypes.DocumentData) => {
  return (
    Object.fromEntries(
      Object.entries<{
        category: string;
        type: string;
        id: string;
        time: Timestamp;
        read: boolean;
        percentage: number;
      }>(json.notification ?? {}).map(([key, val]) => {
        return [
          key,
          {
            category: decrypt(val.category, json.uid) ?? val.category,
            type: decrypt(val.type, json.uid) ?? val.type,
            id: val.id,
            time: val.time,
            read: val.read,
            percentage: val.percentage ?? 0,
          },
        ];
      }),
    ) ?? {}
  );
};
const decryptIncome = (json: FirebaseFirestoreTypes.DocumentData) => {
  const income: UserType['spend'] = json?.income;
  return (
    Object.fromEntries(
      Object.entries(income ?? {}).map(([month, categories]) => {
        return [
          month,
          Object.fromEntries(
            Object.entries(categories ?? {}).map(([category, currencies]) => {
              return [
                category,
                Object.fromEntries(
                  Object.entries(currencies ?? {}).map(
                    ([currency, encryptedValue]) => {
                      return [
                        currency,
                        Number(decrypt(String(encryptedValue), json.uid)),
                      ];
                    },
                  ),
                ),
              ];
            }),
          ),
        ];
      }),
    ) ?? {}
  );
};
const decryptExpense = (json: FirebaseFirestoreTypes.DocumentData) => {
  const spend: UserType['spend'] = json?.spend;
  return (
    Object.fromEntries(
      Object.entries(spend ?? {}).map(([month, categories]) => {
        return [
          month,
          Object.fromEntries(
            Object.entries(categories ?? {}).map(([category, currencies]) => {
              return [
                category,
                Object.fromEntries(
                  Object.entries(currencies ?? {}).map(
                    ([currency, encryptedValue]) => {
                      return [
                        currency,
                        Number(decrypt(String(encryptedValue), json.uid)),
                      ];
                    },
                  ),
                ),
              ];
            }),
          ),
        ];
      }),
    ) ?? {}
  );
};
const decryptBudget = (json: FirebaseFirestoreTypes.DocumentData) => {
  return (
    Object.fromEntries(
      Object.entries<{
        [key: string]: {alert: boolean; limit: string; percentage: string};
      }>(json?.budget ?? {}).map(([key, value]) => {
        return [
          key,
          Object.assign(
            {},
            ...Object.entries(value ?? {}).map(([subKey, subValue]) => {
              return {
                [subKey]: {
                  alert: subValue.alert,
                  limit: Number(decrypt(subValue.limit, json.uid)),
                  percentage: Number(decrypt(subValue.percentage, json.uid)),
                },
              };
            }),
          ),
        ];
      }),
    ) ?? {}
  );
};
