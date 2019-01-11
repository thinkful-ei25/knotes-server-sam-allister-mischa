'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const SoundSchema = mongoose.Schema({
  sound: {
    type: String,
    required: true
  },
  note: {
    type: String,
    required: true
  }
});

SoundSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});
const Sound = mongoose.model('Sound', SoundSchema);

module.exports = Sound;