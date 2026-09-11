import { useEffect, useState } from "react";
import api from "../utils/axios";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    try {
      const { data } = await api.get("/booking");
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load booking requests.");
    }
  };

  useEffect(() => { loadBookings(); }, []);

  const cancel = async (id) => {
    try {
      await api.put(`/booking/${id}/cancel`);
      loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to cancel booking.");
    }
  };

  const confirm = async (id) => {
    try {
      await api.put(`/booking/${id}/confirm`, { paymentStatus: "not_paid" });
      loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to confirm booking.");
    }
  };

  return <main className="min-h-[calc(100vh-88px)] bg-gray-950 px-4 py-12"><section className="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8"><p className="text-sm font-bold tracking-[.2em] text-gray-500">EVENTORA ADMIN</p><h1 className="mt-2 text-3xl font-extrabold text-gray-950">Booking Requests</h1>{error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mt-7 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b text-gray-500"><tr><th className="p-3">User</th><th className="p-3">Event</th><th className="p-3">Status</th><th className="p-3">Payment</th><th className="p-3">Action</th></tr></thead><tbody>{bookings.map((booking) => <tr key={booking._id} className="border-b"><td className="p-3"><p className="font-semibold">{booking.userId?.name}</p><p className="text-gray-500">{booking.userId?.email}</p></td><td className="p-3"><p className="font-semibold">{booking.eventId?.title || "Event unavailable"}</p><p className="text-gray-500">₹{booking.amount}</p></td><td className="p-3 capitalize">{booking.status}</td><td className="p-3">{booking.paymentStatus === "non_paid" ? "Not paid" : "Paid"}</td><td className="p-3">{booking.status === "pending" && <div className="flex gap-2"><button onClick={() => confirm(booking._id)} className="rounded-lg bg-gray-950 px-3 py-2 font-semibold text-white hover:bg-gray-700">Confirm</button><button onClick={() => cancel(booking._id)} className="rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-700 hover:bg-red-50">Reject</button></div>}</td></tr>)}</tbody></table>{bookings.length === 0 && <p className="py-8 text-center text-gray-500">No booking requests yet.</p>}</div></section></main>;
};

export default AdminDashboard;

