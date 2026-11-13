// Signup, login, get my profile, change daily limit.

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readDB, writeDB } = require("../utils/storage");
const requireAuth = require("../middleware/auth");

const router = express.Router();

function cleanUser(user) { // this function is used to clean the user object by removing the password.
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    dailyLimit: user.dailyLimit,
    createdDate: user.createdDate,
  };
}

function makeToken(user) { // this function is used to create a token for the user. token is used to authenticate the user.
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/signup", async (req, res) => { // 
  const { name, username, password, dailyLimit } = req.body; // get the name, username, password and daily limit from the request body.

  if (!name || !username || !password) { 
    return res.status(400).json({ message: "Please fill in all fields." });
  }
  if (!(Number(dailyLimit) > 0)) { // if the daily limit is not more than 0, return an error.
    return res.status(400).json({ message: "Daily limit must be more than 0." });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  const db = readDB(); // read the database. Database is a JSON file that contains the users.
  const cleanUsername = username.trim().toLowerCase(); // clean the username by trimming and converting to lowercase. This is done to avoid case sensitivity.
  const alreadyExists = db.users.find((u) => u.username === cleanUsername); // check if the username is already used by another user.
  if (alreadyExists) { // if the username is already used, return an error.
    return res.status(409).json({ message: "That username is already taken, try different one." });
  }
  const passwordHash = await bcrypt.hash(password, 10); // bcrypt is an object that has a method called hash that takes two arguments: the password and the number of rounds to hash the password.
  const newUser = {
    id: Date.now().toString(), // generate a unique id for the user.
    name: name.trim(), // trim the name by removing whitespace from the beginning and end.
    username: cleanUsername,
    passwordHash: passwordHash,
    dailyLimit: Number(dailyLimit),
    createdDate: new Date().toLocaleDateString("en-CA"), // en-CA is the format of the date.
  };

  db.users.push(newUser); // add the new user to the database.
  writeDB(db); // write the database to the file.

  res.status(201).json({ token: makeToken(newUser), user: cleanUser(newUser) });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const db = readDB(); 

  const user = db.users.find((u) => u.username === String(username || "").trim().toLowerCase());
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const passwordIsCorrect = await bcrypt.compare(String(password || ""), user.passwordHash); // compare the typed password with the scrambled one.
  if (!passwordIsCorrect) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  res.json({ token: makeToken(user), user: cleanUser(user) });
});

router.get("/me", requireAuth, (req, res) => { // this route is used to get the user's profile.
  const user = readDB().users.find((u) => u.id === req.userId);
  if (!user) {
    return res.status(401).json({ message: "User not found. Please log in again." });
  }
  res.json(cleanUser(user));
});

router.put("/limit", requireAuth, (req, res) => { // this route is used to change the user's daily limit.
  const newLimit = Number(req.body.dailyLimit);
  if (!(newLimit > 0)) {
    return res.status(400).json({ message: "Daily limit must be more than 0." });
  }

  const db = readDB();
  const user = db.users.find((u) => u.id === req.userId);
  user.dailyLimit = newLimit;
  writeDB(db);

  res.json(cleanUser(user));
});

module.exports = router;