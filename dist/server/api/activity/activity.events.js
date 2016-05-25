/**
 * Activity model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _activity = require('./activity.model');

var _activity2 = _interopRequireDefault(_activity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ActivityEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
ActivityEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _activity2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    ActivityEvents.emit(event + ':' + doc._id, doc);
    ActivityEvents.emit(event, doc);
  };
}

exports.default = ActivityEvents;
//# sourceMappingURL=activity.events.js.map
