import { DatabaseManager } from 'pocket';
import { NewModelType } from 'pocket/dist/src/definitions/Model';
import general from 'src';

class Currency extends general.model.Currency { }

const DB_NAME = 'default';
describe('currency api', () => {
    beforeEach(async () => {
        await DatabaseManager.connect(DB_NAME, {
            dbName: DB_NAME,
            adapter: 'memory',
            silentConnect: true,
        });
    });

    it('should not able to create if required fields not fill', async () => {
        try {
            await general.api.currency.create({} as unknown as NewModelType<Currency>);
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).toEqual('Missing required fields: name, code, dp, symbol');
            }
        }
    });

    it('should not able to create if code is not a string', async () => {
        try {
            await general.api.currency.create({
                name: {
                    en: 'test',
                },
                // @ts-ignore
                code: 123,
                symbol: 'test',
                dp: 2,
            });
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).toEqual('Code must be a string');
            }
        }
    });

    it('should not able to create if symbol is not a string', async () => {
        try {
            await general.api.currency.create({
                name: {
                    en: 'test',
                },
                code: 'test',
                // @ts-ignore
                symbol: 123,
                dp: 2,
            });
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).toEqual('Symbol must be a string');
            }
        }
    });

    it('should not able to create if decimal places is not a number', async () => {
        try {
            await general.api.currency.create({
                name: {
                    en: 'test',
                },
                code: 'test',
                symbol: 'test',
                // @ts-ignore
                dp: 'test',
            });
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).toEqual('Decimal places must be a number');
            }
        }
    });

    it('should not able to create if decimal places is less than 0', async () => {
        try {
            await general.api.currency.create({
                name: {
                    en: 'test',
                },
                code: 'test',
                symbol: 'test',
                dp: -1,
            });
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).toEqual('Decimal places must be greater than or equal to 0');
            }
        }
    });

    it('should able to create', async () => {
        const currency = await general.api.currency.create({
            name: {
                en: 'test',
            },
            code: 'test',
            symbol: 'test',
            dp: 2,
        });
        expect(currency).toBeInstanceOf(general.model.Currency);
    });

    it('should not able to remove if currency not found', async () => {
        try {
            await general.api.currency.remove('test');
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).toEqual('Currency not found');
            }
        }
    });

    it('should able to remove', async () => {
        const currency = await general.api.currency.create({
            name: {
                en: 'test',
            },
            code: 'test',
            symbol: 'test',
            dp: 2,
        });
        await general.api.currency.remove(currency.id);
        const currency2 = await general.model.Currency.find(currency.id);
        expect(currency2).toBeUndefined();
    });

    it('should able to get', async () => {
        const currency = await general.api.currency.create({
            name: {
                en: 'test',
            },
            code: 'test',
            symbol: 'test',
            dp: 2,
        });
        const currency2 = await general.api.currency.get(currency.id);
        expect(currency2).toBeInstanceOf(general.model.Currency);
    });

    it('should able to query', async () => {
        const currency = await general.api.currency.create({
            name: {
                en: 'abc',
            },
            code: 'test',
            symbol: 'test',
            dp: 2,
        });
        const currencies = await general.api.currency.query(query => query.where('name.en', 'abc'));
        expect(currencies).toBeInstanceOf(Array);
        expect(currencies.length).toEqual(1);
        expect(currencies[0]).toBeInstanceOf(general.model.Currency);
        expect(currencies[0].id).toEqual(currency.id);
    });
});