const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/courses.db");

db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS courses`);

  db.run(`
    CREATE TABLE courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      courseCode TEXT NOT NULL,
      title TEXT NOT NULL,
      credits INTEGER NOT NULL,
      description TEXT NOT NULL,
      semester TEXT NOT NULL
    )
  `);

  console.log("Courses table created.");
});

db.close();
