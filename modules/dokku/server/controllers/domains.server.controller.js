'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ObjectId = mongoose.Types.ObjectId,
  Cmd = mongoose.model('Cmd'),
  App = mongoose.model('App'),
  Domain = mongoose.model('Domain'),
  config = require(path.resolve('./config/config')),
  co = require('co'),
  ssh = require('co-ssh')(config.dokku.ssh);

/**
 * Create a Domain
 */
exports.create = co.wrap(function* (req, res) {

  var app = req.app;

  // create and save domain to DB
  var domain = new Domain({
    app: app.id,
    hostname: req.body.hostname,
    cname: `${app.name}.${config.dokku.url}`,
    kind: 'custom'
  });
  try {
    yield domain.save();
  } catch(err) {
    res.status(400).send(err);
  }

  // link domain to app
  app.domains.push(domain.id);
  try {
    yield app.save();
  } catch(err) {
    res.status(400).send(err);
  }

  // create and save and execute command
  var cmd = new Cmd({
    app: app.id,
    command: `dokku domains:add ${app.name} ${domain.hostname}`
  });
  try {
    yield ssh.connect();
    var stdout = yield ssh.exec(cmd.command);
    cmd.stdout = stdout;
    cmd.status = 'succeeded';
  } catch(stderr) {
    cmd.stdout = stderr;
    cmd.status = 'failed';
  }
  try {
    yield cmd.save();
  } catch(err) {
    res.status(400).send(err);
  }
  if(cmd.status === 'failed') {
    res.status(400).send(cmd.stdout);
  }

  // response created domain
  res.json(domain);

});

/**
 * Show the current Domain
 */
exports.read = co.wrap(function (req, res) {
  res.json(req.domain);
});

/**
 * Delete an Domain
 */
exports.delete = co.wrap(function* (req, res) {

  var app = req.app;

  // mark domain as deleted
  var domain = req.domain;
  domain.deleted = true;
  try {
    yield domain.save();
  } catch(err) {
    res.status(400).send(err);
  }

  // create and save and execute command
  var cmd = new Cmd({
    app: app.id,
    command: `dokku domains:remove ${app.name} ${domain.hostname}`
  });
  try {
    yield ssh.connect();
    var stdout = yield ssh.exec(cmd.command);
    cmd.stdout = stdout;
    cmd.status = 'succeeded';
  } catch(stderr) {
    cmd.stdout = stderr;
    cmd.status = 'failed';
  }
  try {
    yield cmd.save();
  } catch(err) {
    res.status(400).send(err);
  }
  if(cmd.status === 'failed') {
    res.status(400).send(cmd.stdout);
  }

  // permanently delete domain
  try {
    yield domain.remove();
  } catch(err) {
    res.status(400).send(err);
  }

  // response deleted domain
  res.json(domain);

});

/**
 * List of Domains
 */
exports.list = co.wrap(function (req, res) {
  res.json(req.app.domains || []);
});

/**
 * Find domain by hostname
 */

exports.findDomainByIdOrHostname = co.wrap(function* (req, res, next, domainByIdOrHostname) {
  try {
    var domain = yield Domain.findOne({
      $or:[
        { _id : ObjectId.isValid(domainByIdOrHostname) ? domainByIdOrHostname : null},
        { hostname: domainByIdOrHostname }
      ]
    }).exec();
    if(domain) {
      req.domain = domain;
      next();
    } else {
      res.status(404).send('');
    }
  } catch(err) {
    res.status(400).send(err);
  }
});