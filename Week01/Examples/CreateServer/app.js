const http = require('http');

const routes = require('./routes');

var server = http.createServer(routes);

server.listen(3000);