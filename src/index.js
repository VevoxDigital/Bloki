'use strict';

const path      = require('path'),
      config    = require('nconf'),
      colors    = require('colors'),
      lockFile  = require('lockfile');

// Load in the logger.
require('./lib/logger');

LOG.info('Loading configuration, please wait...');

global.__rootdir = path.join(__dirname, '..');
global.__cfgdir = path.join(__rootdir, 'cfg');

config.argv().env().file(path.join(__cfgdir, 'daemon.json'));
global.IS_MASTER = config.get('master');
LOG.info(`* Init daemon state: ${IS_MASTER ? 'master' : 'slave'}`);

// Load error codes into global.
require('./codes');

// Load handlers for process events.
require('./lib/process-events');

try {
  lockFile.lockSync(path.join(__rootdir, 'daemon.lock'));
} catch (e) {
  LOG.error('Failed to lock daemon files.');
  LOG.error('* Another daemon may be running or a previously crashed.');
  LOG.error('* The \'daemon.lock\' may be deleted to override and continue anyway.');
  SHUTDOWN('DAEMON_FILES_LOCKED');
}

// Load the server base.
if (IS_MASTER) require('./svr-host');
require('./svr');
