'use strict';

const path    = require('path'),
      config  = require('nconf'),
      colors  = require('colors');

// Load in the logger.
require('./lib/logger');

LOG.info('Loading configuration, please wait...');

global.__cfgdir = path.join(__dirname, '..', 'cfg');

config.argv().env().file(path.join(__cfgdir, 'daemon.json'));
global.IS_MASTER = config.get('master');
LOG.info(`* Init daemon state: ${IS_MASTER ? 'master' : 'slave'}`);

// Load error codes into global.
require('./codes');

// Load handlers for process events.
require('./lib/process-events');

// Load the server base.
if (IS_MASTER) require('./svr-host');
require('./svr');
