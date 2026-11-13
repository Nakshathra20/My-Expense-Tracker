import { Link, useNavigate, useLocation } from "react-router-dom";
import { getToken, logout } from "../api";

function Navbar() {
  const navigate = useNavigate();
  useLocation();
  const loggedIn = Boolean(getToken());

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">My ExpenseTracker</Link>
      <div className="nav-links">
        {loggedIn ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/history">History</Link>
            <button className="btn btn-outline btn-small" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;