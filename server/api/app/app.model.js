'use strict';

import mongoose from 'mongoose';

var AppSchema = new mongoose.Schema({
  _id: String,
  name: String,
  web_url: String,
  git_url: String,
  configs: mongoose.Schema.Types.Mixed,
  domains: [{
    hostname: String,
    cname: String,
    kind: String,
    created_at: Date,
    updated_at: Date
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
