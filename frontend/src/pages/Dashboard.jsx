import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest, logout } from "../api";
import { getToday, getYesterday, getMonthKey, money, sumAmounts } from "../utils/dateHelpers";
import StatCard from "../components/StatCard";
import ExpenseForm from "../components/ExpenseForm";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [limitInput, setLimitInput] = useState("");

  //Totals: recalculated automatically on every render.
  const today = getToday();
  const todayTotal = sumAmounts(expenses.filter((e) => e.date === today)); //total amount of expenses for the current day.
  const monthTotal = sumAmounts(expenses.filter((e) => e.date.startsWith(getMonthKey())));
  const dailyLimit = user ? user.dailyLimit : 0;
  const remaining = Math.round((dailyLimit - todayTotal) * 100) / 100;
  const percentUsed = dailyLimit > 0 ? Math.min(100, (todayTotal / dailyLimit) * 100) : 0;

  useEffect(() => {
    async function loadData() {
      try {
        const me = await apiRequest("/auth/me");
        const list = await apiRequest("/expenses");
        setUser(me);
        setExpenses(list); 
        setLimitInput(me.dailyLimit);
      } catch (err) {
        if (err.status === 401) {
          logout();
          navigate("/login");
        } else {
          setError(err.message);
        }
      }
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!user || todayTotal <= user.dailyLimit) return; //

    
    const key = `warned_${user.id}_${today}`; 
    if (localStorage.getItem(key) !== String(todayTotal)) { // if the total we already warned about is not the same as the current total, show the limit exceeded page.
      localStorage.setItem(key, String(todayTotal)); 
      navigate(`/limit-exceeded?spent=${todayTotal}&limit=${user.dailyLimit}`); // navigate to the limit exceeded page.
    }
  }, [todayTotal, user]);

  useEffect(() => {
    if (loading || !user) return;

    const yesterday = getYesterday();
    if (yesterday < user.createdDate) return; //if the account did not exist yet, return.

    const key = `achievement_${user.id}_${yesterday}`;
    if (localStorage.getItem(key)) return; //if the achievement has already been shown, return.
    localStorage.setItem(key, "seen");

    const spent = sumAmounts(expenses.filter((e) => e.date === yesterday));
    if (spent <= user.dailyLimit) {
      navigate(`/achievement?spent=${spent}&limit=${user.dailyLimit}&date=${yesterday}`); // navigate to the achievement page.
    }
  }, [loading]);

  async function handleAdd(description, amount) { //
    const newExpense = await apiRequest("/expenses", "POST", { description, amount, date: getToday() });
    setExpenses([newExpense, ...expenses]); // totals update automatically
  }

  async function handleLimitSave(e) {
    e.preventDefault();
    try {
      const updated = await apiRequest("/auth/limit", "PUT", { dailyLimit: limitInput });
      setUser(updated);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="center-text">Loading your dashboard...</p>;
  if (!user) return <p className="center-text error-text">{error || "Could not load data."}</p>;

  return (
    <div className="container">
      <h1>Welcome, {user.name}! 👋</h1>
      <p className="muted">Here is your spending overview.</p>

      {error && <p className="error-text">{error}</p>}

      <div className="grid-4">
        <StatCard title="Monthly Total" value={money(monthTotal)} icon="📅" color="blue" />
        <StatCard title="Daily Limit" value={money(dailyLimit)} icon="🎯" color="orange" />
        <StatCard title="Today's Total" value={money(todayTotal)} icon="🪙" color={todayTotal > dailyLimit ? "red" : "green"} />
        <StatCard title="Remaining Today" value={money(remaining)} icon="💵" color={remaining < 0 ? "red" : "green"} />
      </div>

      <div className="card progress-card">
        <strong>Today's budget used: {percentUsed.toFixed(0)}%</strong> {/*percentUsed.toFixed(0)}% is the percentage of the daily limit that has been used today.*/}
        <div className="progress">
          <div className={`progress-bar ${todayTotal > dailyLimit ? "over" : ""}`} style={{ width: `${percentUsed}%` }} /> {/*this means that if the today's total is greater than the daily limit, the progress bar will be red, otherwise it will be green.*/}
        </div>
      </div>

      <div className="grid-2"> 
        <ExpenseForm onAdd={handleAdd} />

        <div>
          <div className="card">
            <h3>Past Spending</h3>
            <p className="muted">See your expense history and monthly graph.</p>
            <Link to="/history" className="btn btn-primary">View History & Graph</Link>
          </div>

          <form className="card" onSubmit={handleLimitSave}>
            <h3>Daily Limit</h3>
            <input type="number" value={limitInput} onChange={(e) => setLimitInput(e.target.value)} />
            <button className="btn btn-primary">Update Limit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;