const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Update with your MySQL username
  password: "root2000", // Update with your MySQL password
  database: "textpad",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL!");
});

// Login or Register User
app.post("/auth", async (req, res) => {
  const { filename, password } = req.body;

  db.query("SELECT * FROM users WHERE filename = ?", [filename], async (err, results) => {
    if (err) return res.status(500).send("Server error");

    if (results.length > 0) {
      const validPassword = await bcrypt.compare(password, results[0].password);
      if (!validPassword) return res.status(401).send("Incorrect password");

      res.status(200).json({ userId: results[0].id });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query("INSERT INTO users (filename, password) VALUES (?, ?)", [filename, hashedPassword], (err, result) => {
        if (err) return res.status(500).send("Error creating file");

        res.status(201).json({ userId: result.insertId });
      });
    }
  });
});

// Get Notes
app.get("/notes/:userId", (req, res) => {
  const { userId } = req.params;

  db.query("SELECT content FROM notes WHERE user_id = ?", [userId], (err, results) => {
    if (err) return res.status(500).send("Server error");

    res.status(200).json(results[0] || { content: "" });
  });
});

// Save Notes
app.post("/notes", (req, res) => {
  const { userId, content } = req.body;

  db.query(
    "INSERT INTO notes (user_id, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = ?",
    [userId, content, content],
    (err) => {
      if (err) return res.status(500).send("Error saving notes");

      res.status(200).send("Notes saved");
    }
  );
});

// Delete Notes
app.delete("/notes/:userId", (req, res) => {
  const { userId } = req.params;

  db.query("DELETE FROM notes WHERE user_id = ?", [userId], (err) => {
    if (err) return res.status(500).send("Error deleting notes");

    res.status(200).send("Notes deleted");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
