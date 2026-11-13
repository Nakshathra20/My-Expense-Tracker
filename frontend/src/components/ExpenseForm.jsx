import { useState } from "react";

function ExpenseForm({ onAdd }) { // onAdd is a function that is passed from the Dashboard component
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); // stop the browser from reloading the page
    setError("");

    if (!description.trim() || !(Number(amount) > 0)) {
      setError("Enter a description and an amount greater than 0.");
      return;
    }

    setSaving(true);
    try {
      await onAdd(description.trim(), Number(amount));
      setDescription(""); // clear the inputs
      setAmount("");
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Add Expense</h3>

      <label>Description</label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>Amount (₹)</label>
      <input
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {error && <p className="error-text">{error}</p>}

      <button className="btn btn-primary" disabled={saving}>
        {saving ? "Saving..." : "Add Expense"}
      </button>
    </form>
  );
}

export default ExpenseForm;