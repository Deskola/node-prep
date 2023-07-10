const express = require('express');
const fs = require('fs');

const port = process.env.PORT || 1337

const app = express()

function repondText(Req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello');
}

function respondJson(req, res) {
    res.json({ text: 'Hello', numbers: [1, 2, 3] });
}

function respondNotFound(req, res) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
}

function respondEcho(req, res) {
    const { input = '' } = req.query;
    console.log(input);
    res.json({
        normal: input,
        shouty: input.toUpperCase(),
        characterCount: input.length,
        backwards: input.split('').reverse().join('')
    });
}

function respondStatic(req, res) {
    const filename = `${__dirname}/public/${req.params[0]}`
    fs.createReadStream(filename).on('error', () => respondNotFound(req, res)).pipe(res);
}

app.get("/", repondText);
app.get("/json", respondJson);
app.get("/echo", respondEcho);
app.get("/static/*", respondStatic);

app.listen(port, () => console.log(`Server listening on port ${port}`));


