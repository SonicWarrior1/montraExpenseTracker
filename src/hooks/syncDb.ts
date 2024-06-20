import { OfflineTransactionModel } from "../DbModels/OfflineTransactionModel"
import firestore, { Timestamp } from '@react-native-firebase/firestore'
import { encrypt } from "../utils/encryption"
import { Results } from "realm"
export const syncDb = async ({
    uid, data, isConnected, conversion, currency, realm
}: {
    uid: string,
    data: Results<OfflineTransactionModel>,
    isConnected: boolean,
    conversion: {
        [key: string]: {
            [key: string]: number;
        };
    },
    currency: string,
    realm: Realm
}) => {
    console.log(uid)
    console.log("sync")
    if (data.length > 0 && isConnected) {
        try {
            const batch = firestore().batch();
            data.forEach((item) => {
                if (item.operation === 'add' || item.operation === 'update') {
                    batch.set(firestore().collection('users').doc(uid).collection('transactions').doc(item.id), {
                        amount: encrypt(String((Number(item.amount) / conversion.usd[currency.toLowerCase()]).toFixed(1)), uid),
                        category: encrypt(item.category, uid),
                        desc: encrypt(item.desc, uid),
                        wallet: encrypt(item.wallet, uid),
                        attachement: encrypt(item.attachement!, uid),
                        repeat: item.freq !== undefined,
                        freq: item.freq ? {
                            freq: encrypt(item.freq.freq, uid),
                            month: encrypt(String(item.freq.month), uid),
                            day: encrypt(String(item.freq.day), uid),
                            weekDay: encrypt(String(item.freq.weekDay), uid),
                            end: encrypt(item.freq.end, uid),
                            date: item.freq.date,
                        } : null,
                        id: item.id,
                        timeStamp: Timestamp.now(),
                        type: encrypt(item.type, uid),
                        attachementType: encrypt(item.attachementType, uid),
                        from: encrypt(item.from, uid),
                        to: encrypt(item.to, uid),
                    })
                } else if (item.operation === 'delete') {
                    batch.delete(firestore().collection('users').doc(item.id))
                }
            })
            realm.write(() => {
                realm.delete(data)
            })
            await batch.commit()
            console.log('DB SYNC Done');
        } catch (e) {
            console.log("dskfmnsdfk", e)
        }

    }
}