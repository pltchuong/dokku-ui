'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Cmd = mongoose.model('Cmd'),
  App = mongoose.model('App'),
  config = require(path.resolve('./config/config')),
  co = require('co'),
  ssh = require('co-ssh')(config.dokku.ssh);

/**
 * Update a Config
 */
exports.update = co.wrap(function* (req, res) {

  var app = req.app;
  var configs, cmd, key, stdout;

  // set configs without restarting app
  configs = [];
  for(key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      configs.push(key + '=' + req.body[key].replace(/\s/g, '\\ '));
      app.configs = [];
    }
  }
  configs = configs.join(' ');
  cmd = new Cmd({
    app: app.id,
    command: `dokku config:set --no-restart ${app.name} ${configs}`
  });
  try {
    yield ssh.connect();
    stdout = yield ssh.exec(cmd.command);
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

  // unset configs withour restarting app
  configs = [];
  for(key in req.body) {
    if (req.body.hasOwnProperty(key) && req.body[key] === 'NULL') {
      configs.push(key);
    }
  }
  configs = configs.join(' ');
  cmd = new Cmd({
    app: app.id,
    command: `dokku config:unset --no-restart ${app.name} ${configs}`
  });
  try {
    yield ssh.connect();
    stdout = yield ssh.exec(cmd.command);
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

  // get app configs and save to DB
  cmd = new Cmd({
    app: app.id,
    command: `dokku config ${app.name}`
  });
  try {
    yield ssh.connect();
    stdout = yield ssh.exec(cmd.command);
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
  } else {
    configs = cmd.stdout.split('\n');
    configs = configs.filter(function(config) {
      return config && config.indexOf('=====> ' + app.name + ' config vars') < 0;
    });
    configs = configs.reduce(function(object, value, i) {
      var pair = value.split(': ');
      if(pair.length === 2) {
        object[pair[0].trim()] = pair[1].trim();
        return object;
      }
    }, {});
    app.configs = configs;
  }
  try {
    yield app.save();
  } catch(err) {
    res.status(400).send(err);
  }

  // restart app
  cmd = new Cmd({
    app: app.id,
    command: `dokku ps:restart ${app.name}`
  });
  try {
    yield ssh.connect();
    stdout = yield ssh.exec(cmd.command);
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

  // return list configs
  res.json(app.configs || []);
});

/**
 * List of Configs
 */
exports.list = co.wrap(function (req, res) {
  res.json(req.app.configs || []);
});