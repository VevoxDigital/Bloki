'use strict';

const winston = require('winston'),
      path    = require('path'),
      fs      = require('fs'),
      config  = require('nconf'),
      colors  = require('colors'),
      Q       = require('q');

// Make sure the logging directory exists...
const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

// Build the logger for immediate use.
global.LOG = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      humanReadableUnhandledException: true
    }),
    new (require('winston-daily-rotate-file'))({
      name: 'daemon-info',
      timestamp: true,
      filename: path.join(logDir, 'daemon-info'),
      json: false,
      zippedArchive: true,
      datePattern: '.yyyy.MM.dd.log'
    }),
    new (require('winston-daily-rotate-file'))({
      name: 'daemon-errors',
      level: 'warning',
      timestamp: true,
      filename: path.join(logDir, 'daemon-errors'),
      json: false,
      zippedArchive: true,
      datePattern: '.yyyy.MM.dd.log'
    })
  ]
});

LOG.info('Loading configuration, please wait...');

config.argv().env().file(path.join(__dirname, '..', 'cfg', 'daemon.json'));
global.IS_MASTER = config.get('master');
LOG.info(`* Init daemon state: ${IS_MASTER ? 'master' : 'slave'}`);

// Load error codes into global.
require('./codes');

// Load handlers for process events.
require('./lib/process-events');

const cmdParser = require('./cmd');
process.stdin.on('data', (data) => {
  const args  = data.toString().slice(0, -1).split(' '),
        cmd   = args.shift();
  LOG.info(`CMD: '${data.toString().slice(0, -1)}'`);
  try {
    cmdParser(cmd, args);
  } catch (e) {
    LOG.error(e.message);
  }
});
