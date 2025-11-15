const express = require("express");
const cors = require("cors");
const db = require("./database/db");

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// GET all courses
// ===============================
app.get("/api/courses", (req, res) => {
  db.all("SELECT * FROM courses", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ===============================
// GET one course by ID
// ===============================
app.get("/api/courses/:id", (req, res) => {
  db.get("SELECT * FROM courses WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Course not found" });
    res.json(row);
  });
});

// ===============================
// POST - add new course
// ===============================
app.post("/api/courses", (req, res) => {
  const { courseCode, title, credits, description, semester } = req.body;

  db.run(
    `INSERT INTO courses (courseCode, title, credits, description, semester)
     VALUES (?, ?, ?, ?, ?)`,
    [courseCode, title, credits, description, semester],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ id: this.lastID });
    }
  );
});

// ===============================
// PUT - update course by ID
// ===============================
app.put("/api/courses/:id", (req, res) => {
  const { courseCode, title, credits, description, semester } = req.body;

  db.run(
    `UPDATE courses
     SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ?
     WHERE id = ?`,
    [courseCode, title, credits, description, semester, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Course not found" });

      res.json({ updated: this.changes });
    }
  );
});

// ===============================
// DELETE course by ID
// ===============================
app.delete("/api/courses/:id", (req, res) => {
  db.run(`DELETE FROM courses WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Course not found" });

    res.json({ deleted: this.changes });
  });
});

// ===============================
// Start server
// ===============================
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
