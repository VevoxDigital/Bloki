'use strict';

const fs    = require('fs'),
      path  = require('path'),
      _     = require('lodash');

const Daemon = require('./daemon');

function isAcceptedDaemon(addr) {
  var list = [];
  try {
    list = JSON.parse(fs.readFileSync(path.join(__cfgdir, 'daemons.json')));
  } catch (e) {
    LOG.warn('Could not load accepted daemons list.');
    LOG.warn('All daemons will be considered unacceptable');
    LOG.warn(e.toString());
  }
  var accepted;
  _.forEach(list, (name, a) => { if (addr === a) accepted = name; });
  return accepted;
}

exports = module.exports = (socket) => {

  const addr = socket.request.connection.remoteAddress.split(':').pop();
  LOG.verbose(`CONNECT Socket ${socket.id} (${addr})`);

  if (socket.nsp.name === '/daemon') {
    var name = isAcceptedDaemon(addr);
    if (name) {
      LOG.info(`${'CON'.cyan} ${name}#${addr} `);
      DAEMONS.connect(new Daemon(socket, addr, name));
    } else LOG.warn(`Daemon ${addr} is not on the accepted daemons list`);
  } else LOG.warn(`Socket at ${addr} connected with unknown namespace '${socket.nsp.name}'`);

};
