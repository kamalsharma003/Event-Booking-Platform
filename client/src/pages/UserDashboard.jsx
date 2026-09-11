import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    try {
      const { data } = await api.get("/booking/my");
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load bookings.");
    }
  };

  useEffect(() => { loadBookings(); }, []);

  const cancelBooking = async (id) => {
    try {
      await api.delete(`/booking/${id}`);
      loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to cancel booking.");
    }
  };

  return <main className="min-h-[calc(100vh-88px)] bg-gray-950 px-4 py-12"><section className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8"><p className="text-sm font-bold tracking-[.2em] text-gray-500">EVENTORA</p><h1 className="mt-2 text-3xl font-extrabold text-gray-950">Welcome, {user.name}!</h1><p className="mt-1 text-gray-600">User Dashboard</p><h2 className="mt-10 text-2xl font-bold text-gray-950">My Bookings</h2>{error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mt-5 space-y-4">{bookings.map((booking) => <article key={booking._id} className="rounded-xl border border-gray-200 p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><h3 className="text-lg font-bold text-gray-950">{booking.eventId?.title || "Event unavailable"}</h3><p className="mt-2 text-sm text-gray-600">Date: {booking.eventId ? new Date(booking.eventId.date).toLocaleString() : "—"}</p><p className="mt-1 text-sm text-gray-600">Amount: ₹{booking.amount}</p><p className="mt-1 text-sm text-gray-600">Requested: {new Date(booking.createdAt).toLocaleDateString()}</p></div><div className="flex items-start gap-2"><Status value={booking.status} /><Status value={booking.paymentStatus === "non_paid" ? "not paid" : booking.paymentStatus} /></div></div><div className="mt-5 flex gap-4 text-sm font-semibold"><Link to={`/event/${booking.eventId?._id}`} className="text-gray-950 hover:underline">View Event</Link>{booking.status !== "cancelled" && <button onClick={() => cancelBooking(booking._id)} className="text-red-700 hover:underline">Cancel</button>}</div></article>)}{bookings.length === 0 && <p className="rounded-xl bg-gray-50 p-6 text-gray-600">You have no booking requests yet.</p>}</div></section></main>;
};

const Status = ({ value }) => <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase text-gray-700">{value}</span>;

export default UserDashboard;
