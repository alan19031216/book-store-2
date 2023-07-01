import * as currency from "src/api/currency";
import * as book from "src/api/book";

import Currency from "src/models/Currency";
import Book from "src/models/Book";
import Language from "src/models/Language";

export default {
  api: {
    currency: currency,
    book: book,
  },
  model: {
    Currency: Currency,
    Book: Book,
    Language: Language,
  },
};

export * from "./models/TransactionStatus";

import { Translatable as ITranslatable } from "./models/Translatable";
export type Translatable = ITranslatable;
