import React, { useEffect, useState } from "react";
import Slide from "../component/Slide";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../component/Footer";
import { motion } from "framer-motion";

/* ────────────────────────────────────────────────────────────────────────
   Design tokens:
   ink       #17111F   deep plum-black
   indigo    #2B1F4A   muted violet-indigo
   paper     #FBF8F3   warm paper white
   marigold  #F2A93B   marigold/saffron
   rose      #E14C6D   rhododendron pink
   ─────────────────────────────────────────────────────────────────────── */

const FlagGarland = ({ className = "" }) => {
  const colors = ["#F2A93B", "#E14C6D", "#2B1F4A", "#F2A93B", "#E14C6D"];
  return (
    <div className={`flex justify-center gap-2 sm:gap-3 ${className}`} aria-hidden="true">
      {colors.map((c, i) => (
        <svg key={i} width="18" height="14" viewBox="0 0 18 14" className="opacity-70 transition-transform hover:scale-125 duration-300">
          <path d="M0 0 L18 0 L9 14 Z" fill={c} />
        </svg>
      ))}
    </div>
  );
};

// Motion animation variables for structural staging
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

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
      setCategory(res.data.category || []);
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
      setProduct(res.data.product || []);
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

  const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "10K+", label: "Products Listed" },
    { value: "500+", label: "Trusted Brands" },
    { value: "4.8★", label: "Average Rating" },
  ];

  const features = [
    { icon: "🚚", title: "Free Delivery", desc: "On all orders above Rs. 999. Fast & reliable shipping across Nepal." },
    { icon: "🔒", title: "Secure Payments", desc: "100% secure transactions with eSewa, Khalti & card payments." },
    { icon: "↩️", title: "Easy Returns", desc: "7-day hassle-free return policy on all eligible items." },
    { icon: "🎧", title: "24/7 Support", desc: "Our customer team is always available to help you out." },
  ];

  const testimonials = [
    { name: "Aarav Sharma", location: "Kathmandu", rating: 5, text: "Amazing experience! Products arrived on time and quality was exactly as described. Will definitely shop again.", avatar: "AS" },
    { name: "Priya Thapa", location: "Pokhara", rating: 5, text: "Super easy to navigate and the prices are unbeatable. The return process was smooth when I needed it.", avatar: "PT" },
    { name: "Rohan KC", location: "Lalitpur", rating: 4, text: "Great selection of products. Delivery was quick and packaging was solid. Highly recommend this store!", avatar: "RK" },
  ];

  const deals = [
    { label: "Electronics", discount: "Up to 40% off", color: "from-[#2B1F4A] via-[#1e1535] to-[#17111F]", icon: "💻" },
    { label: "Fashion", discount: "Up to 60% off", color: "from-[#E14C6D] via-[#c63d5b] to-[#17111F]", icon: "👗" },
    { label: "Home & Living", discount: "Up to 35% off", color: "from-[#F2A93B] via-[#d08d2b] to-[#17111F]", icon: "🛋️" },
    { label: "Sports", discount: "Up to 50% off", color: "from-[#2B1F4A] via-[#211739] to-[#E14C6D]", icon: "⚽" },
  ];

  const steps = [
    { step: "01", title: "Browse Products", desc: "Explore thousands of curated products across all categories." },
    { step: "02", title: "Add to Cart", desc: "Select your size, colour, and quantity then add to your cart." },
    { step: "03", title: "Pay Securely", desc: "Choose from eSewa, Khalti, card, or cash on delivery." },
    { step: "04", title: "Get Delivered", desc: "Track your order and receive it right at your door." },
  ];

  return (
    <div className="bg-[#FBF8F3] min-h-screen flex flex-col font-['Inter',sans-serif] overflow-x-hidden selection:bg-[#F2A93B] selection:text-[#17111F]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Fraunces', serif; font-feature-settings: 'ss01' on; }
      `}</style>

      {/* ── Slider Section ────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Slide />
      </motion.div>

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative bg-[#17111F] text-white overflow-hidden py-24 sm:py-32">
        {/* Ambient Fluid Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#E14C6D]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#F2A93B]/15 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center px-4 relative z-10">
          <motion.span 
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.25em" }}
            transition={{ duration: 0.8 }}
            className="inline-block text-xs uppercase text-[#F2A93B] font-extrabold mb-6 tracking-[0.25em] bg-[#F2A93B]/10 px-4 py-1.5 rounded-full border border-[#F2A93B]/20"
          >
            🇳🇵 Nepal's Premium Marketplace
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
          >
            Shop Smart. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2A93B] to-[#E14C6D]">Live Better.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 font-normal leading-relaxed"
          >
            Discover thousands of handpicked, high-quality products at unbeatable prices—delivered straight to your door with trusted local support.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <button
              onClick={() => nav("/products")}
              className="w-full sm:w-auto bg-[#F2A93B] text-[#17111F] font-bold px-8 py-4 rounded-full hover:bg-white transition-all duration-300 shadow-xl shadow-[#F2A93B]/20 hover:shadow-white/10 active:scale-95"
            >
              Shop Collection
            </button>
            <button
              onClick={() => nav("/category")}
              className="w-full sm:w-auto border border-white/20 backdrop-blur-md bg-white/5 px-8 py-4 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300 active:scale-95"
            >
              Browse Categories
            </button>
          </motion.div>
        </div>

        {/* Stats Matrix */}
        <div className="max-w-6xl mx-auto px-4 mt-20 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl"
          >
            {stats.map((s, i) => (
              <div key={i} className="text-center group sm:border-r last:border-0 border-white/5 last:border-transparent">
                <p className="font-display text-3xl sm:text-4xl font-bold text-[#F2A93B] group-hover:scale-105 transition-transform duration-300">{s.value}</p>
                <p className="text-white/60 text-xs sm:text-sm uppercase tracking-wider font-semibold mt-2">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Layout Spacer */}
      <div className="h-12 bg-[#FBF8F3]" />

      {/* ── Flash Deals Section ────────────────────────────────────────── */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b border-gray-200/60 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F2A93B]/10 flex items-center justify-center text-2xl animate-pulse">⚡</div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#17111F]">Limited Flash Deals</h2>
              <p className="text-gray-500 text-sm mt-0.5">Top-tier markdown opportunities active right now</p>
            </div>
          </div>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {deals.map((deal, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => nav("/products")}
              className={`relative bg-gradient-to-br ${deal.color} text-white rounded-3xl p-6 cursor-pointer overflow-hidden shadow-lg group transition-all`}
            >
              <div className="absolute -right-6 -bottom-6 text-8xl opacity-10 group-hover:opacity-20 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
                {deal.icon}
              </div>
              <p className="text-4xl mb-8 bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-sm">{deal.icon}</p>
              <p className="font-bold text-lg tracking-tight">{deal.label}</p>
              <p className="text-sm mt-1 text-[#F2A93B] font-extrabold uppercase tracking-wider">{deal.discount}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <FlagGarland className="py-4" />

      {/* ── Featured Products Section ─────────────────────────────────── */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#17111F]">Featured Products</h2>
            <p className="text-gray-500 text-sm mt-1">Carefully assessed solutions curated for your domestic needs</p>
          </div>
          <button 
            onClick={() => nav("/products")}
            className="text-sm font-bold text-[#E14C6D] hover:text-[#17111F] transition-colors flex items-center gap-1 group whitespace-nowrap"
          >
            See All Configurations <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-[#F2A93B] border-t-transparent rounded-full" />
          </div>
        )}

        {error && <p className="text-[#E14C6D] text-center font-semibold bg-[#E14C6D]/5 py-4 rounded-xl">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {product.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: Math.min(index * 0.05, 0.3) }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div onClick={() => nav(`/product/${item._id}`)} className="relative overflow-hidden cursor-pointer aspect-square bg-gray-50">
                <img
                  src={item.image}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  alt={item.title}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17111F]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                  <span className="text-white text-xs font-bold tracking-wider bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">Quick View Detail →</span>
                </div>
              </div>

              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#17111F] line-clamp-2 hover:text-[#E14C6D] transition-colors cursor-pointer" onClick={() => nav(`/product/${item._id}`)}>
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <p className="font-display text-[#17111F] font-bold text-lg">
                    Rs. {item.price.toLocaleString()}
                  </p>
                  <button
                    onClick={() => nav(`/product/${item._id}`)}
                    className="bg-[#17111F] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#E14C6D] transition-colors duration-300 shadow-md"
                  >
                    View
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Explore Categories Section ────────────────────────────────── */}
      <section className="bg-white py-20 px-4 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#17111F]">Explore Categories</h2>
            <p className="text-gray-500 text-sm mt-2">Functional sorting setups optimized for seamless discovery</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {data.map((item) => (
              <motion.div
                key={item._id}
                whileHover={{ y: -6 }}
                onClick={() => nav(`/category/${item._id}`)}
                className="cursor-pointer text-center group flex flex-col items-center"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-gray-50 group-hover:border-[#F2A93B] shadow-md transition-all duration-300 mb-3 bg-gray-50">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                </div>
                <p className="text-sm font-bold text-[#17111F] group-hover:text-[#F2A93B] transition-colors line-clamp-1 max-w-[90%]">{item.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Procedural Workflow Section ───────────────────────────────── */}
      <section className="py-20 px-4 bg-[#FBF8F3]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#17111F]">Procedural Workflow</h2>
            <p className="text-gray-500 text-sm mt-2">Four simple intervals handling selections immediately to your door</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-[2px] bg-gray-200/60 z-0" />
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center z-10 group"
              >
                <div className="w-16 h-16 bg-[#17111F] text-[#F2A93B] font-display text-xl font-bold rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:bg-[#E14C6D] group-hover:text-white transition-all duration-300 ring-8 ring-[#FBF8F3]">
                  {s.step}
                </div>
                <h3 className="font-bold text-base text-[#17111F] mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed px-4">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us Section ─────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#17111F]">Operational Integrity</h2>
            <p className="text-gray-500 text-sm mt-2">Customer-first pipelines designed for maximum purchasing convenience</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="rounded-3xl p-6 text-center border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 bg-[#FBF8F3]"
              >
                <div className="text-4xl mb-4 bg-white w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-sm">{f.icon}</div>
                <h3 className="font-bold text-[#17111F] mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promotional Banner ────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative max-w-6xl mx-auto bg-gradient-to-r from-[#17111F] via-[#2B1F4A] to-[#17111F] rounded-[2rem] overflow-hidden shadow-2xl"
        >
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#F2A93B]/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#E14C6D]/10 rounded-full blur-[100px]" />

          <div className="relative flex flex-col lg:flex-row items-center justify-between p-8 sm:p-16 gap-8 text-center lg:text-left">
            <div className="text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F2A93B] bg-[#F2A93B]/10 px-3 py-1 rounded-full border border-[#F2A93B]/20">Limited Time Offer</span>
              <h2 className="font-display text-3xl sm:text-5xl font-bold mt-4 mb-3 leading-tight">Get 20% Off Your First Order</h2>
              <p className="text-white/70 text-sm sm:text-base">
                Apply verification sequence {" "}
                <span className="font-mono font-bold bg-[#F2A93B] text-[#17111F] px-2.5 py-1 rounded-lg ml-1 select-all shadow-md">
                  WELCOME20
                </span>{" "}
                during check out.
              </p>
            </div>
            <button
              onClick={() => nav("/products")}
              className="bg-white text-[#17111F] font-bold px-8 py-4 rounded-full hover:bg-[#F2A93B] hover:text-[#17111F] transition-all duration-300 whitespace-nowrap shadow-lg active:scale-95"
            >
              Claim Promotional Offer →
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Testimonials Section ──────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#17111F]">Verified Submissions</h2>
            <p className="text-gray-500 text-sm mt-2">Genuine evaluations from commercial activity across the country</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="rounded-3xl p-6 border border-gray-100 bg-[#FBF8F3] relative flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="absolute top-2 right-6 font-display text-7xl text-[#F2A93B]/20 select-none pointer-events-none">“</span>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#17111F] text-[#F2A93B] flex items-center justify-center font-bold shadow-md">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#17111F]">{t.name}</p>
                      <p className="text-gray-400 text-xs font-medium">{t.location}</p>
                    </div>
                  </div>
                  <div className="text-[#F2A93B] text-sm mb-3 tracking-wide">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
                  <p className="text-gray-600 text-sm leading-relaxed italic">"{t.text}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FlagGarland className="py-4 bg-[#FBF8F3]" />

      {/* ── App Download Section ──────────────────────────────────────── */}
      <section className="py-12 px-4 bg-[#FBF8F3]">
        <div className="max-w-5xl mx-auto bg-white rounded-[2rem] border border-gray-100 p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="text-center lg:text-left">
            <span className="text-xs font-bold text-[#E14C6D] bg-[#E14C6D]/10 px-3 py-1 rounded-full uppercase tracking-widest font-semibold">Native iOS & Android</span>
            <h3 className="font-display text-2xl font-bold text-[#17111F] mt-3 mb-2">Omnipresent Portability</h3>
            <p className="text-gray-500 text-sm max-w-xl">Our mobile app is coming soon. Sign up for early access to receive exclusive application-specific vouchers.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-shrink-0">
            <button className="flex items-center justify-center gap-3 bg-[#17111F] text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#2B1F4A] transition-all shadow-md active:scale-95">
              <span className="text-lg">🍎</span> App Store
            </button>
            <button className="flex items-center justify-center gap-3 bg-[#17111F] text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#2B1F4A] transition-all shadow-md active:scale-95">
              <span className="text-lg">🤖</span> Play Store
            </button>
          </div>
        </div>
      </section>

      {/* ── Newsletter Section ────────────────────────────────────────── */}
      <section className="bg-[#17111F] py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h3 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">Maintain Alignment</h3>
          <p className="text-white/60 mb-8 text-sm sm:text-base font-normal">Subscribe to receive system-wide updates, holiday sales notifications, and seasonal collections directly.</p>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 bg-white/5 p-2 rounded-2xl sm:rounded-full border border-white/10 backdrop-blur-md">
            <input
              type="email"
              required
              className="flex-1 px-5 py-3.5 rounded-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm"
              placeholder="Enter your email address"
            />
            <button type="submit" className="bg-[#F2A93B] text-[#17111F] font-bold px-8 py-3.5 rounded-full hover:bg-white transition-colors duration-300 shadow-lg whitespace-nowrap active:scale-95">
              Subscribe Now
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;