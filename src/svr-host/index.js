'use strict';

const config  = require('nconf'),
      path    = require('path');

config.file('host', path.join(__dirname, '..', '..', 'cfg', 'host.json'));
config.defaults({ host: { port: 3030 } });

LOG.info('Creating daemon host server');

global.APP = require('http').createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<!DOCTYPE html><html><head></head><body>');
  res.write('<h1>Bloki Daemon Host Server</h1>');

  res.write('<h2>Connected Daemons</h2>');
  res.write('<table><thead><tr>');
    res.write('<td>Daemon ID</td>');
    res.write('<td>Address</td>');
    res.write('<td>Servers</td>');
  res.write('</tr></thead><tbody>');
    DAEMONS.getAll().forEach((d) => {
      res.write('<tr>');
        res.write('<td>' + d.name() + '</td>');
        res.write('<td>' + d.addr() + '</td>');
        res.write('<td>0</td>');
      res.write('</tr>');
    });
  res.write('</tbody></table>');

  res.write('</body></html>');
  res.end();
});
const io  = require('socket.io')(APP);

global.DAEMONS = require('./connections');

io.of('/daemon').on('connection', require('./host'));
APP.listen(config.get('host:port'));
LOG.info('* Listening on :' + (config.get('host:port')));
