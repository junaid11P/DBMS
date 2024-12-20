import express from "express";
import mysql from "mysql2/promise";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
const PORT = 3306;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = await mysql.createConnection({
  host: "localhost",
  user: "root", // Update with your MySQL username
  password: "root2000", // Update with your MySQL password
  database: "textpad",
});

// Login or Register User
app.post("/auth", async (req, res) => {
  const { filename, password } = req.body;

  try {
    const [results] = await db.query("SELECT * FROM users WHERE filename = ?", [filename]);

    if (results.length > 0) {
      const validPassword = await bcrypt.compare(password, results[0].password);
      if (!validPassword) return res.status(401).send("Incorrect password");

      return res.status(200).json({ userId: results[0].id });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [insertResult] = await db.query("INSERT INTO users (filename, password) VALUES (?, ?)", [
      filename,
      hashedPassword,
    ]);

    res.status(201).json({ userId: insertResult.insertId });
  } catch (err) {
    res.status(500).send("Error creating file");
  }
});

// Get Notes
app.get("/notes/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [results] = await db.query("SELECT content FROM notes WHERE user_id = ?", [userId]);
    res.status(200).json(results[0] || { content: "" });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Save Notes
app.post("/notes", async (req, res) => {
  const { userId, content } = req.body;

  try {
    await db.query(
      "INSERT INTO notes (user_id, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = ?",
      [userId, content, content]
    );
    res.status(200).send("Notes saved");
  } catch (err) {
    res.status(500).send("Error saving notes");
  }
});

// Delete Notes
app.delete("/notes/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    await db.query("DELETE FROM notes WHERE user_id = ?", [userId]);
    res.status(200).send("Notes deleted");
  } catch (err) {
    res.status(500).send("Error deleting notes");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
