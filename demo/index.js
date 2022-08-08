const fs = require("fs");

const http = require("http");
const httpServer = http.createServer();
const { httpWriteEarlyHints } = require("./../index.js");

const supportedFileExtensions = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".svg": "image/svg+xml",
    ".png": "image/png"
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
                "</styles/main.min.css>; rel=preload; as=style",
                "<https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css>; rel=preload; as=style",
                //"</scripts/main.js>; rel=preload; as=script"
            ];

            httpWriteEarlyHints(request, response, hints);

            setTimeout(() => {
                console.log(`200 OK for ${request.url}`);

                response.writeHead(200, "OK", {
                    "Content-Type": `${supportedFileExtensions[extension]}; charset=UTF-8`,
                    "Link": hints
                });

                return response.end(fs.readFileSync(`public/${request.url}`));
            }, 5000);

            return;
        }

        response.writeHead(200, {
            "Content-Type": `${supportedFileExtensions[extension]}; charset=UTF-8`
        });

        return response.end(fs.readFileSync(`public/${request.url}`));
    }
    
    response.writeHead(302, {
        "Location": "/index.html"
    });

    return response.end();
});

httpServer.listen(80);

