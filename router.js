const url = require("url");

const {
    getBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBookById,
} = require("./controllers/bookController");

const {serveSwaggerDocs} = require("./swaggerUi");

const router = (req, res) => {
    const {pathname, query} = url.parse(req.url, true);

    if (pathname === "/swagger.yaml" || pathname.startsWith("/docs")) {
        return serveSwaggerDocs(req, res, pathname);
    }

    const [, base, version, resource, id] = pathname.split("/");

    if (base === "api" && version === "v1" && resource === "books") {
        if (!id) {
            if (req.method === "GET") {
                return getBooks(query, res);
            }
            if (req.method === "POST") {
                return addBook(req, res);
            }
        } else {
            if (req.method === "GET") {
                return getBookById(id, res);
            }
            if (req.method === "PATCH") {
                return updateBook(id, req, res);
            }
            if (req.method === "DELETE") {
                return deleteBookById(id, res);
            }
        }
    }

    res.writeHead(404, {"Content-Type": "application/json"});
    res.end(
        JSON.stringify({
            message: "Route Not Found: Please use the /api/v1/books endpoint",
        })
    );
};

module.exports = router;
