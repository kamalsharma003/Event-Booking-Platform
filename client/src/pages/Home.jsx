import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaShieldAlt, FaTicketAlt } from "react-icons/fa";
import api from "../utils/axios";

const Home = () => {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/event")
      .then(({ data }) => setEvents(data))
      .catch(() => setError("Unable to load events. Please try again later."));
  }, []);

  const filteredEvents = events.filter((event) => event.title.toLowerCase().includes(search.toLowerCase()));

  return <div className="min-h-screen bg-white"><section className="px-4 pt-8 sm:px-6 lg:px-10"><div className="relative flex min-h-[550px] items-center justify-center overflow-hidden rounded-3xl text-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=85')", backgroundSize: "cover", backgroundPosition: "center" }}><div className="absolute inset-0 bg-black/65" /><div className="relative z-10 max-w-5xl px-6"><span className="mb-7 inline-block rounded-full bg-white/20 px-5 py-2 text-sm font-semibold tracking-wider text-white backdrop-blur-md">WELCOME TO EVENTORA</span><h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">Find Your Next<br />Unforgettable Experience</h1><p className="mx-auto mt-7 max-w-3xl text-base leading-relaxed text-gray-200 sm:text-lg md:text-xl">Discover the best tech conferences, late-night music festivals, and hands-on workshops happening directly in your area. Secure your spot today.</p><div className="mx-auto mt-10 max-w-2xl"><input type="search" placeholder="Search events by title..." value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-full bg-white px-7 py-5 text-lg text-gray-800 shadow-xl outline-none" /></div></div></div></section><section className="container mx-auto grid grid-cols-1 gap-12 px-6 py-20 text-center md:grid-cols-3 lg:px-10"><Feature icon={<FaClock />} title="Fast Booking" text="Secure your tickets with our streamlined booking infrastructure built for speed." /><Feature icon={<FaTicketAlt />} title="Seamless Access" text="Manage requests and upcoming events directly from your personal dashboard." /><Feature icon={<FaShieldAlt />} title="Secure Platform" text="Registrations and bookings are protected with one-time-password verification." /></section><section className="container mx-auto px-6 pb-20 lg:px-10"><div className="mb-10 flex items-center justify-between"><h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Upcoming Events</h2><span className="text-gray-500">{filteredEvents.length} results found</span></div>{error ? <p className="text-center text-red-700">{error}</p> : <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">{filteredEvents.map((event) => <article key={event._id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition hover:shadow-xl"><div className="relative h-56 overflow-hidden"><img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" /><span className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-800">₹{event.ticketPrice}</span></div><div className="p-6"><p className="mb-3 text-xs font-bold tracking-widest text-gray-500">{event.category}</p><h3 className="mb-5 text-xl font-bold text-gray-800">{event.title}</h3><p className="mb-3 flex items-center gap-3 text-sm text-gray-500"><FaCalendarAlt />{new Date(event.date).toLocaleDateString()}</p><p className="mb-5 flex items-center gap-3 text-sm text-gray-500"><FaMapMarkerAlt />{event.location}</p><p className="mb-6 text-xs text-gray-400">{event.availableSeates} of {event.totalSeats} seats remaining</p><Link to={`/event/${event._id}`} className="block border-t border-gray-100 pt-5 text-center font-semibold text-gray-800 transition hover:text-gray-500">View Details</Link></div></article>)}</div>}{!error && filteredEvents.length === 0 && <p className="py-20 text-center text-gray-500">No events found.</p>}</section></div>;
};

const Feature = ({ icon, title, text }) => <div><div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-900 text-3xl text-white">{icon}</div><h2 className="mb-4 text-2xl font-bold text-gray-800">{title}</h2><p className="mx-auto max-w-sm leading-relaxed text-gray-500">{text}</p></div>;

export default Home;
