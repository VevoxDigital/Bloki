'use strict';

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
