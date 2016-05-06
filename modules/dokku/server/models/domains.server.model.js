'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Cmd Schema
 */
var DomainSchema = new Schema({
  app: {
    type: Schema.Types.ObjectId,
    ref: 'App'
  },
  cname: {
    type: String,
    default: ''
  },
  hostname: {
    type: String,
    default: ''
  },
  kind: {
    type: String,
    default: ''
  },
  deleted: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
});

DomainSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

mongoose.model('Domain', DomainSchema);