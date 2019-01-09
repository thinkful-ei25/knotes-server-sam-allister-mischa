'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  head: {
    type: Object
  }
  //add array for notes(questions)
  //add next to know what question is next
});

UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    name: this.name || '',
    id: this.id || ''
  };
};

UserSchema.methods.serialize2 = function(){
  return {
    username: this.username || '',
    name: this.name || '',
    id: this.id || '',
<<<<<<< HEAD
=======
  
>>>>>>> 98110c478782ad2f07bb3369a73e75f63ff24f71
    head: this.head || ''
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;