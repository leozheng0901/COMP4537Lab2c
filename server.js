// DISCLAIMER: This file was written with the help of ChatGPT
const http = require('http');
const dt = require('./modules/utils');
const url = require('url');
const language = require('./en.json');
const fs = require('fs');
const PORT = 8000;

class ServerApp {
  constructor(port) {
    this.port = port;
    this.language = language; // Save language configuration
    this.server = http.createServer((req, res) => this.handleRequest(req, res));
    this.server.listen(this.port, () => console.log(`Listening on ${this.port}...`));
  }

  // Main request handler that routes to specific methods
  handleRequest(req, res) {
    res.writeHead(200, {
      "Content-Type": "text/html",
      "Access-Control-Allow-Origin": "*"
    });
    const parsedURL = url.parse(req.url, true);
    const pathname = parsedURL.pathname;
    const trimmedPath = pathname.replace(/^\/+|\/+$/g, "");

    switch (trimmedPath) {
      case "":
        this.handleHome(req, res);
        break;
      case "writeFile":
        this.handleWriteFile(req, res, parsedURL);
        break;
      case "readFile":
        this.handleReadFile(req, res, parsedURL);
        break;
      default:
        res.end("404 Not Found");
        break;
    }
  }

  // Renders the home page with forms for each endpoint
  handleHome(req, res) {
    res.end(`
      <form action="/writeFile" method="GET">
        <fieldset>
          <legend>${this.language.writeLabel}</legend>
          <input type="text" name="message" id="message" placeholder="${this.language.writeMessage}" />
          <label for="message">${this.language.writeLabel}</label>
          <button type="submit">${this.language.writeAction}</button>
        </fieldset>
      </form>
      <form action="/readFile" method="GET">
        <fieldset>
          <button type="submit">${this.language.readAction}</button>
        </fieldset>
      </form>
    `);
  }

  // Handles the /writeFile endpoint by appending content to a file
  handleWriteFile(req, res, parsedURL) {
    const content = parsedURL.query["message"];
    fs.appendFile("/tmp/file.txt", content, (err) => {
      if (err) {
        return res.end("Uh oh error, not poggers");
      }
      return res.end("File update updated, POGGERS!");
    });
  }

  // Handles the /readFile endpoint by reading a file's contents
  handleReadFile(req, res, parsedURL) {
    const fileName = parsedURL.query["file"]; // Get the file name from query
    if (!fileName) {
      return res.end("Error: No file name provided!");
    }

    const filePath = `/tmp/${sanitizedFileName}`;

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.end(`Error: File "${sanitizedFileName}" not found!`);
        }
        return res.end(data);
    });
  }
}

// Instantiate the server
new ServerApp(PORT);
