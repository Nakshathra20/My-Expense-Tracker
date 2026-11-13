import { money, prettyDate } from "../utils/dateHelpers";

// Shows the expense history with dates and a delete button.
function ExpenseList({ expenses, onDelete }) { 
  return (
    <div className="card">
      <h3>🧾 Expense History</h3>

      {expenses.length === 0 ? ( 
        <p className="center-text">No expenses yet. Add your first one.</p>
      ) : (
        <div className="expense-list">
          {expenses.map((expense) => (
            <div className="expense-row" key={expense.id}>
              <div className="expense-info">
                <strong>{expense.description}</strong>
                <small>{prettyDate(expense.date)}</small>
              </div>
              <div className="expense-actions">
                <span className="expense-amount">{money(expense.amount)}</span> 
                <button className="btn btn-small btn-danger" onClick={() => onDelete(expense.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpenseList;