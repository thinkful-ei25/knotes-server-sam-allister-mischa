'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

/*
  Note(correct answer)
  image link
  wav sound
*/

const NoteSchema = mongoose.Schema({
  note: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  sound: {
    type: Object
  }
});

NoteSchema.methods.serialize = function(){
  return {
    note: this.note || '',
    image: this.image || '',
    sound: this.sound || ''
  };
};

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;