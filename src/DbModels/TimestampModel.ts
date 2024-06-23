import Realm, { ObjectSchema } from 'realm';

export class TimestampModel extends Realm.Object {
    name!: string;
    seconds!: number;
    nanoseconds!: number;

    static readonly schema: ObjectSchema = {
        name: 'timestamp',
        properties: {
            seconds: 'int',
            nanoseconds: 'int',
        },
    };
}
