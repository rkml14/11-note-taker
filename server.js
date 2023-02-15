//Required libraries 
const express = require('express');
const app = express();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
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
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) throw err;
  
      // parse the data and return all saved notes
      const oldNotes = JSON.parse(data);
      oldNotes.push({
        title:req.body.title,
        text:req.body.text, 
        id:uuidv4()
      });
    fs.writeFile('db/db.json', JSON.stringify(oldNotes, null, 4), (err)=>{
      if (err) throw err; 
      res.json(oldNotes);
    })
    });
});


// working on delete... 
// app.delete('/api/notes/:id')


//Starts the server
app.listen(3001, () => console.log("Server started at port 3001"));