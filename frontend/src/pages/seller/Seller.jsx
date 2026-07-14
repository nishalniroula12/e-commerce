import React, { useEffect, useState } from "react";
import Sidebar from "../../component/Sidebar";
import axios from "axios";
import { motion } from "framer-motion";
import { FaBoxOpen, FaTags, FaWarehouse, FaCoins, FaChevronLeft, FaChevronRight } from "react-icons/fa";

/* ────────────────────────────────────────────────────────────────────────
   Design tokens: Minimalist Editorial Light
   ─────────────────────────────────────────────────────────────────────── */

const containerStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const rowVariant = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

const useCountUp = (target, duration = 600) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    let start = null;
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
};

const useClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
};

const StatCard = ({ label, value, prefix = "", accent, icon: Icon, percent }) => {
  const animated = useCountUp(value);
  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -4, borderColor: accent, boxShadow: "0 12px 30px -10px rgba(0,0,0,0.06)" }}
      className="relative rounded-2xl border border-[#EFEBE4] bg-white p-6 transition-all duration-300 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            {label}
          </p>
          <p className="mt-1 font-mono text-3xl font-extrabold text-[#17111F] tracking-tight">
            {prefix}
            {animated.toLocaleString()}
          </p>
        </div>
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300"
          style={{ backgroundColor: `${accent}12`, color: accent, border: `1px solid ${accent}25` }}
        >
          <Icon className="text-[15px]" />
        </div>
      </div>

      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="h-full rounded-full"
          style={{ backgroundColor: accent }}
        />
      </div>
    </motion.div>
  );
};

const StatSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-[#EFEBE4] bg-white p-6 shadow-sm">
    <div className="h-3 w-16 rounded bg-neutral-100" />
    <div className="mt-3 h-7 w-28 rounded bg-neutral-100" />
    <div className="mt-6 h-1.5 w-full rounded-full bg-neutral-100" />
  </div>
);

const Seller = () => {
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const now = useClock();
  const [page, setPage] = useState(1);
  const [totalpage, setTotalpage] = useState(1);

  const fetchallinone = async () => {
    try {
      const [productRes, categoryRes] = await Promise.all([
        axios.get("http://localhost:8000/api/get", {
          params: { page, limit: 3 }
        }, {
          withCredentials: true,
        }),
        axios.get("http://localhost:8000/api/public", {
          withCredentials: true,
        }),
      ]);

      setProduct(productRes.data.product || []);
      setTotalpage(productRes.data.totalpage || 1);
      setCategory(categoryRes.data.category || []);
    } catch (error) {
      console.error("Dashboard Ledger Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchallinone();
  }, [page]);

  const totalProducts = product.length;
  const totalCategories = category.length;
  const totalStock = product.reduce((total, item) => total + Number(item.stock || 0), 0);
  const totalValue = product.reduce((total, item) => total + Number(item.price || 0) * Number(item.stock || 0), 0);

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: FaBoxOpen,
      accent: "#6366f1", 
      percent: Math.min((totalProducts / 100) * 100, 100),
    },
    {
      label: "Total Categories",
      value: totalCategories,
      icon: FaTags,
      accent: "#10b981", 
      percent: Math.min((totalCategories / 20) * 100, 100),
    },
    {
      label: "Total Stock",
      value: totalStock,
      icon: FaWarehouse,
      accent: "#f59e0b", 
      percent: Math.min((totalStock / 1000) * 100, 100),
    },
    {
      label: "Inventory Value",
      value: totalValue,
      prefix: "Rs. ",
      icon: FaCoins,
      accent: "#ec4899", 
      percent: Math.min((totalValue / 100000) * 100, 100),
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FBF9F6] text-neutral-800 antialiased font-sans">
      <Sidebar />

      <main className="flex-1 w-full min-w-0 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#EFEBE4] pb-6">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#6366f1]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6366f1] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#6366f1]" />
                </span>
                Console Active
              </p>
              <h1 className="mt-1 font-sans text-2xl font-extrabold tracking-tight text-[#17111F] sm:text-3xl">
                System Console
              </h1>
            </div>
            
            <p className="font-mono text-xs text-neutral-500 bg-white px-4 py-2 rounded-xl border border-[#EFEBE4] self-start sm:self-auto shadow-sm">
              {now.toLocaleDateString(undefined, {
                weekday: "short", year: "numeric", month: "short", day: "numeric"
              })}
              <span className="text-neutral-300 mx-2">·</span>
              <span className="text-neutral-800 font-semibold">{now.toLocaleTimeString()}</span>
            </p>
          </div>

          {/* Stat cards matrix */}
          <motion.div
            variants={containerStagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
          >
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
              : stats.map((s) => <StatCard key={s.label} {...s} />)}
          </motion.div>

          {/* ── Visual Analytics Section (Graphs & Charts) ────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Linear Performance Graph */}
            <div className="lg:col-span-2 rounded-2xl border border-[#EFEBE4] bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#17111F] mb-1">Performance Matrix</h3>
                <p className="text-xs text-neutral-400">Stock updates and item tracking metrics</p>
              </div>
              <div className="mt-6 h-48 w-full relative">
                <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#F3F0EC" strokeWidth="1" strokeDasharray="4" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="#F3F0EC" strokeWidth="1" strokeDasharray="4" />
                  <line x1="0" y1="130" x2="500" y2="130" stroke="#F3F0EC" strokeWidth="1" strokeDasharray="4" />
                  
                  {/* Area fill path */}
                  <path d="M 0 130 Q 80 40, 160 90 T 320 50 T 500 20 L 500 130 Z" fill="url(#chartGlow)" />
                  {/* Main line path */}
                  <path d="M 0 130 Q 80 40, 160 90 T 320 50 T 500 20" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
                  
                  {/* Interactive Points */}
                  <circle cx="160" cy="90" r="4" fill="#6366f1" stroke="white" strokeWidth="1.5" />
                  <circle cx="320" cy="50" r="4" fill="#6366f1" stroke="white" strokeWidth="1.5" />
                  <circle cx="500" cy="20" r="4" fill="#6366f1" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono font-bold text-neutral-400 mt-4 pt-2 border-t border-neutral-50">
                <span>BATCH ALPHA</span>
                <span>BATCH BETA</span>
                <span>LIVE UPDATES</span>
              </div>
            </div>

            {/* Inventory Distribution Pie Chart */}
            <div className="rounded-2xl border border-[#EFEBE4] bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#17111F] mb-1">Stock Composition</h3>
                <p className="text-xs text-neutral-400">Total volume distribution summary</p>
              </div>
              
              <div className="flex justify-center items-center my-4">
                <div className="relative w-36 h-36">
                  {/* SVG Conic Gradient Simulation Representation */}
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    {/* Circle Segment 1: Indigo */}
                    <circle cx="18" cy="18" r="15.91" fill="none" stroke="#6366f1" strokeWidth="4" strokeDasharray="45 100" strokeDashoffset="0" />
                    {/* Circle Segment 2: Emerald */}
                    <circle cx="18" cy="18" r="15.91" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="30 100" strokeDashoffset="-45" />
                    {/* Circle Segment 3: Amber */}
                    <circle cx="18" cy="18" r="15.91" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-75" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-lg font-black text-[#17111F]">{totalStock}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Total Items</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Legend Vector */}
              <div className="space-y-2 pt-2 border-t border-neutral-50">
                <div className="flex justify-between items-center text-[11px]">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#6366f1]"/> <span className="text-neutral-500">Products Group</span></div>
                  <span className="font-mono font-bold text-neutral-700">{totalProducts} Items</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10b981]"/> <span className="text-neutral-500">Active Categories</span></div>
                  <span className="font-mono font-bold text-neutral-700">{totalCategories} Keys</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent products table container */}
          <div className="rounded-2xl border border-[#EFEBE4] bg-white shadow-sm overflow-hidden transition-all duration-300">
            <div className="flex items-center justify-between border-b border-[#EFEBE4] px-6 py-5 bg-neutral-50/50">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#17111F]">
                Recent Ledger Entries
              </h2>
              <span className="text-xs font-mono text-[#6366f1] bg-[#6366f1]/5 px-3 py-1 rounded-full border border-[#6366f1]/10 font-bold">
                Batch: {product.length} Units
              </span>
            </div>

            {loading ? (
              <div className="space-y-3 p-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-neutral-50 border border-neutral-100" />
                ))}
              </div>
            ) : product.length === 0 ? (
              <div className="px-6 py-20 text-center">
                <div className="text-neutral-300 text-4xl mb-3">📭</div>
                <p className="text-sm font-medium text-neutral-500">No matching logs found inside ledger</p>
                <p className="mt-1 text-xs text-neutral-400">New asset updates will synchronize automatically.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-left">
                  <thead>
                    <tr className="bg-neutral-50/30 text-[11px] font-bold uppercase tracking-widest text-neutral-400 border-b border-[#EFEBE4]">
                      <th className="px-6 py-4 w-20">Graphic</th>
                      <th className="px-6 py-4">Product Identifier</th>
                      <th className="px-6 py-4">Valuation Matrix</th>
                      <th className="px-6 py-4">Available Units</th>
                      <th className="px-6 py-4 w-32">Status Vector</th>
                    </tr>
                  </thead>

                  <motion.tbody variants={containerStagger} initial="hidden" animate="visible">
                    {product.map((item) => (
                      <motion.tr
                        key={item._id}
                        variants={rowVariant}
                        className="border-b border-[#EFEBE4] last:border-0 transition-colors duration-150 hover:bg-neutral-50/60"
                      >
                        <td className="px-6 py-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-12 w-12 rounded-xl border border-neutral-200 object-cover bg-neutral-50 shadow-sm"
                            loading="lazy"
                          />
                        </td>

                        <td className="px-6 py-4 text-sm font-bold text-[#17111F]">
                          {item.title}
                        </td>

                        <td className="px-6 py-4 font-mono text-sm text-neutral-600 font-medium">
                          Rs. {Number(item.price).toLocaleString()}
                        </td>

                        <td className="px-6 py-4 font-mono text-sm text-neutral-600 font-medium">
                          {item.stock}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                              item.status === "active"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                : "bg-rose-50 text-rose-600 border border-rose-200"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${item.status === "active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                            {item.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              </div>
            )}
          </div>

          {/* Minimalist Light Pagination Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 border active:scale-98
                ${page === 1
                  ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed border-dashed opacity-60"
                  : "bg-white text-neutral-700 border-[#EFEBE4] hover:border-neutral-400 hover:bg-neutral-50"
                }`}
            >
              <FaChevronLeft className="text-[10px]" /> Prev
            </button>

            <div className="bg-white border border-[#EFEBE4] px-5 py-2.5 rounded-xl shadow-sm min-w-[120px] text-center">
              <span className="font-mono text-xs font-bold text-neutral-600">
                PAGE {page} <span className="text-neutral-300 mx-1">/</span> {totalpage}
              </span>
            </div>

            <button
              disabled={page === totalpage}
              onClick={() => setPage(page + 1)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 border active:scale-98
                ${page === totalpage
                  ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed border-dashed opacity-60"
                  : "bg-white text-neutral-700 border-[#EFEBE4] hover:border-neutral-400 hover:bg-neutral-50"
                }`}
            >
              Next <FaChevronRight className="text-[10px]" />
            </button>
          </div>
     
        </div>
      </main>
    </div>
  );
};

export default Seller;