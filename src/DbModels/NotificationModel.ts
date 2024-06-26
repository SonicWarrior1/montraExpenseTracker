import Realm, { ObjectSchema } from "realm";
import { TimestampModel } from "./TimestampModel";

export class NotificationModel extends Realm.Object {
    id!: string;
    category!: string
    type!: string
    time!: TimestampModel
    read!: boolean
    percentage!: number
    static readonly schema: ObjectSchema = {
        name: 'notification',
        properties: {
            id: 'string',
            category: 'string',
            type: 'string',
            time: 'timestamp',
            read: 'bool',
            percentage: 'int',
        },
        primaryKey: 'id'
    }
}