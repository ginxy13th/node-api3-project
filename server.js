const express = require('express');
const helmet = require('helmet');
const server = express();
const date = Date.now();

server.use(helmet());
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
    console.log(`a ${req.method} request was made to ${req.url} at ${date}`)
    next();
  }

module.exports = server;