import { Model, PocketModel } from "pocket";
import { Translatable } from "src/models/Translatable";

@PocketModel
export default class Book extends Model {
  bookName!: string;
  price!: number;
  quantity!: number;
  description!: Translatable;
}
