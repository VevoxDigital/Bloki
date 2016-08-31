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

// Hook SIGINT callback.
const shutdown = (code) => {
  LOG.info('Shutting down...');

  // TODO Shutdown code.

  if (code) {
    if (!ERRORS[code]) code = 'UNKNOWN';
    code = code.toUpperCase();
    LOG.error(`Process exited with not-okay ${code} (code ${ERRORS[code]})`);
  } else LOG.info('Process exited with okay code 0');
  process.exit(code ? ERRORS[code] : 0);
};
process.on('SIGINT', () => {
  console.log(); // Move the ^C to the next line.
  shutdown();
});

// Hook up last-resort callbacks.
process.on('unhandledRejection', (reason, p) => {
  LOG.error('A promise was rejected and no handler was available');
  LOG.error('* because, ' + reason);
  LOG.error('* To prevent ' + 'data loss'.strikethrough + ' depression'.italic + ', the daemon will shut down.');
  // Little humor, there.
  shutdown('UNHANDLED_REJECTION');
});
process.on('uncaughtException', (err) => {
  LOG.error('An exception was raised and no handler was available');
  err.stack.split('\n').forEach((l) => { LOG.error(' > ' + l); });
  LOG.error('* To prevent data loss, the daemon will shut down.');
  shutdown('UNHANDLED_EXCEPTION');
});

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
