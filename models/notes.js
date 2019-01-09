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
    type: String
  },
<<<<<<< HEAD
  next:{
=======
  next: {
>>>>>>> 98110c478782ad2f07bb3369a73e75f63ff24f71
    type: Object
  }
});

NoteSchema.methods.serialize = function(){
  return {
    note: this.note || '',
    image: this.image || '',
    sound: this.sound || '',
    next: this.next || null
  };
};

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;