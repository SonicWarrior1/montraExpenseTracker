import Realm, {ObjectSchema} from 'realm';

export class ConversionModel extends Realm.Object {
  usd!: {[key: string]: number};
  date!: string;
  static readonly schema: ObjectSchema = {
    name: 'Conversion',
    properties: {
      date: 'string',
      usd: 'mixed{}',
    },
  };
}
