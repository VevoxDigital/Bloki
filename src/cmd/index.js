'use strict';

const _ = require('lodash');

const commands = {
  server: {
    parser: require('./cmd-server'),
    aliases: ['svr']
  }
};

// Build command and alias table from the registry.
var _cmdTable = { }, _alsTable = { };
_.forEach(commands, (meta, name) => {
  _cmdTable[name] = meta.parser;
  meta.aliases.forEach((a) => { _alsTable[a] = name; });
  _alsTable[name] = name;
});

// Export calloff function.
exports = module.exports = (cmd, args) => {
  if (!_alsTable[cmd]) throw new Error(`Unknown command ${cmd}. Try 'help' for help.`);
  _cmdTable[_alsTable[cmd]](args);
};
