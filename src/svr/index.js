'use strict';

const fs      = require('fs'),
      path    = require('path'),
      config  = require('nconf');

const host = Object.keys(JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'cfg', 'daemons.json'))))[0];

setTimeout(() => {
  const socket = require('socket.io-client')('http://' + host + ':' + config.get('port') + '/daemon');

  socket.on('connect', () => { console.log('conn'); });
  socket.on('disconnect', () => { console.log('disconn'); });
  socket.on('event', console.log);

  global.TEST_SOCKET = socket;
}, 1000);
