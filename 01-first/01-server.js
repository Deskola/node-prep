const http = require('http');
const querystring = require('querystring');
const fs = require('fs');

const port = process.env.PORT || 1337

function repondText(Req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello');
}

function respondJson(req, res) {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ text: 'Hello', numbers: [1, 2, 3] }));
}

function respondNotFound(req, res) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
}

function respondEcho(req, res) {
    const { input = '' } = querystring.parse(
        req.url.split('?').slice(1).join('')
    );

    res.setHeader('Content-Type', 'application/json')
    res.end(
        JSON.stringify({
            normal: input,
            shouty: input.toUpperCase(),
            characterCount: input.length,
            backwards: input.split('').reverse().join('')
        })
    )
}

function respondStatic(req, res) {
    const filename = `${__dirname}/public${req.url.split('/static')[1]}`
    console.log(filename);
    fs.createReadStream(filename).on('error', () => respondNotFound(req, res)).pipe(res);
}

const server = http.createServer(function (req, res) {
    if (req.url === '/') return repondText(req, res);
    if (req.url === '/json') return respondJson(req, res);
    if (req.url.match(/^\/echo/)) return respondEcho(req, res);
    if (req.url.match(/^\/static/)) return respondStatic(req, res);

    respondNotFound(req, res);
});

server.listen(port)
console.log(`Server started at port ${port}`);