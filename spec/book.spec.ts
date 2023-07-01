import { DatabaseManager } from 'pocket';
import { NewModelType } from 'pocket/dist/src/definitions/Model';
import general from 'src';

class Book extends general.model.Book { }

const DB_NAME = 'default';
describe('book api', () => {
    beforeEach(async () => {
        await DatabaseManager.connect(DB_NAME, {
            dbName: DB_NAME,
            adapter: 'memory',
            silentConnect: true,
        });
    });

    it('should not able to create if required fields not fill', async () => {
        try {
            await general.api.book.create({} as unknown as NewModelType<Book>);
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).toEqual('Missing required fields: bookName, price, quantity, description');
            }
        }
    });

    it('should not be able to create a book if book name is not a string', async () => {
        try {
            await general.api.book.create({
                // @ts-ignore
                bookName: 12345,
                price: 123,
                quantity: 1,
                description: {
                    en: 'This is book description'
                },
            });
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).toEqual('Book name must be a string');
            }
        }
    });

    it('should not be able to create a book if price is not a number', async () => {
        try {
            await general.api.book.create({
                bookName: 'Book A',
                // @ts-ignore
                price: '123',
                quantity: 1,
                description: {
                    en: 'This is book description'
                },
            });
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).toEqual('Price must be a number');
            }
        }
    });

    it('should not be able to create a book if price is a string', async () => {
        try {
            await general.api.book.create({
                bookName: 'Book A',
                // @ts-ignore
                price: '0',
                quantity: 1,
                description: {
                    en: 'This is book description'
                },
            });
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).toEqual('Price must be a number');
            }
        }
    });

    it('should not be able to create a book if price less than 0 or equal to 0', async () => {
        try {
            await general.api.book.create({
                bookName: 'Book A',
                price: -1,
                quantity: 1,
                description: {
                    en: 'This is book description'
                },
            });
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).toEqual('Price must be greater than 0');
            }
        }
    });

    it('should not be able to create a book if price less than 0 or equal to 0', async () => {
        try {
            await general.api.book.create({
                bookName: 'Book A',
                price: 0,
                quantity: 1,
                description: {
                    en: 'This is book description'
                },
            });
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).toEqual('Price must be greater than 0');
            }
        }
    });

    it('should not be able to create a book if quantity is not a number', async () => {
        try {
            await general.api.book.create({
                bookName: 'Book A',
                price: 1,
                // @ts-ignore
                quantity: '0',
                description: {
                    en: 'This is book description'
                },
            });
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).toEqual('Quantity must be a number');
            }
        }
    });

    it('should not be able to create a book if quantity less than 0 or equal to 0', async () => {
        try {
            await general.api.book.create({
                bookName: 'Book A',
                price: 1,
                quantity: -1,
                description: {
                    en: 'This is book description'
                },
            });
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).toEqual('Quantity must be greater than 0');
            }
        }
    });

    it('should not be able to create a book if quantity less than 0 or equal to 0', async () => {
        try {
            await general.api.book.create({
                bookName: 'Book A',
                price: 1,
                quantity: 0,
                description: {
                    en: 'This is book description'
                },
            });
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).toEqual('Quantity must be greater than 0');
            }
        }
    });

    it('should able to create', async () => {
        const book = await general.api.book.create({
            bookName: 'Book A',
            price: 1,
            quantity: 1,
            description: {
                en: 'This is a book description'
            },
        });
        expect(book).toBeInstanceOf(general.model.Book);
    });

    it('should not able to remove if book not found', async () => {
        try {
            await general.api.book.remove('test');
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).toEqual('Book not found');
            }
        }
    });

    it('should able to remove', async () => {
        const book = await general.api.book.create({
            bookName: 'Book A',
            price: 1,
            quantity: 1,
            description: {
                en: 'This is a book description'
            },
        });
        await general.api.book.remove(book.id);
        const book2 = await general.model.Book.find(book.id);
        expect(book2).toBeUndefined();
    });

    it('should able to get', async () => {
        const book = await general.api.book.create({
            bookName: 'Book A',
            price: 1,
            quantity: 1,
            description: {
                en: 'This is a book description'
            },
        });
        const book2 = await general.api.book.get(book.id);
        expect(book2).toBeInstanceOf(general.model.Book);
    });

    it('should able to query', async () => {
        const book = await general.api.book.create({
            bookName: 'Book B',
            price: 1,
            quantity: 1,
            description: {
                en: 'This is a book description'
            },
        });
        const books = await general.api.book.query(query => query.where('bookName', 'Book B'));
        expect(books).toBeInstanceOf(Array);
        expect(books.length).toEqual(1);
        expect(books[0]).toBeInstanceOf(general.model.Book);
        expect(books[0].id).toEqual(book.id);
    });

    it('should able to update', async () => {
        const book = await general.api.book.create({
            bookName: 'Book C',
            price: 1,
            quantity: 1,
            description: {
                en: 'This is a book description'
            },
        });

        const updated_book = await general.api.book.update(book.id, {
            bookName: 'Book C.1',
            price: 100,
            quantity: 200,
            description: {
                en: 'This is a new book description'
            },
        });

        expect(updated_book).toBeInstanceOf(general.model.Book);
        expect(updated_book.bookName).toEqual('Book C.1');
        expect(updated_book.price).toEqual(100);
        expect(updated_book.quantity).toEqual(200);
        expect(updated_book.description).toEqual({
            en: 'This is a new book description'
        });
    });
});