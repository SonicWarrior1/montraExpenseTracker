import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { decrypt } from "./encryption";
import { transactionType } from "../defs/transaction";

export async function TransFromJson(json: FirebaseFirestoreTypes.DocumentData, uid: string): Promise<transactionType> {
    return {
        amount: Number(await decrypt(json.amount, uid) ?? json.amount),
        category: await decrypt(json.category, uid) ?? json.category,
        desc: await decrypt(json.desc, uid) ?? json.desc,
        wallet: await decrypt(json.wallet, uid) ?? json.wallet,
        attachement: await decrypt(json.attachement, uid),
        repeat: json.repeat,
        freq: json.freq ? {
            freq: (await decrypt(json.freq.freq, uid) as "yearly" | "monthly" | "weekly" | "daily"),
            month: Number(await decrypt(String(json.freq.month), uid)),
            day: Number(await decrypt(String(json.freq.day), uid)),
            weekDay: Number(await decrypt(String(json.freq.weekDay), uid)),
            end: (await decrypt(json.freq.end, uid) as "date" | "never"),
            date: json.freq.date,
        } : null,
        id: json.id,
        timeStamp: json.timeStamp,
        type: await decrypt(json.type, uid) ?? json.type,
        attachementType: await decrypt(json.attachementType, uid) ?? json.attachementType,
    }
}
