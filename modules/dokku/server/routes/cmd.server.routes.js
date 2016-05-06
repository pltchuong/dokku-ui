'use strict';

var cmd = require('../controllers/cmd.server.controller');

module.exports = function(app) {
  app.route('/api/apps/:appIdOrName/cmds')
    .get(cmd.list)
  ;
  app.route('/api/apps/:appIdOrName/cmds/:cmdId')
    .get(cmd.read)
  ;

  app.param('cmdId', cmd.findCmdById);
};
