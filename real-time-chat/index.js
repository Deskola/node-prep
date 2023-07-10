const express = require('express');
const fs = require('fs');
const EventEmitter = require('events');

const chatEmitter = new EventEmitter();
const port = process.env.PORT || 1337;

const app = express();

function respondChat(req, res) {
    const { message } = req.query;
    console.log(message)
    chatEmitter.emit('message', message)
    res.end();
}

function respondSSE(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    });

    const onMessage = msg => res.write(`data: ${msg}\n\n`)
    chatEmitter.on('message', onMessage);

    res.on('close', function () {
        chatEmitter.off('message', onMessage)
    });
}

function respondStatic(req, res) {
    const filename = `${__dirname}/public/${req.params[0]}`
    fs.createReadStream(filename).on('error', () => respondNotFound(req, res)).pipe(res);
}

app.get('/chat', respondChat)
app.get('/sse', respondSSE)
app.get('/static/*', respondStatic)

app.listen(port, () => console.log(`Server listening on port ${port}`));