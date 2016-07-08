'use strict';

var path = require('path');
var _ = require('lodash');
var fs = require('fs');

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'dokku-ui-secret'
  },

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  // Email options
  email: {
    smtp: {
      user: 'dokku@imphan.com',
      password: 'PzOAXgUuox13',
      host: 'smtp.mailgun.org',
      tls: 465
    },
    from: 'Phan Chuong <pltchuong@gmail.com>',
    templateDir: __dirname + '/../../views/emails'
  },

  // SSH options
  ssh: {
    host: 'apps.solutionsresource.com',
    username: 'srllc',
    privateKey: fs.readFileSync('/Users/pltchuong/.ssh/id_rsa'),
    passphrase: 'believe9'
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./shared'),
  require('./' + process.env.NODE_ENV + '.js') || {});
