'use strict';

import mongoose from 'mongoose';

var AppSchema = new mongoose.Schema({
  _id: String,
  name: String,
  web_url: String,
  git_url: String,
  configs: mongoose.Schema.Types.Mixed,
  domains: [{
    type: String,
    ref: 'Domain'
  }],
  collaborators: [{
    type: String,
    ref: 'User'
  }],
  created_at: Date,
  updated_at: Date
});

AppSchema.pre('save', function (next) {
  if (!this.created_at) {
    this.created_at = Date.now();
  }
  this.updated_at = Date.now();
  next();
});

export default mongoose.model('App', AppSchema);
