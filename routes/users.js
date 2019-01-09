'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const User = require('../models/users');
const Note = require('../models/notes');

const router = express.Router();

const jsonParser = bodyParser.json();


/* 
  --> notes.next = null

  --> Note.find --> [notes]
  head = notes[0]

  notes[0].next = notes[1] //-head.next
  notes[1].next = notes[2] //- head.next.next

*/

function getNotes(req,res,next){
  Note.find()
    .then(notes=>{
      let head;
      let i = notes.length-1;
      let temp = [];
      let j = -1;
      while(i>=0){ 
        let note = notes[i];

        let next;
        if(i!==notes.length-1){
          next = temp[j];
        } else {
          next = null;
        }
        let tempNote = {
          note: note.note,
          image: note.image,
          sound: note.sound,
          mScore: 1,
          correct: 0,
          incorrect: 0,
          next: next
        };
        temp.push(tempNote); //[note.next = null, note.next = ]
        j++;
        i--;
      }
      head = temp[j];
      req.head = head;
      next();
    });
}

// Post to register a new user
router.post('/', (jsonParser, getNotes), (req, res) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'name'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  //trim the username and password because dont want white space
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 8,
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, name} = req.body;
  
  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return User.hashPassword(password);
    })
    .then((hash)=>{
      return User.create({
        username,
        password: hash,
        name,
        head: req.head
      });
    })
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      console.log(err);
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
router.get('/', (req, res) => {
  return User.find()
    .then(users => res.json(users.map(user => user.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.get('/:id', (req,res)=>{

});

module.exports = router;