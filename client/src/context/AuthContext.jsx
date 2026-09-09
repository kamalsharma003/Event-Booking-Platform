import { createContext, useEffect, useState } from "react";
import api from "../utils/axios";
export const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { try { const saved = localStorage.getItem("user"); setUser(saved ? JSON.parse(saved) : null); } catch { localStorage.removeItem("user"); } finally { setLoading(false); } }, []);
  const saveSession = (data) => { if (data.user && data.token) { setUser(data.user); localStorage.setItem("user", JSON.stringify(data.user)); localStorage.setItem("token", data.token); } };
  const register = async (name, email, password) => (await api.post("/auth/register", { name, email, password })).data;
  const verifyOtp = async (email, otp) => { const { data } = await api.post("/auth/verify", { email, otp }); saveSession(data); return data; };
  const login = async (email, password) => { const { data } = await api.post("/auth/login", { email, password }); saveSession(data); return data; };
  const logout = () => { setUser(null); localStorage.removeItem("user"); localStorage.removeItem("token"); };
  return <AuthContext.Provider value={{ user, loading, login, register, verifyOtp, logout }}>{children}</AuthContext.Provider>;
};
export default AuthProvider;
