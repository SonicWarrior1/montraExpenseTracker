import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import firestore, { Timestamp } from '@react-native-firebase/firestore';
import { transactionType } from "../defs/transaction";
import { userLoggedIn } from "../redux/reducers/userSlice";
import { UserType } from "../defs/user";
import { UserFromJson } from "../utils/userFuncs";
import { TransFromJson } from "../utils/transFuncs";
import { useQuery, useRealm } from "@realm/react";
import { OnlineTransactionModel } from "../DbModels/OnlineTransactionModel";
import { useNetInfo } from "@react-native-community/netinfo";
import { syncDb } from "./syncDb";
import { OfflineTransactionModel } from "../DbModels/OfflineTransactionModel";
import { BudgetModel } from "../DbModels/BudgetModel";
import { encrypt } from "../utils/encryption";
import { UpdateMode } from "realm";
export function useInitialSetup() {
    const realm = useRealm();
    const { isConnected } = useNetInfo();
    const data = useQuery(OfflineTransactionModel)
    const budget = useQuery(BudgetModel)
    const user = useAppSelector(state => state.user.currentUser)
    const conversion = useAppSelector(state => state.transaction.conversion)
    useEffect(() => {
        if (user !== undefined) {
            syncDb({ uid: user.uid, conversion: conversion, currency: user.currency, data: data, isConnected: isConnected!, realm: realm, budget: budget });
        }
    }, [isConnected])
    const dispatch = useAppDispatch();
    useEffect(() => {
        const unsubscribe = firestore()
            .collection('users')
            .doc(user!.uid)
            .onSnapshot(snapshot => {
                const user = UserFromJson(snapshot.data() as UserType)
                console.log(user)
                dispatch(userLoggedIn(user));
            });
        return () => unsubscribe();

    }, []);
    const transactions = useQuery(OnlineTransactionModel)
    useEffect(() => {
        const unsubscribe = firestore()
            .collection('users')
            .doc(user!.uid)
            .collection('transactions')
            .orderBy('timeStamp', 'desc')
            .onSnapshot(async (snapshot) => {
                const data: transactionType[] = snapshot.docs.map(
                    doc => (TransFromJson(doc.data(), user!.uid)),
                );
                // console.log(data)
                realm.write(() => {
                    realm.delete(transactions)
                });
                let expense: { [key: string]: { [key: string]: number } } = {};
                let income: { [key: string]: { [key: string]: number } } = {};
                data.forEach((item) => {
                    const month = Timestamp.fromMillis(item.timeStamp.seconds * 1000).toDate().getMonth();
                    if (item.type === 'income') {
                        if (income?.[month] !== undefined) {
                            income[month][item.category] = (income?.[month]?.[item.category] ?? 0) + item.amount;
                        } else {
                            income[month] = {}
                            income[month][item.category] = 0
                            income[month][item.category] = (income?.[month]?.[item.category] ?? 0) + item.amount;
                        }
                    } else {
                        if (expense?.[month] !== undefined) {
                            expense[month][item.category] = (expense?.[month]?.[item.category] ?? 0) + item.amount
                        } else {
                            expense[month] = {}
                            expense[month][item.category] = 0;
                            expense[month][item.category] = (expense?.[month]?.[item.category] ?? 0) + item.amount
                        }
                    }
                    realm.write(() => {
                        // realm.delete(item)
                        realm.create('OnlineTransaction', { ...item, changed: false }, UpdateMode.All);
                    });
                })

                for (const month in income) {
                    for (const category in income[month]) {
                        income[month][category] = encrypt(String(income[month][category]), user.uid)
                    }
                }
                for (const month in expense) {
                    for (const category in expense[month]) {
                        expense[month][category] = encrypt(String(expense[month][category]), user.uid)
                    }
                }
                // console.log(income, expense)
                await firestore()
                    .collection('users')
                    .doc(user!.uid).update({
                        income: income,
                        spend: expense
                    })
            });
        return () => unsubscribe();
    }, []);

}