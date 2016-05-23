'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  App = mongoose.model('App'),
  co = require('co');

/**
 * Create a App
 */
exports.create = function (req, res) {

};

/**
 * Show the current App
 */
exports.read = co.wrap(function (req, res) {
  res.json(req.app);
});

/**
 * Update a App
 */
exports.update = co.wrap(function* (req, res) {
  try {
    yield App.findOneAndUpdate({ _id: req.body._id }, req.body);
    res.json(req.body);
  } catch(err) {
    res.status(400).send(err);
  }
});

/**
 * Delete an App
 */
exports.delete = function (req, res) {

};

/**
 * List of Apps
 */
exports.list = co.wrap(function* (req, res) {
  try {
    var apps = yield App.find().populate('domains').exec();
    res.json(apps || []);
  } catch(err) {
    res.status(400).send(err);
  }
});

/**
 * Find app by id or name
 */
exports.findAppByIdOrName = co.wrap(function* (req, res, next, appIdOrName) {
  try {
    var app = yield App.findOne({ $or:[{ _id : appIdOrName }, { name: appIdOrName }] }).populate('domains').populate('collaborators').exec();
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