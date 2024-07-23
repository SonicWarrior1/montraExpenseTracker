import Realm, {ObjectSchema} from 'realm';
export class AmountModel extends Realm.Object {
  id!: string;
  amount!: {[key: string]: string};
  static readonly schema: ObjectSchema = {
    name: 'amount',
    properties: {
      id: 'string',
      amount: 'mixed{}',
    },
    primaryKey: 'id',
  };
}
