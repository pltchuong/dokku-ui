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
  co = require('co'),
  cp = require('child_process');

exports.read = co.wrap(function (req, res) {
  
});

/**
 * Create a Process
 */
exports.restart = co.wrap(function* (req, res) {
  var app = req.app;
  var cmd = new Cmd({
    app: app.id,
    command: `dokku ps:restart ${app.name}`
  });
  try {
    yield cmd.save();
  } catch(err) {
    res.status(400).send(err);
  }

  cp.execFile('node', [path.resolve('./modules/dokku/server/utils/ssh.js'), `cmdId=${cmd.id}`]);

  res.json(cmd);
});

/**
 * Delete an Process
 */
exports.rebuild = co.wrap(function* (req, res) {
  var app = req.app;
  var cmd = new Cmd({
    app: app.id,
    command: `dokku ps:rebuild ${app.name}`
  });
  try {
    yield cmd.save();
  } catch(err) {
    res.status(400).send(err);
  }

  cp.execFile('node', [path.resolve('./modules/dokku/server/utils/ssh.js'), `cmdId=${cmd.id}`]);

  res.json(cmd);
});