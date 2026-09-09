import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
function App() { return <BrowserRouter><Navbar /><Routes><Route path="/" element={<Home />} /><Route path="/register" element={<Register />} /><Route path="/verify-otp" element={<VerifyOtp />} /><Route path="/login" element={<Login />} /><Route path="/dashboard" element={<UserDashboard />} /><Route path="/admin" element={<AdminDashboard />} /></Routes></BrowserRouter>; }
export default App;
