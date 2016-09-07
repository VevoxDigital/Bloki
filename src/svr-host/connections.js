'use strict';

const _ = require('lodash');

var connected = { };

const self = {
  connect: (daemon) => {
    if (connected[daemon.name()])
      throw new Error('Daemon with given ID already connected: ' + daemon.name());
    connected[daemon.name()] = daemon;
  },
  get: (name) => {
    return connected[name];
  },
  getAll: () => {
    var all = [];
    _.forEach(connected, (d) => { all.push(d); });
    return all;
  },
  disconnect: (name) => {
    const daemon = connected[name];
    if (daemon) {
      daemon.disconnect();
      delete connected[name];
    }
  },
  disconnectAll: () => {
    Object.keys(connected).forEach(self.disconnect);
  }
};

exports = module.exports = self;
