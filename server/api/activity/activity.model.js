'use strict';

import mongoose from 'mongoose';

var ActivitySchema = new mongoose.Schema({
  _id: String,
  command: String,
  params: String,
  _id: String,
  app: {
    type: String,
    ref: 'App'
  },
  user: {
    type: String,
    ref: 'User'
  },
  created_at: Date,
  updated_at: Date
});

export default mongoose.model('Activity', ActivitySchema);
