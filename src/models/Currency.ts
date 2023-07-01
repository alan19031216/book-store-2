import { Model, PocketModel } from "pocket";
import { Translatable } from "src/models/Translatable";

@PocketModel
export default class Currency extends Model {
  name!: Translatable;
  code!: string;
  dp!: number;
  symbol!: string;
}
