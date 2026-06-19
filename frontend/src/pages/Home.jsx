import React, { useEffect, useState } from "react";
import Slide from "../component/Slide";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../component/Footer";
import { motion } from "framer-motion";

const Home = () => {
  const [data, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/public");
      setCategory(res.data.category);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const productFetch = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/get");
      setProduct(res.data.product);
    } catch (error) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
    productFetch();
  }, []);

  // ── Static data for new sections ──────────────────────────────────────────
  const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "10K+", label: "Products Listed" },
    { value: "500+", label: "Trusted Brands" },
    { value: "4.8★", label: "Average Rating" },
  ];

  const features = [
    {
      icon: "🚚",
      title: "Free Delivery",
      desc: "On all orders above Rs. 999. Fast & reliable shipping across Nepal.",
    },
    {
      icon: "🔒",
      title: "Secure Payments",
      desc: "100% secure transactions with eSewa, Khalti & card payments.",
    },
    {
      icon: "↩️",
      title: "Easy Returns",
      desc: "7-day hassle-free return policy on all eligible items.",
    },
    {
      icon: "🎧",
      title: "24/7 Support",
      desc: "Our customer team is always available to help you out.",
    },
  ];

  const testimonials = [
    {
      name: "Aarav Sharma",
      location: "Kathmandu",
      rating: 5,
      text: "Amazing experience! Products arrived on time and quality was exactly as described. Will definitely shop again.",
      avatar: "AS",
    },
    {
      name: "Priya Thapa",
      location: "Pokhara",
      rating: 5,
      text: "Super easy to navigate and the prices are unbeatable. The return process was smooth when I needed it.",
      avatar: "PT",
    },
    {
      name: "Rohan KC",
      location: "Lalitpur",
      rating: 4,
      text: "Great selection of products. Delivery was quick and packaging was solid. Highly recommend this store!",
      avatar: "RK",
    },
  ];

  const deals = [
    { label: "Electronics", discount: "Up to 40% off", color: "from-blue-500 to-blue-700", icon: "💻" },
    { label: "Fashion", discount: "Up to 60% off", color: "from-pink-500 to-rose-600", icon: "👗" },
    { label: "Home & Living", discount: "Up to 35% off", color: "from-amber-500 to-orange-600", icon: "🛋️" },
    { label: "Sports", discount: "Up to 50% off", color: "from-emerald-500 to-teal-700", icon: "⚽" },
  ];

  const steps = [
    { step: "1", title: "Browse Products", desc: "Explore thousands of curated products across all categories." },
    { step: "2", title: "Add to Cart", desc: "Select your size, colour, and quantity then add to your cart." },
    { step: "3", title: "Pay Securely", desc: "Choose from eSewa, Khalti, card, or cash on delivery." },
    { step: "4", title: "Get Delivered", desc: "Track your order and receive it right at your door." },
  ];

  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">

      {/* ── Slider (original) ─────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Slide />
      </motion.div>

      {/* ── Hero Section (original) ───────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Shop Smart. Live Better.
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8">
            Discover thousands of products at unbeatable prices.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => nav("/products")}
              className="bg-white text-emerald-700 font-semibold px-6 py-3 rounded-full"
            >
              Shop Now
            </button>

            <button
              onClick={() => nav("/category")}
              className="border border-white px-6 py-3 rounded-full"
            >
              Browse Categories
            </button>
          </div>
        </div>
      </motion.section>

      {/* ── NEW: Stats Bar ────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-2xl sm:text-3xl font-bold text-emerald-600">{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── NEW: Flash Deals Banner ───────────────────────────────────── */}
      <section className="py-10 px-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">⚡</span>
          <div>
            <h2 className="text-2xl font-bold">Flash Deals</h2>
            <p className="text-gray-500 text-sm">Limited-time offers across top categories</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {deals.map((deal, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              onClick={() => nav("/products")}
              className={`bg-gradient-to-br ${deal.color} text-white rounded-2xl p-5 cursor-pointer`}
            >
              <p className="text-3xl mb-2">{deal.icon}</p>
              <p className="font-bold text-base">{deal.label}</p>
              <p className="text-xs mt-1 opacity-90">{deal.discount}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Featured Products (original) ─────────────────────────────── */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <p className="text-gray-500 text-sm">Handpicked just for you</p>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
          </div>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {product.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border"
            >
              <div onClick={() => nav(`/product/${item._id}`)}>
                <img
                  src={item.image}
                  className="w-full h-44 sm:h-52 object-cover"
                  alt={item.title}
                />
              </div>

              <div className="p-3 sm:p-4">
                <h2 className="text-sm font-semibold line-clamp-2">
                  {item.title}
                </h2>

                <div className="flex justify-between mt-3">
                  <p className="text-emerald-600 font-bold">
                    Rs. {item.price}
                  </p>

                  <button
                    onClick={() => nav(`/product/${item._id}`)}
                    className="text-sm text-emerald-700"
                  >
                    View
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All button */}
        <div className="text-center mt-10">
          <button
            onClick={() => nav("/products")}
            className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition"
          >
            View All Products →
          </button>
        </div>
      </section>

      {/* ── Categories (original) ────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white py-12 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Explore Categories
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.map((item) => (
              <motion.div
                key={item._id}
                whileHover={{ scale: 1.05 }}
                onClick={() => nav(`/category/${item._id}`)}
                className="bg-gray-50 rounded-xl cursor-pointer overflow-hidden"
              >
                <img
                  src={item.image}
                  className="h-36 w-full object-cover"
                  alt={item.title}
                />
                <p className="text-center p-2 font-medium text-sm">
                  {item.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── NEW: How It Works ─────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">How It Works</h2>
          <p className="text-gray-500 text-sm text-center mb-10">
            From browsing to doorstep in 4 easy steps
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-emerald-600 text-white text-lg font-bold rounded-full flex items-center justify-center mx-auto mb-3">
                  {s.step}
                </div>
                <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute mt-[-2rem] ml-[8rem] text-gray-300 text-xl">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW: Why Choose Us ────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">Why Shop With Us?</h2>
          <p className="text-gray-500 text-sm text-center mb-10">
            We go beyond just selling products
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100"
              >
                <p className="text-4xl mb-4">{f.icon}</p>
                <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW: Promotional Banner ───────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="py-10 px-4"
      >
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-teal-600 to-emerald-500 rounded-3xl overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-6">
            <div className="text-white text-center md:text-left">
              <p className="text-sm font-medium uppercase tracking-widest text-emerald-200 mb-2">
                Limited Time Offer
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Get 20% Off Your First Order
              </h2>
              <p className="text-emerald-100 text-sm">
                Use code <span className="font-bold bg-white text-emerald-700 px-2 py-0.5 rounded-md">WELCOME20</span> at checkout
              </p>
            </div>
            <button
              onClick={() => nav("/products")}
              className="bg-white text-emerald-700 font-bold px-8 py-4 rounded-full whitespace-nowrap hover:shadow-lg transition"
            >
              Claim Offer →
            </button>
          </div>
        </div>
      </motion.section>

      {/* ── NEW: Customer Testimonials ────────────────────────────────── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">What Our Customers Say</h2>
          <p className="text-gray-500 text-sm text-center mb-10">
            Real reviews from real shoppers
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.location}</p>
                  </div>
                  <div className="ml-auto text-yellow-400 text-sm">
                    {"★".repeat(t.rating)}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW: App Download Banner ──────────────────────────────────── */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-1">
              Coming Soon
            </p>
            <h3 className="text-xl font-bold mb-1">Shop on the Go</h3>
            <p className="text-gray-500 text-sm">
              Our mobile app is launching soon. Get early access and exclusive deals.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition">
              <span>🍎</span> App Store
            </button>
            <button className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition">
              <span>🤖</span> Play Store
            </button>
          </div>
        </div>
      </section>

      {/* ── Newsletter (original) ─────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="bg-gray-100 py-12 px-4"
      >
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-xl font-bold mb-2">Stay in the Loop</h3>
          <p className="text-gray-500 mb-6 text-sm">
            Subscribe for deals and updates
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="flex-1 px-4 py-3 rounded-full border"
              placeholder="Email"
            />
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-full">
              Subscribe
            </button>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default Home;