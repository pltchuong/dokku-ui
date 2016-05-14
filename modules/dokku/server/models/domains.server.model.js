'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * App Schema
 */
var DomainSchema = new Schema({
  _id: String,
  app: {
    type: String,
    ref: 'App'
  },
  cname: String,
  hostname: String,
  kind: String,
  created_at: Date,
  updated_at: Date
});

DomainSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

mongoose.model('Domain', DomainSchema);