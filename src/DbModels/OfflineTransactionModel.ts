import Realm, {ObjectSchema} from 'realm';
import {RepeatDataModel} from './RepeatDataModel';
import {TimestampModel} from './TimestampModel';
import {ConversionModel} from './ConversionModel';

export class OfflineTransactionModel extends Realm.Object {
  name!: string;
  id!: string;
  amount!: number;
  category!: string;
  desc!: string;
  wallet!: string;
  attachement?: string;
  repeat!: boolean;
  freq?: RepeatDataModel;
  timeStamp!: TimestampModel;
  type!: string;
  attachementType!: string;
  from!: string;
  to!: string;
  operation!: string;
  conversion!: ConversionModel;
  static readonly schema: ObjectSchema = {
    name: 'OfflineTransaction',
    properties: {
      id: 'string',
      amount: 'double',
      category: 'string',
      desc: 'string',
      wallet: 'string',
      attachement: 'string?',
      repeat: 'bool',
      freq: 'repeat?',
      timeStamp: 'timestamp',
      type: 'string',
      attachementType: 'string',
      from: 'string',
      to: 'string',
      operation: 'string',
      conversion: 'Conversion',
    },
    primaryKey: 'id',
  };
}
