import Realm, {ObjectSchema} from 'realm';
export class BudgetModel extends Realm.Object {
  alert!: boolean;
  limit!: number;
  percentage!: number;
  id!: string;
  conversion!: {[key: string]: number};
  delete!: boolean;
  static readonly schema: ObjectSchema = {
    name: 'budget',
    properties: {
      alert: 'bool',
      limit: 'double',
      percentage: 'int',
      id: 'string',
      delete: 'bool',
      conversion: 'mixed{}',
    },
    primaryKey: 'id',
  };
}
