console.log("THIS IS A TEST!!!")
//Required libraries 
const express = require('express');
const app = express();
const fs = require('fs');
const uuid = require('./helpers/uuid');

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

function getDBContent() {
  const dbStr = fs.readFileSync('./db/db.json', 'utf8');
  return JSON.parse(dbStr);
}

//GET route for api notes to read db.json file & return saved notes
app.get('/api/notes', (req, res) => {
    const notes = getDBContent();
    res.json(notes);
});

//POST route to save new note on request body, add to db.json file & return the new note to the client
app.post('/api/notes', (req, res) => {
  console.log(req.body);
  let notes = getDBContent() 
    notes.push({
      title: req.body.title,
      text: req.body.text,
      id: uuid(),
    });
    fs.writeFile('db/db.json', JSON.stringify(notes, null, 4), (err) => {
      if (err) throw err;
      res.json(notes);
    })
});

// DELETE Route for a specific tip
app.delete('/api/notes/:id', (req, res) => {
  const noteID = req.params.id;

   let notes = getDBContent()
   
    notes = notes.filter((note) => note.id !== noteID);

    fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json(notes);
    })
});

//Starts the server
app.listen(3001, () => console.log("Server started at port 3001"));