'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Domain = mongoose.model('Domain'),
  co = require('co');

/**
 * Create a Domain
 */
exports.create = function (req, res) {

};

/**
 * Show the current Domain
 */
exports.read = co.wrap(function (req, res) {
  res.json(req.domain);
});

/**
 * Update a Domain
 */
exports.update = function (req, res) {

};

/**
 * Delete an Domain
 */
exports.delete = function (req, res) {

};

/**
 * List of Domains
 */
exports.list = co.wrap(function* (req, res) {
  try {
    var domains = yield Domain.find({ app: req.app._id }).populate('app', 'name').exec();
    res.json(domains || []);
  } catch(err) {
    res.status(400).send(err);
  }
});

/**
 * Find domain by id or hostname
 */
exports.findDomainByIdOrHostname = co.wrap(function* (req, res, next, domainByIdOrHostname) {
  try {
    var domain = yield Domain.findOne({ $or:[{ _id : domainByIdOrHostname }, { hostname: domainByIdOrHostname }] }).populate('app').exec();
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