'use strict';

var configs = require('../controllers/configs.server.controller');

module.exports = function(app) {
  app.route('/api/apps/:appIdOrName/configs')
    .get(configs.list)
    .put(configs.update)
  ;
};