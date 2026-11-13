import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

function Signup() {
  const navigate = useNavigate(); // lets us change the page from code
  const [form, setForm] = useState({ name: "", username: "", password: "", dailyLimit: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // One function for all inputs. e.target.name tells which field changed.
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/signup", "POST", form);
      localStorage.setItem("token", data.token); // save the login ticket to the local storage in order to be able to access the dashboard.
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>Create your account</h2>
        <p className="muted">Start tracking your spending today.</p>

        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} />

        <label>Username</label>
        <input name="username" value={form.username} onChange={handleChange} />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" />

        <label>Daily Expense Limit (₹)</label>
        <input name="dailyLimit" type="number" value={form.dailyLimit} onChange={handleChange} />

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="muted switch-text">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

export default Signup;