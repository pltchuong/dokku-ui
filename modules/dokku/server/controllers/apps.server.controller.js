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
 * Create a App
 */
exports.create = co.wrap(function* (req, res) {

  var cmd, stdout;

  // create and save app to DB
  var app = new App({
    name: req.body.name,
    web_url: `${req.body.name}.${config.dokku.url}`,
    git_url: `dokku@${config.dokku.url}:${req.body.name}`,
  });
  try {
    yield app.save();
  } catch(err) {
    res.status(400).send(err);
  }

  // create and save and execute command
  cmd = new Cmd({
    app: app.id,
    command: `dokku apps:create ${app.name}`
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

  // create and save default domain to DB
  var domain = new Domain({
    app: app.id,
    hostname: `${app.name}.${config.dokku.url}`,
    cname: null,
    kind: 'dokku'
  });
  try {
    yield domain.save();
  } catch(err) {
    res.status(400).send(err);
  }

  // create and save and execute command
  cmd = new Cmd({
    app: app.id,
    command: `dokku domains:add ${app.name} ${domain.hostname}`
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

  app.domains = [domain.id];
  try {
    yield app.save();
  } catch(err) {
    res.status(400).send(err);
  }

  app = yield App.populate(app, [{
    path: 'domains'
  }]);

  // response created app
  res.json(app);

});

/**
 * Show the current App
 */
exports.read = co.wrap(function (req, res) {
  res.json(req.app);
});

/**
 * Delete an App
 */
exports.delete = co.wrap(function* (req, res) {

  // mark app as deleted
  var app = req.app;
  app.deleted = true;
  try {
    yield app.save();
  } catch(err) {
    res.status(400).send(err);
  }

  // create and save and execute command
  var cmd = new Cmd({
    app: app.id,
    command: `echo ${app.name} | dokku apps:destroy ${app.name}`
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

  // permanently delete app
  try {
    yield app.remove();
  } catch(err) {
    res.status(400).send(err);
  }

  // permanently delete domains
  try {
    yield Domain.find({
      app: app.id
    }).remove().exec();
  } catch(err) {
    res.status(400).send(err);
  }
  
  // response deleted app
  res.json(app);

});

/**
 * List of Apps
 */
exports.list = co.wrap(function* (req, res) {
  try {
    var apps = yield App.find().exec();
    res.json(apps || []);
  } catch(err) {
    res.status(400).send(err);
  }
});

/**
 * Find app by name
 */
exports.findAppByIdOrName = co.wrap(function* (req, res, next, appIdOrName) {
  try {
    var app = yield App.findOne({
      $or:[
        { _id : ObjectId.isValid(appIdOrName) ? appIdOrName : null},
        { name: appIdOrName }
      ]
    }).populate('domains').exec();
    if(app) {
      req.app = app;
      next();
    } else {
      res.status(404).send('');
    }
  } catch(err) {
    res.status(400).send(err);
  }
});