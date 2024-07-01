import Realm, { ObjectSchema } from 'realm';
export class CategoryModel extends Realm.Object {
    name!: string;
    type!: string;
    static readonly schema: ObjectSchema = {
        name: 'category',
        properties: {
            name: 'string',
            type: 'string',
        },
        primaryKey: 'name',
    };
}
