import React, { useEffect, useState } from "react";
import AdminSidebar from "../../component/AdminSidebar";
import axios from "axios";
import { motion } from "framer-motion";
import { FaBoxOpen, FaTags, FaWarehouse, FaCoins, FaChevronLeft, FaChevronRight } from "react-icons/fa";

/* ────────────────────────────────────────────────────────────────────────
   Design tokens: Minimalist Editorial Light
   - Base background: Smooth Slate Gray (bg-slate-50)
   - Component surfaces: Stark Pure White (bg-white)
   - Accent text: Slate Charcoal Black (text-slate-900)
   - Borders: Slate Misted Lines (border-slate-200)
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
      className="relative rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <p className="mt-1 font-mono text-3xl font-extrabold text-slate-900 tracking-tight">
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

      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
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
  <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="h-3 w-16 rounded bg-slate-100" />
    <div className="mt-3 h-7 w-28 rounded bg-slate-100" />
    <div className="mt-6 h-1.5 w-full rounded-full bg-slate-100" />
  </div>
);

const Adminpage = () => {
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const now = useClock();
  const [page, setpage] = useState(1);
  const [totalpage, settotalpage] = useState(1);

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
      settotalpage(productRes.data.totalpage || 1);
      setCategory(categoryRes.data.category || []);
    } catch (error) {
      console.log(error);
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
      accent: "#6366f1", // Clean Indigo
      percent: Math.min((totalProducts / 100) * 100, 100),
    },
    {
      label: "Total Categories",
      value: totalCategories,
      icon: FaTags,
      accent: "#10b981", // Emerald Green
      percent: Math.min((totalCategories / 20) * 100, 100),
    },
    {
      label: "Total Stock",
      value: totalStock,
      icon: FaWarehouse,
      accent: "#f59e0b", // Amber Yellow
      percent: Math.min((totalStock / 1000) * 100, 100),
    },
    {
      label: "Inventory Value",
      value: totalValue,
      prefix: "Rs. ",
      icon: FaCoins,
      accent: "#ec4899", // Clean Pink
      percent: Math.min((totalValue / 100000) * 100, 100),
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      <AdminSidebar />

      <main className="flex-1 w-full min-w-0 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-indigo-600">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-600 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-600" />
                </span>
                Core Active
              </p>
              <h1 className="mt-1 font-sans text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                System Console
              </h1>
            </div>
            
            <p className="font-mono text-xs text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 self-start sm:self-auto shadow-sm">
              {now.toLocaleDateString(undefined, {
                weekday: "short", year: "numeric", month: "short", day: "numeric"
              })}
              <span className="text-slate-300 mx-2">·</span>
              <span className="text-slate-800 font-semibold">{now.toLocaleTimeString()}</span>
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

          {/* Recent products table container */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all duration-300">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 bg-slate-50/50">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Recent Ledger Entries
              </h2>
              <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 font-bold">
                Size: {Math.min(product.length, 8)} / {product.length}
              </span>
            </div>

            {loading ? (
              <div className="space-y-3 p-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-50 border border-slate-100" />
                ))}
              </div>
            ) : product.length === 0 ? (
              <div className="px-6 py-20 text-center">
                <div className="text-slate-300 text-4xl mb-3">📭</div>
                <p className="text-sm font-medium text-slate-500">No matching logs inside ledger</p>
                <p className="mt-1 text-xs text-slate-400">New asset rows appear automatically.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50/30 text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200">
                      <th className="px-6 py-4 w-20">Graphic</th>
                      <th className="px-6 py-4">Product Identifier</th>
                      <th className="px-6 py-4">Valuation Matrix</th>
                      <th className="px-6 py-4">Available Units</th>
                      <th className="px-6 py-4 w-32">Status Vector</th>
                    </tr>
                  </thead>

                  <motion.tbody variants={containerStagger} initial="hidden" animate="visible">
                    {product.slice(0, 8).map((item) => (
                      <motion.tr
                        key={item._id}
                        variants={rowVariant}
                        className="border-b border-slate-200 last:border-0 transition-colors duration-150 hover:bg-slate-50/60"
                      >
                        <td className="px-6 py-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-12 w-12 rounded-xl border border-slate-200 object-cover bg-slate-50 shadow-sm"
                            loading="lazy"
                          />
                        </td>

                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                          {item.title}
                        </td>

                        <td className="px-6 py-4 font-mono text-sm text-slate-600 font-medium">
                          Rs. {Number(item.price).toLocaleString()}
                        </td>

                        <td className="px-6 py-4 font-mono text-sm text-slate-600 font-medium">
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
              onClick={() => setpage(page - 1)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 border active:scale-95
                ${page === 1
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed border-dashed opacity-60"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                }`}
            >
              <FaChevronLeft className="text-[10px]" /> Prev
            </button>

            <div className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl shadow-sm min-w-[120px] text-center">
              <span className="font-mono text-xs font-bold text-slate-600">
                PAGE {page} <span className="text-slate-300 mx-1">/</span> {totalpage}
              </span>
            </div>

            <button
              disabled={page === totalpage}
              onClick={() => setpage(page + 1)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 border active:scale-95
                ${page === totalpage
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed border-dashed opacity-60"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
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

export default Adminpage;