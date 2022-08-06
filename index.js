const fs = require("fs");

const http = require("http");
const httpServer = http.createServer();

const supportedFileExtensions = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript"
};

function writeEarlyHints(hints) {

};

httpServer.on("request", (request, response) => {
    console.log(`${request.method} ${request.url}`);

    if(request.url.includes('.')) {
        const extension = request.url.substring(request.url.lastIndexOf('.'));

        if(!supportedFileExtensions.hasOwnProperty(extension)) {
            response.writeHead(400);

            return response.end();
        }

        if(!fs.existsSync(`public/${request.url}`)) {
            response.writeHead(404);

            return response.end();
        }

        // simulate the server processing the request
        if(supportedFileExtensions[extension] == "text/html") {
            console.log(`103 Early Hints for ${request.url}`);

            const hints = [
                "</styles/main.css>; rel=preload; as=style",
                "</scripts/main.js>; rel=preload; as=script"
            ];

            response._writeRaw(`HTTP/1.1 103 Early Hints\r\n${hints.map((hint) => `Link: ${hint}\r\n`).join('')}\r\n`, 'ascii', undefined);

            setTimeout(() => {
                console.log(`200 OK for ${request.url}`);

                response.writeHead(200, "OK", {
                    "Content-Type": supportedFileExtensions[extension],
                    "Link": hints
                });

                return response.end(fs.readFileSync(`public/${request.url}`));
            }, 2000);

            return;
        }

        response.writeHead(200, {
            "Content-Type": supportedFileExtensions[extension]
        });

        return response.end(fs.readFileSync(`public/${request.url}`));
    }
    
    response.writeHead(302, {
        "Location": "/index.html"
    });

    return response.end();
});

httpServer.listen(80);

