import Realm, { ObjectSchema } from "realm";
import { RepeatDataModel } from "./RepeatDataModel";
import { TimestampModel } from "./TimestampModel";

export class OnlineTransactionModel extends Realm.Object {
    name!: string;
    id!: string ;
    amount!: number ;
    category!: string;
    desc!: string ;
    wallet!: string;
    attachement?: string;
    repeat!: boolean;
    freq?: RepeatDataModel;
    timeStamp!: TimestampModel;
    type!: string ;
    attachementType!: string ;
    from!: string ;
    to!: string ;
    static readonly schema: ObjectSchema = {
        name: 'OnlineTransaction',
        properties: {
            id: 'string',
            amount: 'double',
            category: 'string',
            desc: 'string',
            wallet: 'string',
            attachement: 'string?',
            repeat: 'bool',
            freq:'repeat?',
            timeStamp: 'timestamp',
            type: 'string',
            attachementType: 'string',
            from: 'string',
            to: 'string',
        },
        primaryKey:'id'
    }
}