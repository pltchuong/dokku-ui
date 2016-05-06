'use strict';

var domains = require('../controllers/domains.server.controller');

module.exports = function(app) {
  app.route('/api/apps/:appIdOrName/domains')
    .get(domains.list)
    .post(domains.create)
  ;
  app.route('/api/apps/:appIdOrName/domains/:hostname')
    .get(domains.read)
    .delete(domains.delete)
  ;

  app.param('hostname', domains.findDomainByIdOrHostname);
};