import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import { AuthCard, Field } from "./Register";

const VerifyOtp = () => {
  const { verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();
  const email = sessionStorage.getItem("otpEmail") || "";
  const action = sessionStorage.getItem("otpAction") || "";
  const bookingEventId = sessionStorage.getItem("bookingEventId");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isBookingVerification = action === "event_booking";

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isBookingVerification) {
        await api.post("/booking/verify-otp", { otp: otp.trim() });
        sessionStorage.removeItem("otpAction");
        sessionStorage.setItem("bookingVerifiedEventId", bookingEventId);
        navigate(`/event/${bookingEventId}`);
        return;
      }

      const data = await verifyOtp(email, otp.trim(), action);
      sessionStorage.removeItem("otpEmail");
      sessionStorage.removeItem("otpAction");
      const pendingEventId = sessionStorage.getItem("pendingEventId");

      if (pendingEventId && data.user.role !== "admin") {
        sessionStorage.removeItem("pendingEventId");
        navigate(`/event/${pendingEventId}`);
      } else {
        navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to verify the OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const missingFlow = isBookingVerification ? !bookingEventId : !email || !action;
  return <AuthCard title={isBookingVerification ? "Verify your booking" : "Verify your email"} subtitle={email ? `We sent a one-time password to ${email}.` : "Enter the one-time password sent to your email."}>{missingFlow ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">Your verification session has expired. Please start again.</p> : <form onSubmit={submit} className="space-y-5"><Field label="One-time password" type="text" value={otp} onChange={setOtp} autoComplete="one-time-code" />{error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="w-full rounded-xl bg-gray-950 px-4 py-3 font-semibold text-white hover:bg-gray-700 disabled:opacity-60">{loading ? "Verifying..." : "Verify OTP"}</button></form>}<p className="mt-6 text-center text-sm text-gray-600">Need to start over? <Link to="/login" className="font-semibold text-gray-950 hover:underline">Login</Link></p></AuthCard>;
};

export default VerifyOtp;
