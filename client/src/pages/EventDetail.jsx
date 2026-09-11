import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const { data } = await api.get(`/event/${id}`);
        setEvent(data);
      } catch (err) {
        setError(err.response?.data?.message || "Event not found.");
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [id]);

  useEffect(() => {
    if (sessionStorage.getItem("bookingVerifiedEventId") !== id) return;

    sessionStorage.removeItem("bookingVerifiedEventId");
    const createBooking = async () => {
      setBooking(true);
      try {
        await api.post("/booking", { eventId: id });
        navigate("/dashboard");
      } catch (err) {
        setError(err.response?.data?.message || "Unable to create the booking.");
      } finally {
        setBooking(false);
      }
    };
    createBooking();
  }, [id, navigate]);

  const startBooking = async () => {
    setError("");
    setMessage("");
    if (!user) {
      sessionStorage.setItem("pendingEventId", id);
      navigate("/login");
      return;
    }
    if (user.role === "admin") {
      setError("Admins cannot create attendee bookings.");
      return;
    }

    setBooking(true);
    try {
      await api.post("/booking/send-otp");
      sessionStorage.setItem("otpAction", "event_booking");
      sessionStorage.setItem("bookingEventId", id);
      sessionStorage.setItem("otpEmail", user.email);
      navigate("/verify-otp");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send a booking OTP.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <main className="p-10 text-center text-gray-600">Loading event...</main>;
  if (!event) return <main className="p-10 text-center text-red-700">{error}</main>;

  return <main className="min-h-[calc(100vh-88px)] bg-gray-50 px-4 py-10"><section className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl"><img src={event.imageUrl} alt={event.title} className="h-72 w-full object-cover" /><div className="grid gap-8 p-6 md:grid-cols-[1fr_280px] md:p-10"><div><p className="text-sm font-bold tracking-widest text-gray-500">{event.category}</p><h1 className="mt-2 text-3xl font-extrabold text-gray-950">{event.title}</h1><p className="mt-5 leading-7 text-gray-600">{event.description}</p><dl className="mt-7 space-y-3 text-gray-700"><div><dt className="font-semibold">Date</dt><dd>{new Date(event.date).toLocaleString()}</dd></div><div><dt className="font-semibold">Location</dt><dd>{event.location}</dd></div></dl></div><aside className="rounded-xl bg-gray-950 p-6 text-white"><p className="text-sm text-gray-300">Ticket price</p><p className="mt-1 text-3xl font-extrabold">₹{event.ticketPrice}</p><p className="mt-5 text-sm text-gray-300">{event.availableSeates} seats remaining</p>{error && <p role="alert" className="mt-5 rounded-lg bg-red-900/60 p-3 text-sm">{error}</p>}{message && <p className="mt-5 text-sm text-green-300">{message}</p>}<button onClick={startBooking} disabled={booking || event.availableSeates <= 0} className="mt-6 w-full rounded-lg bg-white px-4 py-3 font-bold text-gray-950 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50">{booking ? "Please wait..." : event.availableSeates <= 0 ? "Sold out" : "Book this event"}</button><Link to="/" className="mt-4 block text-center text-sm text-gray-300 hover:text-white">Back to events</Link></aside></div></section></main>;
};

export default EventDetail;
