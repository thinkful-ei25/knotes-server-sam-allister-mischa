'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  }
});

UserSchema.methods.serialize = function(){
  return {
    username: this.username || '',
    name: this.name || '',
    id: this.id || ''
  };
};

UserSchema.methods.validatePassword = function(password){
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.hashPassword = function(password){
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;