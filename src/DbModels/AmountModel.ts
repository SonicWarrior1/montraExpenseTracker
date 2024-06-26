import Realm, { ObjectSchema } from 'realm';
export class AmountModel extends Realm.Object {
    id!: string;
    amount!: number;
    static readonly schema: ObjectSchema = {
        name: 'amount',
        properties: {
            id: 'string',
            amount: 'double'
        },
        primaryKey: 'id',
    };
}
