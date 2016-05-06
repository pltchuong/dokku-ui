'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ObjectId = mongoose.Types.ObjectId,
  Cmd = mongoose.model('Cmd'),
  co = require('co');

/**
 * Show the current Cmd
 */
exports.read = co.wrap(function (req, res) {
  res.json(req.cmd);
});

/**
 * List of Cmds
 */
exports.list = co.wrap(function* (req, res) {
  var app = req.app;
  var cmds = yield Cmd.find({
    app: app.id
  });
  res.json(cmds);
});

/**
 * Find cmd by id
 */
exports.findCmdById = co.wrap(function* (req, res, next, cmdId) {
  try {
    var cmd = yield Cmd.findOne({
      $or:[
        { _id : ObjectId.isValid(cmdId) ? cmdId : null},
      ]
    }).populate('domains').exec();
    if(cmd) {
      req.cmd = cmd;
      next();
    } else {
      res.status(404).send('');
    }
  } catch(err) {
    res.status(400).send(err);
  }
});