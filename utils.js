const fs = require("fs/promises");
const booksFilePath = `./data/books.json`;

exports.readBooks = async () => {
  const data = await fs.readFile(booksFilePath);
  return JSON.parse(data);
};

exports.writeBooks = async (books) => {
  await fs.writeFile(booksFilePath, JSON.stringify(books), "utf8");
};

exports.getPostData = (req) => {
  return new Promise((resolve, reject) => {
    try {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        resolve(body);
      });
    } catch (error) {
      reject(error);
    }
  });
};
