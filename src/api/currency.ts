import { QueryBuilder } from 'pocket';
import { ModelKey, NewModelType } from 'pocket/dist/src/definitions/Model';
import Currency from 'src/models/Currency';

async function validate(attributes: NewModelType<Currency>) {
    const requiredFields = ['name', 'code', 'dp', 'symbol',] as ModelKey<Currency>[];
    const missingFields = requiredFields.filter(field => !attributes[field]);
    if (!attributes.id && missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    if (attributes.dp && typeof attributes.dp !== 'number') {
        throw new Error('Decimal places must be a number');
    }
    if (attributes.dp && attributes.dp < 0) {
        throw new Error('Decimal places must be greater than or equal to 0');
    }
    if (attributes.code && typeof attributes.code !== 'string') {
        throw new Error('Code must be a string');
    }
    if (attributes.symbol && typeof attributes.symbol !== 'string') {
        throw new Error('Symbol must be a string');
    }
}

export async function get(id: string): Promise<Currency | undefined> {
    return Currency.find(id);
}

export async function query(queryBuilder: (query: QueryBuilder<Currency>) => QueryBuilder<Currency>): Promise<Currency[]> {
    const query = Currency.query();
    return queryBuilder(query).get();
}

export async function create(attributes: NewModelType<Currency>): Promise<Currency> {
    const currency = new Currency();
    await validate(attributes);
    currency.name = attributes.name;
    currency.code = attributes.code;
    currency.dp = attributes.dp;
    currency.symbol = attributes.symbol;
    await currency.save();
    return currency;
}

export async function remove(currencyId: string): Promise<void> {
    const currency = await Currency.find(currencyId);
    if (!currency) {
        throw new Error('Currency not found');
    }
    return currency.delete();
}