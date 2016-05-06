'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Cmd Schema
 */
var CmdSchema = new Schema({
  app: {
    type: Schema.Types.ObjectId,
    ref: 'App'
  },
  command: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: ''
  },
  stdout: {
    type: String,
    default: ''
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
});

CmdSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

mongoose.model('Cmd', CmdSchema);