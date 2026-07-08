const fs = require("fs/promises");
const path = require("path");
const swaggerUiDist = require("swagger-ui-dist");

const swaggerUiPath = swaggerUiDist.absolutePath();
const swaggerYamlPath = path.join(__dirname, "swagger.yaml");

const contentTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".map": "application/json",
  ".yaml": "text/yaml",
};

// Points swagger-ui at our local spec instead of the default petstore demo.
const customInitializer = `window.onload = function() {
  window.ui = SwaggerUIBundle({
    url: "/swagger.yaml",
    dom_id: "#swagger-ui",
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    plugins: [SwaggerUIBundle.plugins.DownloadUrl],
    layout: "StandaloneLayout",
  });
};
`;

const sendFile = async (res, filePath) => {
  const data = await fs.readFile(filePath);
  const contentType = contentTypes[path.extname(filePath)] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": contentType });
  res.end(data);
};

const serveSwaggerDocs = async (req, res, pathname) => {
  try {
    if (pathname === "/swagger.yaml") {
      return await sendFile(res, swaggerYamlPath);
    }

    // index.html uses relative asset paths ("./swagger-ui.css"), which only resolve
    // correctly against a URL that ends in a slash.
    if (pathname === "/docs") {
      res.writeHead(301, { Location: "/docs/" });
      return res.end();
    }

    const asset = pathname === "/docs/" ? "index.html" : pathname.replace("/docs/", "");

    if (asset === "swagger-initializer.js") {
      res.writeHead(200, { "Content-Type": "application/javascript" });
      return res.end(customInitializer);
    }

    await sendFile(res, path.join(swaggerUiPath, asset));
  } catch (error) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not Found" }));
  }
};

module.exports = { serveSwaggerDocs };
