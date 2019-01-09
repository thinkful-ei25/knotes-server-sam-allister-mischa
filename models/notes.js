'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

/*
  Note(correct answer)
  image link (question)
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
    type: String
  },
  defaultOrder: {
    type: Number,
    required: true
  },
  mScore: {
    type: Number,
    required: true,
    default: 1
  },
  correct: {
    type: Number,
    required: true,
    default: 0
  },
  incorrect: {
    type: Number,
    required: true,
    default: 0
  }
});

NoteSchema.methods.serialize = function(){
  return {
    note: this.note || '',
    image: this.image || '',
    sound: this.sound || '',
    defaultOrder: this.defaultOrder || 0,
    mScore: this.mScore || 1,
    correct: this.correct || 0,
    incorrect: this.correct || 0
  };
};

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;