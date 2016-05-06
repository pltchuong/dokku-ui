'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * App Schema
 */
var AppSchema = new Schema({
  name: {
    type: String,
    default: '',
    unique: true
  },
  web_url: {
    type: String,
    default: ''
  },
  git_url: {
    type: String,
    default: ''
  },
  configs: {
    type: Schema.Types.Mixed
  },
  domains: [{
    type: Schema.Types.ObjectId,
    ref: 'Domain'
  }],
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

AppSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

mongoose.model('App', AppSchema);
