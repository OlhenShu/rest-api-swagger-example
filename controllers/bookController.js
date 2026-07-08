const Book = require("../models/bookModel");
const { getPostData } = require("../utils");

const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const getBooks = async (query, res) => {
  const { filterByRead } = query;
  const books =
    filterByRead === "true" || filterByRead === "false"
      ? await Book.findByRead(filterByRead === "true")
      : await Book.findAll();
  sendJson(res, 200, books);
};

const getBookById = async (id, res) => {
  const book = await Book.findById(id);
  if (!book) {
    return sendJson(res, 404, { message: `Book with id ${id} not found` });
  }
  sendJson(res, 200, book);
};

const addBook = async (req, res) => {
  const { title } = JSON.parse(await getPostData(req));
  const book = await Book.create(title);
  sendJson(res, 201, book);
};

const updateBook = async (id, req, res) => {
  const existingBook = await Book.findById(id);
  if (!existingBook) {
    return sendJson(res, 404, { message: `Book with id ${id} not found` });
  }
  const updates = JSON.parse(await getPostData(req));
  const updatedBook = await Book.update(id, updates);
  sendJson(res, 200, updatedBook);
};

const deleteBookById = async (id, res) => {
  const existingBook = await Book.findById(id);
  if (!existingBook) {
    return sendJson(res, 404, { message: `Book with id ${id} not found` });
  }
  await Book.remove(id);
  sendJson(res, 200, { message: `Book with id ${id} was deleted` });
};

module.exports = {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBookById,
};
