import { Link, Navigate, useSearchParams } from "react-router-dom";
import { money, prettyDate } from "../utils/dateHelpers";

function Achievement() { 
  const [params] = useSearchParams(); // useSearchParams() is a hook that returns the search parameters as an object. it is used here to get the spent, limit and date from the URL. 
  const spent = Number(params.get("spent")); // get the spent from the URL and convert it to a number.
  const limit = Number(params.get("limit")); 
  const date = params.get("date");

  if (!limit || !date) return <Navigate to="/dashboard" />; 

  const saved = Math.round((limit - spent) * 100) / 100;

  return (
    <div className="alert-page green">
      <div className="alert-box">
        <div className="big-emoji">🎉</div>
        <h1>Good job! You saved some money today!</h1>
        <p>On {prettyDate(date)} you spent wisely. 🎉</p> 

        <div className="amount-row">
          <div className="amount-pill">You spent<br /><strong>{money(spent)}</strong></div>
          <div className="amount-pill">💰 You saved<br /><strong>{money(saved)}</strong></div>
        </div>

        <ul className="tips">
          <li> Small savings every day become big savings over time.</li>
          <li> Discipline today builds freedom tomorrow.</li>
        </ul>

        <Link to="/dashboard" className="btn btn-light">Continue to Dashboard</Link>
      </div>
    </div>
  );
}

export default Achievement;