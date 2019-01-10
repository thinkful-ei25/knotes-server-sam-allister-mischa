'use strict';
const express = require('express');
const User = require('../models/users');
const router = express.Router();
const passport = require('passport');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));



router.get('/', (req, res) => {
  res.json(req.note);
});

router.get('/first', (req,res)=>{
  const id = req.user.id;
  User.findOne({_id:id})
    .then(user=>{
      return user.head.note;
    })
    .then(note=>{
      res.json(note);
    });
});

router.get('/progress', (req,res)=>{
  const id = req.user.id;
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

/*
    When correct:
    double mScore and increment notes.note.correct by 1
    When incorrect:
    set mScore back to 1 and increment notes.note.incorrect by 1


    Move currentNote to index mScore, next note in index mScore changed to currentNote

    [A,B,C,D,E,F]

    head = A
    A.next = B
    *get question right*
    A.correct++ - done
    A.mScore*2 - WIP
    head = A.next - done
    *loop thru notes*
    temp (D) = notes[A.mScore].next
    notes[A.mScore].next = A
    A.next = temp (D)
    [B,C,A,D,E,F]
*/


router.put('/', (req, res, next) => {
  // update note with score
  const {answer} = req.body;
  const id = req.user.id;
  User.findOne({_id:id})
    .then(user=>{
      let feedback;
      let head = user.head;
      if(answer === head.note){
        feedback = 'true';
        console.log('THIS IS A PRINT:', answer);
        head.mScore *=2;
        let index = head.mScore;
        head.correct++;
        let count = 0;
        let temp = head;
        let curr = head;
        head = head.next;
        let prev = null;
        while((curr!== null)&&(count<=index)){
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
        head.correct++;
        let count = 0;
        let temp = head;
        let curr = head;
        head = head.next;
        let prev = null;
        while((curr!== null)&&(count<=index)){
          prev = curr;
          curr = curr.next;
          count++;
        }
        prev.next = temp;
        temp.next = curr;
      }
      return ({head, feedback});
    })
    .then(({head, feedback}) =>{
      let temp = head;
      let printed = '';
      while(temp){
        printed += temp.note + ' -> ';
        temp = temp.next;
      }
      console.log(printed);
      //   let temp = head;
      //   while(temp !==null){  
      //     console.log(temp.note);
      //     temp = temp.next;
      //   }
      User.findOneAndUpdate({_id:id}, {head : head}, {new: true})
        .then(({head}) => {
          console.log('new head', head.note);
          res.json({head : head.note,feedback});
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

router.get('/', (req,res)=>{
  const id = req.user.id;
  User.findOne({_id:id})
    .then(user=>{
      res.status(200);
      res.json(user.serialize2());
    });
});

module.exports = router;
