const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "db", "tpstime.db");
console.log("📦 Using database at:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Failed to connect to DB:", err.message);
  } else {
    console.log("✅ Connected to SQLite DB.");
  }
});

db.serialize(() => {
  console.log("⚙️ Setting up schedules table...");

  db.run(`
    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      period INTEGER,
      subject TEXT
    )
  `, (err) => {
    if (err) console.error("❌ Failed to create 'schedules' table:", err.message);
    else console.log("✅ 'schedules' table is ready.");
  });
});

module.exports = db;
