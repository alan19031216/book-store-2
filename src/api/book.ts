import { QueryBuilder } from 'pocket';
import { ModelKey, NewModelType } from 'pocket/dist/src/definitions/Model';
import Book from 'src/models/Book';

async function validate(attributes: NewModelType<Book>) {
    const requiredFields = ['bookName', 'price', 'quantity', 'description',] as ModelKey<Book>[];
    const missingFields = requiredFields.filter(field => !attributes[field]);
    if (!attributes.id && missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    if (attributes.bookName && typeof attributes.bookName !== 'string') {
        throw new Error('Book name must be a string');
    }
    if (attributes.price && typeof attributes.price !== 'number') {
        throw new Error('Price must be a number');
    }
    if (attributes.price && attributes.price <= 0) {
        throw new Error('Price must be greater than 0');
    }
    if (attributes.quantity && typeof attributes.quantity !== 'number') {
        throw new Error('Quantity must be a number');
    }
    if (attributes.quantity && attributes.quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
    }
}

export async function get(id: string): Promise<Book | undefined> {
    return Book.find(id);
}

export async function query(queryBuilder: (query: QueryBuilder<Book>) => QueryBuilder<Book>): Promise<Book[]> {
    const query = Book.query();
    return queryBuilder(query).get();
}

export async function create(attributes: NewModelType<Book>): Promise<Book> {
    const book = new Book();
    await validate(attributes);
    book.bookName = attributes.bookName;
    book.price = attributes.price;
    book.quantity = attributes.quantity;
    book.description = attributes.description;
    await book.save();
    return book;
}

export async function remove(bookId: string): Promise<void> {
    const book = await Book.find(bookId);
    if (!book) {
        throw new Error('Book not found');
    }
    return book.delete();
}

export async function update(attributes: NewModelType<Book>): Promise<Book> {
    const book = await Book.find(attributes.id);
    await validate(attributes);
    if (!book) {
        throw new Error('Book not found');
    }
    
    book.bookName = attributes.bookName;
    book.price = attributes.price;
    book.quantity = attributes.quantity;
    book.description = attributes.description;
    await book.save();
    return book;
}