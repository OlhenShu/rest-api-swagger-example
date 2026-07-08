const request = require("supertest");
jest.mock("fs/promises");
const fs = require("fs/promises");

let app = require("../app");
const booksFilePath = `./data/books.json`;

let mockBooks;

fs.readFile.mockImplementation(
  jest.fn((filePath) => {
    if (filePath === booksFilePath) {
      return Promise.resolve(JSON.stringify(mockBooks));
    }
  })
);

fs.writeFile.mockImplementation(
  jest.fn((filePath, newBooks) => {
    if (filePath === booksFilePath) {
      mockBooks = JSON.parse(newBooks);
      return Promise.resolve();
    }
  })
);

describe("GET /api/v1/books", () => {
  it("responds with 200 status code and 1 book", async () => {
    mockBooks = [1];
    const response = await request(app).get("/api/v1/books");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });
  it("responds with 200 status code and 2 books", async () => {
    mockBooks = [1, 2];
    const response = await request(app).get("/api/v1/books");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });
});

describe("GET /api/v1/books/{id}", () => {
  it("responds with 200 status code and 1 book", async () => {
    mockBooks = [
      {
        id: 1,
        title: "Dune",
        read: false,
      },
    ];
    const response = await request(app).get("/api/v1/books/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockBooks[0]);
  });
  it("It should return 404 status code with message", async () => {
    const response = await request(app).get(`/api/v1/books/non-exist-id`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Book with id non-exist-id not found");
  });
});

describe("POST /api/v1/books", () => {
  let bookId;
  const newBook = { title: "New book" };
  it("It should create and return new book", async () => {
    const response = await request(app).post("/api/v1/books").send(newBook);
    expect(response.statusCode).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.title).toBe("New book");
    expect(response.body.read).toBe(false);
    bookId = response.body.id;
  });
  it("It should return created book in list of all books", async () => {
    const response = await request(app).get("/api/v1/books");
    expect(response.statusCode).toBe(200);
    const createdBook = response.body.find((book) => book.id === bookId);
    expect(createdBook.title).toEqual(newBook.title);
  });
  it("It should return created book by its` id", async () => {
    const response = await request(app).get(`/api/v1/books/${bookId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      title: newBook.title,
      id: bookId,
      read: false,
    });
  });
});

describe("PATCH /api/v1/books/{id}", () => {
  it("It should update a book with new title and read", async () => {
    mockBooks = [
      {
        id: 42,
        title: "Dune",
        read: false,
      },
    ];
    const response = await request(app)
      .patch(`/api/v1/books/42`)
      .send({ title: "Updated book", read: true });
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Updated book");
    expect(response.body.read).toBe(true);
  });
  it("It should update a book with only read", async () => {
    mockBooks = [
      {
        id: 43,
        title: "Dune",
        read: false,
      },
    ];
    const response = await request(app)
      .patch(`/api/v1/books/43`)
      .send({ read: true });
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(mockBooks[0].title);
    expect(response.body.read).toBe(true);
  });
  it("It should return 404 status code with message", async () => {
    const response = await request(app)
      .patch(`/api/v1/books/non-exist-id`)
      .send({ title: "Updated book", read: true });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Book with id non-exist-id not found");
  });
});

describe("DELETE /api/v1/books/{id}", () => {
  it("It should delete book with id 1 and return 200 status code with message", async () => {
    mockBooks = [
      {
        id: 1,
        title: "Dune",
        read: false,
      },
    ];
    const response = await request(app).delete(`/api/v1/books/1`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Book with id 1 was deleted");
  });

  it("It should not exist book with id 1 after it is deleted", async () => {
    const response = await request(app).get(`/api/v1/books/1`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Book with id 1 not found");
  });

  it("It should return 404 status code with message", async () => {
    const response = await request(app).delete(`/api/v1/books/non-exist-id`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Book with id non-exist-id not found");
  });
});
