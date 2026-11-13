import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", "POST", form);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>Welcome!!!!</h2>
        <p className="muted">Log in to your account.</p>

        <label>Username</label>
        <input name="username" value={form.username} onChange={handleChange}  />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="muted switch-text"><Link to="/signup">Create an account</Link></p>
      </form>
    </div>
  );
}

export default Login;