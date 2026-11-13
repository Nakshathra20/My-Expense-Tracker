import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { sumAmounts, money } from "../utils/dateHelpers";

// Line graph: one point for EVERY day of the chosen month (zero if nothing spent).
// "month" looks like "2026-11".
function ExpenseChart({ expenses, dailyLimit, month }) {
  const [year, monthNumber] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthNumber, 0).getDate(); // 28, 30 or 31
  const data = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${month}-${String(day).padStart(2, "0")}`;
    const total = sumAmounts(expenses.filter((e) => e.date === date));
    data.push({ day, total });
  }

  return (
    <div className="card">
      <h3>📈 Daily Expenses ({month})</h3>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
            <CartesianGrid stroke="#3a4453" strokeDasharray="3 3" />
            <XAxis dataKey="day" stroke="#8b95a3" tick={{ fill: "#c5cdd8" }} label={{ value: "Date (day of month)", position: "insideBottom", offset: -15, fill: "#c5cdd8" }} />
            <YAxis stroke="#8b95a3" tick={{ fill: "#c5cdd8" }} label={{ value: "Amount (₹)", angle: -90, position: "insideLeft", fill: "#c5cdd8" }} />
            <Tooltip
              labelFormatter={(day) => `Day ${day}`}
              formatter={(value) => [money(value), "Spent"]}
              contentStyle={{ background: "#1c222b", border: "1px solid #3a4453", borderRadius: 8, color: "#f4f0e6" }}
              labelStyle={{ color: "#f4f0e6" }}
            />
            <ReferenceLine y={dailyLimit} stroke="#f07167" strokeDasharray="5 5" label={{ value: "Limit", fill: "#f07167" }} />
            <Line type="monotone" dataKey="total" stroke="#e0b15a" strokeWidth={2} dot={{ r: 3, fill: "#e0b15a" }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ExpenseChart;