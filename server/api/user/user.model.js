'use strict';

import crypto from 'crypto';
import mongoose from 'mongoose';

var UserSchema = new mongoose.Schema({
  _id: String,
  username: {
    type: String,
    unique: true
  },
  email: String,
  salt: String,
  password: String,
  token: String,
  firstName: String,
  lastName: String,
  created_at: Date,
  updated_at: Date
});

UserSchema.pre('save', (next) => {
  if (!this.created_at) {
    this.created_at = Date.now();
  }
  this.updated_at = Date.now();
  next();
});

UserSchema.pre('save', (next) => {
  if (!this.isModified('password')) {
    return next();
  }

  this.makeSalt((saltErr, salt) => {
    if (saltErr) {
      return next(saltErr);
    }
    this.salt = salt;
    this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
      if (encryptErr) {
        return next(encryptErr);
      }
      this.password = hashedPassword;
      next();
    });
  });
});

UserSchema.methods = {
  authenticate(password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        return callback(err);
      }

      if (this.password === pwdGen) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    });
  },

  makeSalt(byteSize, callback) {
    var defaultByteSize = 16;

    if (typeof arguments[0] === 'function') {
      callback = arguments[0];
      byteSize = defaultByteSize;
    } else if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    if (!callback) {
      return crypto
        .randomBytes(byteSize)
        .toString('base64')
      ;
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        callback(err);
      } else {
        callback(null, salt.toString('base64'));
      }
    });
  },

  encryptPassword(password, callback) {
    if (!password || !this.salt) {
      if (!callback) {
        return null;
      } else {
        return callback('Missing password or salt');
      }
    }

    var defaultIterations = 10000;
    var defaultKeyLength = 64;
    var salt = new Buffer(this.salt, 'base64');

    if (!callback) {
      return crypto
        .pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
        .toString('base64')
      ;
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, (err, key) => {
      if (err) {
        callback(err);
      } else {
        callback(null, key.toString('base64'));
      }
    });
  }
};

export default mongoose.model('User', UserSchema);
