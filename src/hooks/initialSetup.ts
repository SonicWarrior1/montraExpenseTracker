import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import firestore from '@react-native-firebase/firestore';
import { transactionType } from "../defs/transaction";
import { setConversionData, setTransaction } from "../redux/reducers/transactionSlice";
import { useGetUsdConversionQuery } from "../redux/api/conversionApi";
import { userLoggedIn } from "../redux/reducers/userSlice";
import { UserType } from "../defs/user";
import { UserFromJson } from "../utils/userFuncs";
import { TransFromJson } from "../utils/transFuncs";
export function useInitialSetup() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.currentUser);
    useEffect(() => {
        const unsubscribe = firestore()
            .collection('users')
            .doc(user!.uid)
            .onSnapshot(snapshot => {
                UserFromJson(snapshot.data() as UserType).then((user: UserType) => {
                    console.log(typeof user, user)
                    dispatch(userLoggedIn(user));
                })

            });
        return () => unsubscribe();

    }, []);
    useEffect(() => {
        const unsubscribe = firestore()
            .collection('users')
            .doc(user!.uid)
            .collection('transactions')
            .orderBy('timeStamp', 'desc')
            .onSnapshot(async (snapshot) => {
                const data: transactionType[] = await Promise.all(snapshot.docs.map(
                    async doc => (await TransFromJson(doc.data(), user!.uid)),
                ))
                    ;
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

}