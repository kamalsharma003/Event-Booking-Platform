import { useState } from "react";
import {
  FaClock,
  FaTicketAlt,
  FaShieldAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const events = [
  {
    id: 1,
    category: "TECHNOLOGY",
    title: "React & Node.js Developer Retreat",
    date: "Monday, March 16, 2026",
    location: "Silicon Valley Innovation Center, CA",
    price: "FREE",
    seats: "199 of 200 seats remaining",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    category: "MUSIC",
    title: "Neon Nights EDM Festival",
    date: "Thursday, March 26, 2026",
    location: "Grand Arena, New York",
    price: "₹1500",
    seats: "499 of 500 seats remaining",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    category: "BUSINESS",
    title: "Global Leaders Business Summit",
    date: "Saturday, March 21, 2026",
    location: "The Ritz-Carlton, London",
    price: "₹6000",
    seats: "148 of 150 seats remaining",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    category: "ENTERTAINMENT",
    title: "Summer Music Festival",
    date: "Sunday, April 12, 2026",
    location: "Central Park, New York",
    price: "₹200",
    seats: "280 of 300 seats remaining",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    category: "WORKSHOP",
    title: "Modern Business Workshop",
    date: "Saturday, April 18, 2026",
    location: "Business Center, Chicago",
    price: "₹100",
    seats: "80 of 100 seats remaining",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    category: "TECHNOLOGY",
    title: "Future Technology Conference",
    date: "Sunday, April 26, 2026",
    location: "Innovation Hall, San Francisco",
    price: "₹600",
    seats: "90 of 100 seats remaining",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
  },
];

const Home = () => {
  const [search, setSearch] = useState("");

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">

      {/* ================= HERO ================= */}
      <section className="px-4 sm:px-6 lg:px-10 pt-8">

        <div
          className="relative min-h-[550px] rounded-3xl overflow-hidden flex items-center justify-center text-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=85')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/65"></div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-5xl px-6">

            <span className="inline-block bg-white/20 backdrop-blur-md text-white text-sm font-semibold tracking-wider px-5 py-2 rounded-full mb-7">
              WELCOME TO EVENTORA
            </span>

            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              Find Your Next
              <br />
              Unforgettable Experience
            </h1>

            <p className="text-gray-200 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mt-7 leading-relaxed">
              Discover the best tech conferences, late-night music festivals,
              and hands-on workshops happening directly in your area. Secure
              your spot today.
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto mt-10">
              <input
                type="text"
                placeholder="Search events by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white text-gray-800 placeholder-gray-400 px-7 py-5 rounded-full outline-none text-lg shadow-xl"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="container mx-auto px-6 lg:px-10 py-20">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

          {/* Feature 1 */}
          <div>
            <div className="w-20 h-20 bg-gray-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-7">
              <FaClock className="text-3xl" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Fast Booking
            </h2>

            <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
              Secure your tickets instantly with our fast streamlined booking
              infrastructure built for speed.
            </p>
          </div>

          {/* Feature 2 */}
          <div>
            <div className="w-20 h-20 bg-gray-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-7">
              <FaTicketAlt className="text-3xl" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Seamless Access
            </h2>

            <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
              Download tickets instantly or manage them right from your
              personal dashboard with ease.
            </p>
          </div>

          {/* Feature 3 */}
          <div>
            <div className="w-20 h-20 bg-gray-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-7">
              <FaShieldAlt className="text-3xl" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Secure Platform
            </h2>

            <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
              All transactions and registrations are protected by
              cutting-edge security and 2FA OTP technology.
            </p>
          </div>

        </div>
      </section>

      {/* ================= UPCOMING EVENTS ================= */}
      <section className="container mx-auto px-6 lg:px-10 pb-20">

        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Upcoming Events
          </h2>

          <span className="text-gray-500">
            {filteredEvents.length} results found
          </span>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">

          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-gray-100"
            >

              {/* Image */}
              <div className="relative h-56 overflow-hidden">

                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />

                {/* Price */}
                <span
                  className={`absolute top-4 right-4 px-4 py-2 rounded-full font-bold text-sm ${
                    event.price === "FREE"
                      ? "bg-white text-green-600"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {event.price}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6">

                <p className="text-xs font-bold tracking-widest text-gray-500 mb-3">
                  {event.category}
                </p>

                <h3 className="text-xl font-bold text-gray-800 mb-5">
                  {event.title}
                </h3>

                {/* Date */}
                <div className="flex items-center gap-3 text-gray-500 mb-3">
                  <FaCalendarAlt />
                  <span className="text-sm">{event.date}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3 text-gray-500 mb-5">
                  <FaMapMarkerAlt />
                  <span className="text-sm">{event.location}</span>
                </div>

                {/* Progress */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-gray-800 rounded-full"
                    style={{
                      width:
                        event.price === "FREE"
                          ? "92%"
                          : event.id === 2
                          ? "98%"
                          : "94%",
                    }}
                  ></div>
                </div>

                <p className="text-xs text-gray-400 mb-6">
                  {event.seats}
                </p>

                {/* Button */}
                <button className="w-full border-t border-gray-100 pt-5 text-gray-800 font-semibold hover:text-gray-500 transition">
                  View Details
                </button>

              </div>
            </div>
          ))}

        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No events found.
          </div>
        )}

      </section>

    </div>
  );
};

export default Home;