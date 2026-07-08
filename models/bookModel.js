const {v4} = require("uuid");
const {writeBooks, readBooks} = require("../utils");

const findAll = async () => await readBooks();

const findByRead = async (read) => {
    const books = await readBooks();
    return books.filter((book) => book.read === read);
};

const findById = async (id) => {
    const books = await readBooks();
    return books.find((book) => String(book.id) === String(id));
};

const create = async (title) => {
    const books = await readBooks();
    const newBook = {id: v4(), title, read: false};
    books.push(newBook);
    await writeBooks(books);
    return newBook;
};

const update = async (id, updates) => {
    const books = await readBooks();
    const index = books.findIndex((book) => String(book.id) === String(id));
    if (index === -1) {
        return null;
    }
    books[index] = {...books[index], ...updates};
    await writeBooks(books);
    return books[index];
};

const remove = async (id) => {
    const books = await readBooks();
    const filteredBooks = books.filter((book) => String(book.id) !== String(id));
    await writeBooks(filteredBooks);
};

module.exports = {
    findAll,
    findByRead,
    findById,
    create,
    update,
    remove,
};
