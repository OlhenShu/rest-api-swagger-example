const http = require("http");
const router = require("./router");

const app = http.createServer(router);

module.exports = app;
