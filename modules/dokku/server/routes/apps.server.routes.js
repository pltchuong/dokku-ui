'use strict';

var apps = require('../controllers/apps.server.controller');

module.exports = function(app) {
  app.route('/api/apps')
    .get(apps.list)
    .post(apps.create)
  ;
  app.route('/api/apps/:appIdOrName')
    .get(apps.read)
    .put(apps.update)
    .delete(apps.delete)
  ;

  app.param('appIdOrName', apps.findAppByIdOrName);
};