const http = require('http');

const routes = require('./prove01-routes');

var server = http.createServer(routes);

server.listen(3000);