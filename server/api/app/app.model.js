'use strict';

import mongoose from 'mongoose';

var AppSchema = new mongoose.Schema({
  _id: String,
  name: String,
  web_url: String,
  git_url: String,
  configs: [mongoose.Schema.Types.Mixed],
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

export default mongoose.model('App', AppSchema);
