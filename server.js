const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Setting Up My Server
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static Middleware
app.use(express.static("public"));

// API "GET" request
app.get("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// API Route | "POST" request
app.post("/api/notes", function (req, res) {
  const newNote = req.body;
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    const notes = JSON.parse(data);
    newNote.id = uuidv4();
    notes.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(notes), function (err) {
      if (err) throw err;
      res.json(notes);
    });
  });
});

// API Route | "DELETE" request
app.delete("/api/notes/:id", function (req, res) {
  const idToDelete = req.params.id;
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    const notes = JSON.parse(data);
    const newNotesData = [];
    for (let i = 0; i < notes.length; i++) {
      if (idToDelete !== notes[i].id) {
        newNotesData.push(notes[i]);
      }
    }
    fs.writeFile("./db/db.json", JSON.stringify(newNotesData), function (err) {
      if (err) throw err;
      res.send("saved");
    });
  });
});
// HTML Routes
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
// Listening
app.listen(PORT, function () {
  console.log("listening on PORT: " + PORT);
});
