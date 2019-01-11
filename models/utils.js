// const mongoose = require('mongoose');

// const { DATABASE_URL } = require('../config');
// const Sound = require('./sounds');

const fs = require('fs');
// const file = process.argv[2];
const dataA = fs.readFileSync('/Users/misch/Thinkful/week14/knotes-server-sam-allister-mischa/db/seed/a-note.mp3');

const dataB = fs.readFileSync('/Users/misch/Thinkful/week14/knotes-server-sam-allister-mischa/db/seed/b-note.mp3');

const dataC = fs.readFileSync('/Users/misch/Thinkful/week14/knotes-server-sam-allister-mischa/db/seed/c-note.mp3');

const dataD = fs.readFileSync('/Users/misch/Thinkful/week14/knotes-server-sam-allister-mischa/db/seed/d-note.mp3');

const dataE = fs.readFileSync('/Users/misch/Thinkful/week14/knotes-server-sam-allister-mischa/db/seed/e-note.mp3');

const dataF = fs.readFileSync('/Users/misch/Thinkful/week14/knotes-server-sam-allister-mischa/db/seed/f-note.mp3');

const dataG = fs.readFileSync('/Users/misch/Thinkful/week14/knotes-server-sam-allister-mischa/db/seed/g-note.mp3');


const aNoteMp3 = dataA.toString('base64');
const bNoteMp3 = dataB.toString('base64');
const cNoteMp3 = dataC.toString('base64');
const dNoteMp3 = dataD.toString('base64');
const eNoteMp3 = dataE.toString('base64');
const fNoteMp3 = dataF.toString('base64');
const gNoteMp3 = dataG.toString('base64');
const mp3 = [aNoteMp3, bNoteMp3, cNoteMp3, dNoteMp3, eNoteMp3, fNoteMp3, gNoteMp3]

const notes = ['A','B','C','D','E','F','G'];

const jsonFormatted = notes.map((note, i) =>  (
  {
    note,
    sound: mp3[i]
  }
  )
);
console.log(jsonFormatted)

fs.writeFile('notes.json', JSON.stringify(jsonFormatted), err=>{
  if (err) throw err;
  console.log('save!')
})



// mongoose.connect(DATABASE_URL)
//   .then(() => {
//     return Sound.insertMany({note: 'A', sound: aNoteMp3});
    
//   })
//   .then((result ) => console.log(result))
//   .then(() => mongoose.disconnect())
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });
//   {
//     "_id" : ObjectId("5c3514c6f883ab5b0ae9a411"),
//     "note" : "A",
//     "image" : "https://i.imgur.com/5kzYKMt.png",
//     "sound" : ""
// }
