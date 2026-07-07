import React, { useEffect, useState } from "react";
import AdminSidebar from "../../component/AdminSidebar";

import axios from "axios";
import { motion } from "framer-motion";
import { FaBoxOpen, FaTags, FaWarehouse, FaCoins } from "react-icons/fa";

/**
 * Variant Theme: Amethyst Obsidian
 * - Primary Background: Dark Obsidian Velvet (#0C0A12)
 * - Container Surfaces: Deep Amethyst Zinc (#14111F)
 * - Highlights: Electric purple & stark terminal accents
 */

const containerStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const rowVariant = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

const useCountUp = (target, duration = 800) => {
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
      whileHover={{ y: -4, borderColor: `${accent}44` }}
      className="relative rounded-2xl border border-purple-950/40 bg-[#14111F] p-6 shadow-xl shadow-black/40 transition-colors duration-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-purple-300/50">
            {label}
          </p>
          <p className="mt-2 font-mono text-3xl font-bold text-white">
            {prefix}
            {animated.toLocaleString()}
          </p>
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent}18`, color: accent }}
        >
          <Icon className="text-[16px]" />
        </div>
      </div>

      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-purple-950/20">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
          className="h-full rounded-full"
          style={{ backgroundColor: accent }}
        />
      </div>
    </motion.div>
  );
};

const StatSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-purple-950/40 bg-[#14111F] p-6">
    <div className="h-3 w-20 rounded bg-purple-950/30" />
    <div className="mt-3 h-8 w-24 rounded bg-purple-950/30" />
    <div className="mt-6 h-1.5 w-full rounded-full bg-purple-950/20" />
  </div>
);

const Adminpage = () => {
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const now = useClock();
  const[page,setpage] =useState(1)
  const [totalpage ,settotalpage] =useState(1)

  const fetchallinone = async () => {
    try {
      const [productRes, categoryRes] = await Promise.all([
        axios.get("http://localhost:8000/api/get",{params:{
          page,
          limit:3
        }}, {
          withCredentials: true,
        }),
        axios.get("http://localhost:8000/api/public", {
          withCredentials: true,
        }),
      ]);

      setProduct(productRes.data.product || []);
      settotalpage(productRes.data.totalpage)
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
      label: "Total products",
      value: totalProducts,
      icon: FaBoxOpen,
      accent: "#a78bfa", // Vivid Lavender
      percent: Math.min((totalProducts / 100) * 100, 100),
    },
    {
      label: "Total categories",
      value: totalCategories,
      icon: FaTags,
      accent: "#34d399", // Mint Green
      percent: Math.min((totalCategories / 20) * 100, 100),
    },
    {
      label: "Total stock",
      value: totalStock,
      icon: FaWarehouse,
      accent: "#fb923c", // Bright Amber
      percent: Math.min((totalStock / 1000) * 100, 100),
    },
    {
      label: "Inventory value",
      value: totalValue,
      prefix: "Rs. ",
      icon: FaCoins,
      accent: "#f472b6", // Hot Pink Rose
      percent: Math.min((totalValue / 100000) * 100, 100),
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0C0A12] text-purple-100/90 antialiased selection:bg-purple-500/30">
      <AdminSidebar />

      <main className="flex-1 w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header section */}
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-purple-950/30 pb-6">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#a78bfa]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#a78bfa] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#a78bfa]" />
                </span>
                Core Active
              </p>
              <h1 className="mt-1 font-sans text-2xl font-bold tracking-tight text-white sm:text-3xl">
                System Console
              </h1>
            </div>
            <p className="font-mono text-xs text-purple-300/60 bg-[#14111F] px-3 py-1.5 rounded-xl border border-purple-950/40 sm:text-sm">
              {now.toLocaleDateString(undefined, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              {" · "}
              {now.toLocaleTimeString()}
            </p>
          </div>

          {/* Stat cards */}
          <motion.div
            variants={containerStagger}
            initial="hidden"
            animate="visible"
            className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
          >
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
              : stats.map((s) => <StatCard key={s.label} {...s} />)}
          </motion.div>

          {/* Recent products table container */}
          <div className="rounded-2xl border border-purple-950/40 bg-[#14111F] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-purple-950/40 px-6 py-5">
              <h2 className="text-base font-semibold text-white">
                Recent Ledger Entries
              </h2>
              <span className="text-xs font-mono text-purple-300/50 bg-[#0C0A12] px-2.5 py-1 rounded-md border border-purple-950/20">
                Size: {Math.min(product.length, 8)} / {product.length}
              </span>
            </div>

            {loading ? (
              <div className="space-y-3 p-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded-lg bg-purple-950/10" />
                ))}
              </div>
            ) : product.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-sm font-medium text-purple-300/70">No matching logs inside ledger</p>
                <p className="mt-1 text-xs text-purple-500">New asset rows appear automatically.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <thead>
                    <tr className="bg-[#0C0A12]/50 text-[11px] font-bold uppercase tracking-widest text-purple-300/50 border-b border-purple-950/40">
                      <th className="px-6 py-4">Graphic</th>
                      <th className="px-6 py-4">Product Identifier</th>
                      <th className="px-6 py-4">Valuation Matrix</th>
                      <th className="px-6 py-4">Available Units</th>
                      <th className="px-6 py-4">Status Vector</th>
                    </tr>
                  </thead>

                  <motion.tbody variants={containerStagger} initial="hidden" animate="visible">
                    {product.slice(0, 8).map((item) => (
                      <motion.tr
                        key={item._id}
                        variants={rowVariant}
                        className="border-b border-purple-950/20 last:border-0 transition-colors hover:bg-purple-950/10"
                      >
                        <td className="px-6 py-3.5">
                          <img
                            src={item.image}
                            alt={item.title}
                            width="44"
                            height="44"
                            className="h-11 w-11 rounded-lg border border-purple-900/30 object-cover bg-purple-950"
                          />
                        </td>

                        <td className="px-6 py-3.5 text-sm font-medium text-purple-100">
                          {item.title}
                        </td>

                        <td className="px-6 py-3.5 font-mono text-sm text-purple-200">
                          Rs. {Number(item.price).toLocaleString()}
                        </td>

                        <td className="px-6 py-3.5 font-mono text-sm text-purple-200">
                          {item.stock}
                        </td>

                        <td className="px-6 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              item.status === "active"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                item.status === "active" ? "bg-emerald-400" : "bg-rose-400"
                              }`}
                            />
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
          <div className="flex items-center justify-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setpage(page - 1)}
          className={`px-5 py-2 rounded-xl font-medium transition
      ${
        page === 1
          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
      }`}
        >
          ← Prev
        </button>

        <div className="bg-white shadow px-5 py-2 rounded-xl border">
          <span className="font-semibold text-slate-700">
            Page {page} of {totalpage}
          </span>
        </div>

        <button
          disabled={page === totalpage}
          onClick={() => setpage(page + 1)}
          className={`px-5 py-2 rounded-xl font-medium transition
      ${
        page === totalpage
          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
      }`}
        >
          Next →
        </button>
      </div>
     
        </div>

      </main>
    </div>
  );
};

export default Adminpage;