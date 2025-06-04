const { EventEmitter } = require('events');

// Create a new instance of EventEmitter
const emitter = new EventEmitter();

// Define a function to emit events
function emitEvent(eventName, eventData) {
  emitter.emit(eventName, eventData);
}

module.exports = { emitter, emitEvent };
