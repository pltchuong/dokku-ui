/**
 * App model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _app = require('./app.model');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AppEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
AppEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _app2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    AppEvents.emit(event + ':' + doc._id, doc);
    AppEvents.emit(event, doc);
  };
}

exports.default = AppEvents;
//# sourceMappingURL=app.events.js.map
