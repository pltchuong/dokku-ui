'use strict';

import mongoose from 'mongoose';

var UserSchema = new mongoose.Schema({
  _id: String,
  username: {
    type: String,
    unique: true
  },
  email: String,
  firstName: String,
  lastName: String,
  created_at: Date,
  updated_at: Date
});

UserSchema.pre('save', function (next) {
  if (!this.created_at) {
    this.created_at = Date.now();
  }
  this.updated_at = Date.now();
  next();
});

export default mongoose.model('User', UserSchema);
