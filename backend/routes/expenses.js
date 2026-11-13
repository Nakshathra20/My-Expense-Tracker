// Everything about expenses: list, add, edit, delete.
const express = require("express");
const { readDB, writeDB } = require("../utils/storage");
const requireAuth = require("../middleware/auth");
const router = express.Router();

router.use(requireAuth); // this middleware is used to check if the user is logged in.
router.get("/", (req, res) => { 
  const db = readDB(); 
  const myExpenses = db.expenses.filter((e) => e.userId === req.userId); // get the expenses for the user.
  myExpenses.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)); // sort the expenses by date and id.
  res.json(myExpenses);
});

router.post("/", (req, res) => { 
  const { description, amount, date } = req.body; // get the description, amount and date from the request body.
  const db = readDB(); // read the database.
  const newExpense = {
    id: Date.now().toString(), // generate a unique id for the expense.
    userId: req.userId,
    description: description.trim(), // trim the description by removing whitespace from the beginning and end.
    amount: Number(amount), // convert the amount to a number.
    date: date, // set the date.
  };

  db.expenses.push(newExpense); // add the new expense to the database.
  writeDB(db); // write the database to the file.
  res.status(201).json(newExpense);
});

router.put("/:id", (req, res) => {
  const db = readDB(); 
  const expense = db.expenses.find((e) => e.id === req.params.id && e.userId === req.userId); // find the expense with the given id and user id.
  if (!expense) {
    return res.status(404).json({ message: "Expense not found." });
  }

  if (req.body.description) expense.description = req.body.description.trim();
  if (Number(req.body.amount) > 0) expense.amount = Number(req.body.amount);

  writeDB(db);
  res.json(expense);
});

router.delete("/:id", (req, res) => {
  const db = readDB();
  const index = db.expenses.findIndex((e) => e.id === req.params.id && e.userId === req.userId);
  if (index === -1) { // if the expense is not found, return an error.
    return res.status(404).json({ message: "Expense not found." });
  }

  db.expenses.splice(index, 1); // remove 1 item at that position
  writeDB(db);
  res.json({ message: "Deleted." });
});

module.exports = router;