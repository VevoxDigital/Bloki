const codes = [
  'UNHANDLED_REJECTION',
  'UNHANDLED_EXCEPTION',
  'DAEMON_FILES_LOCKED'
];

var i = 0;
global.ERRORS = { };
codes.forEach((code) => {
  ERRORS[code] = i++ + 1000;
});
ERRORS.UNKNOWN = -1;
ERRORS.OKAY = 0;
