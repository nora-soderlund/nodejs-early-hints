function httpWriteEarlyHints(request, response, hints) {
    if(request.httpVersion != "1.1")
        throw new Error(`Request HTTP version is not supported (${request.httpVersion})`);

    response._writeRaw(`HTTP/1.1 103 Early Hints\r\n${hints.map((hint) => `Link: ${hint}\r\n`).join('')}\r\n`, 'ascii', undefined);
};

module.exports = {
    httpWriteEarlyHints
};
