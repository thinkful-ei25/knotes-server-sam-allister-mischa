'use strict';
const express = require('express');
const User = require('../models/users');
const router = express.Router();
const passport = require('passport');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

function getNoteAtNext(req, res, next){
  const id = req.user.id;
  User.findOne({_id: id})
    .then((user) => {
      const {notes, next} = user;
      const noteToReturn = notes.filter((note) => {
        if(note.note === next){
          return note;
        }
      });
      req.note = noteToReturn[0];
    })
    .then(() => next())
    .catch(err => next(err));
}


router.get('/', getNoteAtNext, (req, res) => {
  res.json(req.note);
});

function updateInCorrect(req, next, correct = false){
  const id = req.user.id;
  if(correct){
    User.findOneAndUpdate(
      {_id: id, 'notes.note' : req.note.note}, {$inc: {'notes.$.correct' : 1}}, {new: true}
    )
      .then((notes) => {
        return notes;
      })
      .catch(err => console.log('err',err));
  }else{
    User.findOneAndUpdate(
      {_id: id, 'notes.note' : req.note.note}, {$inc: {'notes.$.incorrect' : 1}}, {new: true}
    )
      .then((notes) => {
        console.log('updated notes:', notes)
        return notes;
      })
      .catch(err => console.log('err',err));
  }
}


function updateNext(req, res, next){
  const id = req.user.id;
  User.findOne({_id: id}, {notes: {$elemMatch: {note: req.note.note}}})
    .then((notes) => {
      return notes.notes[0].next;
    })
    .then(nextNote => {
        // console.log('next note is', nextNote);
        return User.findOneAndUpdate({_id: id}, {next: nextNote}, {new: true} );
    })
    .then(updatedNote => {
        // console.log('nooottesss', updatedNote);
        next();
    })
    .catch(err => next(err));
}

// update notes with score and update next if btn pressed
router.put('/', getNoteAtNext, updateNext, (req, res, next) => {
// update note with score
  const {answer} = req.body;
  let notes;
  if(answer === req.note.note){
    notes = updateInCorrect(req, next, true);
  }else{
    notes = updateInCorrect(req, next);  
  }
  res.sendStatus(200);
// update next
});

module.exports = router;
