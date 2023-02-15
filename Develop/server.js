const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

//Deploying to Heroku, or to run on terminal
const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/pages/notes.html'))
);


//GET route for api notes to read db.json file & return saved notes
app.get('/api/notes', (req, res) => {
  // read the db.json file
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) throw err;

    // parse the data and return all saved notes
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

//POST route to save new note on request body, add to db.json file &return the new note to the client
app.post('api/notes', (req, res) => {
  console.info(`${req.method} request received to add a new note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      review_id: uuid(),
    };

  }});
