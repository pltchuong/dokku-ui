/**
 * Activity model events
 */

'use strict';

import {EventEmitter} from 'events';
import Activity from './activity.model';
var ActivityEvents = new EventEmitter();

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
  Activity.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ActivityEvents.emit(event + ':' + doc._id, doc);
    ActivityEvents.emit(event, doc);
  }
}

export default ActivityEvents;
