import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import firestore from '@react-native-firebase/firestore';
import { transactionType } from "../defs/transaction";
import { setConversionData, setTransaction } from "../redux/reducers/transactionSlice";
import { useGetUsdConversionQuery } from "../redux/api/conversionApi";
import { userLoggedIn } from "../redux/reducers/userSlice";
import { UserFromJson, UserType } from "../defs/user";
export function useInitialSetup() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.currentUser);
    useEffect(() => {
        const unsubscribe = firestore()
            .collection('users')
            .doc(user!.uid)
            .collection('transactions')
            .orderBy('timeStamp', 'desc')
            .onSnapshot(snapshot => {
                const data: transactionType[] = snapshot.docs.map(
                    doc => doc.data() as transactionType,
                );
                const formatData = data.reduce(
                    (acc: { [key: string]: transactionType }, item) => {
                        acc[item.timeStamp.seconds] = item;
                        return acc;
                    },
                    {},
                );
                dispatch(setTransaction(formatData));
            });
        return () => unsubscribe();

    }, []);
    const { data: conversion, isSuccess } = useGetUsdConversionQuery({});
    useEffect(() => {
        if (isSuccess) {
            dispatch(setConversionData(conversion));
        }
    }, []);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('users')
            .doc(user!.uid)
            .onSnapshot(snapshot => {
                dispatch(userLoggedIn(UserFromJson(snapshot.data() as UserType)));
            });
        return () => unsubscribe();

    }, []);
}