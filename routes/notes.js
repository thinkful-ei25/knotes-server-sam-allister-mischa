'use strict';
const express = require('express');
const User = require('../models/users');
const Sound = require('../models/sounds');
const router = express.Router();
const passport = require('passport');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));



router.get('/', (req, res, next) => {
  const id = req.user._id;
  User.findOne({ _id: id })
    .then(user => {
      res.json({note: user.head.image, next: user.head.next.image});
    })
    .catch(err=>{
      next(err);
    });
});

router.get('/progress', (req,res)=>{
  const id = req.user._id;
  User.findOne({_id:id})
    .then(user=>{
      let progress = [];
      let currNode = user.head;
      while(currNode!==null){
        let noteScore = {
          note: currNode.note,
          mScore: currNode.mScore,
          correct: currNode.correct,
          incorrect: currNode.incorrect
        };
        progress.push(noteScore);
        currNode = currNode.next;
      }
      return progress;
    })
    .then(arr=>{
      res.json(arr);
    });
});

router.get('/sound', (req,res,next)=>{
  const id = req.user._id;
  User.findOne({_id: id})
    .then(user=>{
      Sound.findOne({note: user.head.note})
        .then(sound=>{
          res.json(sound);
        })
        .catch(err=>{
          next(err);
        });
    })
    .catch(err=>{
      next(err);
    });
});

// update notes with score and update next if btn pressed
router.put('/', (req, res, next) => {
  // update note with score
  const { answer } = req.body;
  const id = req.user._id;
  User.findOne({ _id: id })
    .then(user => {
      let feedback;
      let head = user.head;
      if (answer === head.note) {
        feedback = 'true';
        head.mScore *= 2;
        let index = head.mScore;
        head.correct++;
        let count = 0;
        let temp = head;
        let curr = head;
        head = head.next;
        let prev = null;
        while ((curr !== null) && (count <= index)) {
          prev = curr;
          curr = curr.next;
          count++;
        }
        prev.next = temp;
        temp.next = curr;
      } else {
        feedback = 'false';
        head.mScore = 1;
        let index = head.mScore;
        head.incorrect++;
        let count = 0;
        let temp = head;
        let curr = head;
        head = head.next;
        let prev = null;
        while ((curr !== null) && (count <= index)) {
          prev = curr;
          curr = curr.next;
          count++;
        }
        prev.next = temp;
        temp.next = curr;
      }
      return ({ head, feedback });
    })
    .then(({ head, feedback }) => {
      User.findOneAndUpdate({ _id: id }, { head: head }, { new: true })
        .then(({ head }) => {
          res.json({ next: head.next.image, feedback});
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

module.exports = router;


/*
    [A]




*/