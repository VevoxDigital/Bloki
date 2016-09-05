'use strict';

const config  = require('nconf'),
      path    = require('path');

config.file('host', path.join(__dirname, '..', '..', 'cfg', 'host.json'));
config.defaults({ host: { port: 3030 } });

LOG.info('Creating daemon host server');

global.APP = require('http').createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<!DOCTYPE html><html><head></head><body>');
  res.write('Bloki Daemon Host Server');
  // TODO Write some daemon connection info data.
  res.write('</body></html>');
  res.end();
});
const io  = require('socket.io')(APP);

global.DAEMONS = require('./connections');

io.of('/daemon').on('connection', require('./host'));
APP.listen(config.get('host:port'));
LOG.info('* Listening on :' + (config.get('host:port')));
