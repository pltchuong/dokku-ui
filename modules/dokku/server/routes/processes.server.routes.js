'use strict';

var processes = require('../controllers/processes.server.controller');

module.exports = function(app) {
  app.route('/api/apps/:appIdOrName/processes')
    .get(processes.read)
    .post(processes.restart)
    .delete(processes.rebuild)
  ;
};