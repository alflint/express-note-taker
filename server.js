var fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.static('public'));

// GET routes for html pages
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET all notes
app.get('/api/notes', (req, res) => {
  try{
    res.send(JSON.parse(fs.readFileSync("db/db.json")))
  } catch {
    console.log("An internal server error has occurred.");
    res.sendStatus(500);
  }
});

// CREATE a new note
app.post('/api/notes', (req, res) =>{
  let notes = JSON.parse(fs.readFileSync("db/db.json"))
  notes.push({
    "id": uuidv4(),
    "title": req.body.title,
    "text": req.body.text
  })
  fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
    if(err){
      console.log(`Unable to save to DB: ${err}`);
      res.sendStatus(500);
    }
  })
  res.sendStatus(200);
});

// DELETE a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  let notes = JSON.parse(fs.readFileSync("db/db.json"))
  notes = notes.filter(function( obj ) {
      return obj.id !== id;
  });
  fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
    if(err){
      console.log(`Unable to save to DB: ${err}`);
      res.sendStatus(500);
    }
  })
  res.sendStatus(200);
 });

app.listen(PORT, () => console.log(`Note Taker running on port ${PORT}`));
