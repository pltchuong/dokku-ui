'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserSchema = new _mongoose2.default.Schema({
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

exports.default = _mongoose2.default.model('User', UserSchema);
//# sourceMappingURL=user.model.js.map
