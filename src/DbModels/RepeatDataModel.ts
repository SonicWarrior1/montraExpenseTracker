import Realm, { ObjectSchema } from "realm";
import { TimestampModel } from "./TimestampModel";

export class RepeatDataModel extends Realm.Object {
    freq!: string;
    month?: number;
    day?: number;
    weekDay?: number;
    end!: string;
    date?: TimestampModel;

    static readonly schema: ObjectSchema = {
        name: 'repeat',
        properties: {
            freq: 'string',
            month: 'int',
            day: 'int',
            weekDay: 'int',
            end: 'string',
            date: 'timestamp',
        }
    }
}