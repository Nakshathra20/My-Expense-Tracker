import { Link, Navigate, useSearchParams } from "react-router-dom";
import { money } from "../utils/dateHelpers";

function LimitExceeded() {
  const [params] = useSearchParams(); // useSearchParams() is a hook that returns the search parameters as an object. it is used here to get the spent and limit from the URL.
  const spent = Number(params.get("spent")); // get the spent from the URL and convert it to a number.
  const limit = Number(params.get("limit"));

  // If someone opens this page directly, send them to the dashboard.
  if (!spent || !limit) return <Navigate to="/dashboard" />; 

  const exceededBy = Math.round((spent - limit) * 100) / 100; 

  return (
    <div className="alert-page red">
      <div className="alert-box">
        <div className="big-emoji">⚠️</div>
        <h1>Daily Expense Limit Exceeded!</h1>
        <p>You have gone over your budget today!!!😟</p>

        <div className="amount-row">
          <div className="amount-pill">💸 Total spent<br /><strong>{money(spent)}</strong></div>
          <div className="amount-pill">⚠️ Exceeded by<br /><strong>{money(exceededBy)}</strong></div>
        </div>

        <h3>💡 Tips to reduce unnecessary spending</h3>
        <ul className="tips">
          <li>1. Cook at home instead of ordering food.</li>
          <li>2. Wait 24 hours before buying non-essential things.</li>
          <li>3. Use public transport or share rides.</li>
          <li>5. Try to save 10% of your income every month.</li>
        </ul>

        <Link to="/dashboard" className="btn btn-light">Back to Dashboard</Link>
      </div>
    </div>
  );
}

export default LimitExceeded;