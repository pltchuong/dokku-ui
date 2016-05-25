'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AppSchema = new _mongoose2.default.Schema({
  _id: String,
  name: String,
  web_url: String,
  git_url: String,
  configs: _mongoose2.default.Schema.Types.Mixed,
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

exports.default = _mongoose2.default.model('App', AppSchema);
//# sourceMappingURL=app.model.js.map
