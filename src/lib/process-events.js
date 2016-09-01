'use strict';

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
