# @nora-soderlund/http-early-hints

[![npm (scoped)](https://img.shields.io/npm/v/@nora-soderlund/http-early-hints.svg)](https://www.npmjs.com/package/@nora-soderlund/http-early-hints)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@nora-soderlund/http-early-hints.svg)](https://www.npmjs.com/package/@nora-soderlund/http-early-hints)

Sends a 103 Early Hints header to supported clients.

## Install

```
$ npm install @nora-soderlund/http-early-hints
```

## Usage

```js
const fs = require("fs");

const http = require("http");
const httpServer = http.createServer();
const { httpWriteEarlyHints } = require("@nora-soderlund/http-early-hints");

httpServer.on("request", (request, response) => {
    if(request.url == "/index.html") {
        console.log(`103 Early Hints for ${request.url}`);

        httpWriteEarlyHints(request, response, [
            "</main.css>; rel=preload; as=style"
        ]);

        // process the response

        console.log(`200 OK for ${request.url}`);

        // include the Link headers in the final header for backwards compability

        response.writeHead(200, "OK", {
            //"Content-Type": "text/html; charset=UTF-8",
            "Link": hints
        });

        // response.end();
    }
});

httpServer.listen(80);
```