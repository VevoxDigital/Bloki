'use strict';

const winston = require('winston'),
      path    = require('path'),
      fs      = require('fs');

// Make sure the logging directory exists...
const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

// Build the logger for immediate use.
global.LOG = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      humanReadableUnhandledException: true,
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
      level: 'error',
      timestamp: true,
      filename: path.join(logDir, 'daemon-errors'),
      json: false,
      zippedArchive: true,
      datePattern: '.yyyy.MM.dd.log'
    })
  ]
});

LOG.info('Loading configuration, please wait...');

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
