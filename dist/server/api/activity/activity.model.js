'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _ref;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ActivitySchema = new _mongoose2.default.Schema((_ref = {
  _id: String,
  command: String,
  params: String
}, (0, _defineProperty3.default)(_ref, '_id', String), (0, _defineProperty3.default)(_ref, 'app', {
  type: String,
  ref: 'App'
}), (0, _defineProperty3.default)(_ref, 'user', {
  type: String,
  ref: 'User'
}), (0, _defineProperty3.default)(_ref, 'created_at', Date), (0, _defineProperty3.default)(_ref, 'updated_at', Date), _ref));

exports.default = _mongoose2.default.model('Activity', ActivitySchema);
//# sourceMappingURL=activity.model.js.map
