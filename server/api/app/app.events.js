/**
 * App model events
 */

'use strict';

import {EventEmitter} from 'events';
import App from './app.model';
var AppEvents = new EventEmitter();

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
  App.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    AppEvents.emit(event + ':' + doc._id, doc);
    AppEvents.emit(event, doc);
  }
}

export default AppEvents;
