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
  _id: String,
  name: String,
  web_url: String,
  git_url: String,
  configs: Schema.Types.Mixed,
  domains: [{
    type: String,
    ref: 'Domain'
  }],
  created_at: Date,
  updated_at: Date
});

AppSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

mongoose.model('App', AppSchema);