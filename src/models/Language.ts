import { Model, PocketModel } from 'pocket';

@PocketModel
export default class Language extends Model {
    name!: string;
    code!: string;
}