'use strict';

exports = module.exports = function (socket, addr, name) {
  const self = this;

  socket.on('disconnect', () => {
    LOG.info('D/C'.magenta + ` ${name}#${addr}`);
  })

  self.name = () => { return name; }
  self.addr = () => { return addr; }

  self.disconnect = () => {
    socket.disconnect();
  }

  return this;
}
