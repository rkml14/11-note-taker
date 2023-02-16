//Required libraries 
const express = require('express');
const app = express();
const fs = require('fs');
// const uuid = require('./helpers/uuid');
const db = require('./db/db.json');
let id = db.length + 1;

//Deploying to Heroku, or to run on terminal
const port = process.env.PORT || 3001;

// Middleware for parsing JSON and url-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET Route for homepage
app.get("/", (req, res) => {
  // Send the index.html file as a response
  res.sendFile(__dirname + "/public/index.html");
});

// GET Route for notes page
app.get('/notes', (req, res) => {
  // Send the notes.html file as a response
  res.sendFile(__dirname + '/public/notes.html');
});

//GET route for api notes to read db.json file & return saved notes
app.get('/api/notes', (req, res) => {
  //Reads the db.json file
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    //Parses the data and returns all saved notes
    const notes = JSON.parse(data);
    res.json(notes);
  });
});


//POST route to save new note on request body, add to db.json file & return the new note to the client
app.post('/api/notes', (req, res) => {
  console.log(req.body);
  fs.readFile('./db/db.json', 'utf8', (err, response) => {
    if (err) throw err;
    //Parses the response data and returns all saved notes
    const oldNotes = JSON.parse(response);
    oldNotes.push({
      title: req.body.title,
      text: req.body.text,
      // note_id:uuid(),
      note_id: id++,
    });
    fs.writeFile('db/db.json', JSON.stringify(oldNotes, null, 4), (err) => {
      if (err) throw err;
      res.json(oldNotes);
    })
  });
});


// DELETE Route for a specific tip
app.delete('/api/notes/:id', (req, res) => {
  const noteID = parseInt(req.params.note_id);
  fs.readFile('./db/db.json', 'utf8', (err, response) => {
    const oldNotes = JSON.parse(response);
    for (var i = 0; i < db.length; i++) {
      if (db[i].id === id) {
        db.splice(i, 1);
      }
      fs.writeFile('db/db.json', JSON.stringify(oldNotes, null, 4), (err) => {
        if (err) throw err;
        res.json(oldNotes);
      })
    }
  });
});


//   fs.writeFile('db/db.json', JSON.stringify(oldNotes, null, 4), (err) => {
//     if (err) throw err;
//     res.json(oldNotes);
//   })
// });

// const noteID = req.params.note_id;
// fs.readFile('./db/notes.json')
//   .then((data) => JSON.parse(data))
//   .then((json) => {
//     // Make a new array of all notes except the one with the ID provided in the URL
//     const result = json.filter((tip) => tip.note_id !== noteID);

//     // Save that array to the filesystem
//     writeToFile('./db/notes.json', result);

// Respond to the DELETE request
// res.json(`Item ${noteID} has been deleted 🗑️`);
// });




//Starts the server
app.listen(3001, () => console.log("Server started at port 3001"));