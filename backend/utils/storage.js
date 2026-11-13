// Our "database" is just a file: backend/data/db.json
// readDB()  -> reads the file and gives us the data
// writeDB() -> saves the data back into the file

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

function readDB() {
  // The first time, the file doesn't exist, so we create it.
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], expenses: [] }, null, 2));
  }
  const text = fs.readFileSync(DB_PATH, "utf-8"); // file -> text
  return JSON.parse(text);                        // text -> JavaScript object
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2)); // object -> text -> file
}

module.exports = { readDB, writeDB };