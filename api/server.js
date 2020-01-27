const express = require('express');

const router = require('./router.js');
const middleware = require('./middleware.js')

const server = express();

middleware(server);

server.use('/api', router);

module.exports = server;