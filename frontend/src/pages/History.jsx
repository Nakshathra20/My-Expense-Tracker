import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, logout } from "../api";
import { getMonthKey, money, sumAmounts } from "../utils/dateHelpers";
import StatCard from "../components/StatCard";
import ExpenseChart from "../components/ExpenseChart";
import ExpenseList from "../components/ExpenseList";

function History() {
  const navigate = useNavigate(); 
  const [expenses, setExpenses] = useState([]);
  const [dailyLimit, setDailyLimit] = useState(0);
  const [month, setMonth] = useState(getMonthKey()); // e.g. "2026-11"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  useEffect(() => { //load everything from the backend once, when the page opens.
    async function loadData() {
      try {
        const me = await apiRequest("/auth/me");
        const list = await apiRequest("/expenses"); 
        setDailyLimit(me.dailyLimit);
        setExpenses(list);
      } catch (err) {
        if (err.status === 401) {
          logout();
          navigate("/login");
        } else {
          setError(err.message);
        }
      }
      setLoading(false); // which means the data has been loaded to the page.
    }
    loadData();//load the data from the backend.
  }, []);

  const monthExpenses = expenses.filter((e) => e.date.startsWith(month)); //get the expenses for the chosen month.
  const monthTotal = sumAmounts(monthExpenses); //sum up the amounts of the expenses for the chosen month.

  async function handleDelete(id) {
    try {
      await apiRequest(`/expenses/${id}`, "DELETE");
      setExpenses(expenses.filter((e) => e.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="center-text">Loading history...</p>;

  return (
    <div className="container">
      <h1>📊 Spending History</h1>
      <p className="muted">See your past expenses.</p>

      {error && <p className="error-text">{error}</p>}

      <div className="card">
        <label>Choose month</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value || getMonthKey())}
        />
      </div>

      <div className="grid-4">
        <StatCard title="Month Total" value={money(monthTotal)} icon="📅" color="pink" />
        <StatCard title="Expenses Added" value={monthExpenses.length} icon="🧾" color="orange" />
      </div>

      <ExpenseChart expenses={expenses} dailyLimit={dailyLimit} month={month} />
      <ExpenseList expenses={monthExpenses} onDelete={handleDelete} />
    </div>
  );
}

export default History;