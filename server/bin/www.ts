#!/usr/bin/env node

var app = require('../app');
var http = require('http');

var port = process.env.PORT || 3009;
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('listening', () => {
  console.log(`Server listening on port ${port}`);
});
