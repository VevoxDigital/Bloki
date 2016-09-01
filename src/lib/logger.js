'use strict';

const winston = require('winston'),
      fs      = require('fs'),
      path    = require('path');

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
