import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { AuthCard, Field } from "./Register";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email.trim(), password);
      sessionStorage.setItem("otpEmail", data.email || email.trim());
      sessionStorage.setItem("otpAction", "login");
      navigate("/verify-otp");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return <AuthCard title="Welcome back" subtitle="Log in to manage your Eventora bookings."><form onSubmit={submit} className="space-y-5"><Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" /><Field label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />{error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="w-full rounded-xl bg-gray-950 px-4 py-3 font-semibold text-white hover:bg-gray-700 disabled:opacity-60">{loading ? "Sending OTP..." : "Continue"}</button></form><p className="mt-6 text-center text-sm text-gray-600">New to Eventora? <Link to="/register" className="font-semibold text-gray-950 hover:underline">Sign Up</Link></p></AuthCard>;
};

export default Login;
