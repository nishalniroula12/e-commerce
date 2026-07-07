import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../component/Sidebar";

// ── animation variants ──────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.22 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.84, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring", stiffness: 320, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.16 } },
};

// ── helpers ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color }) => (
  <div className={`flex-1 min-w-[110px] rounded-2xl p-4 ${color}`}>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
    <p className="text-xs text-slate-500 mt-0.5">{label}</p>
  </div>
);

// ── component ────────────────────────────────────────────────────────────────
const Allcategory = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null); // item to confirm-delete
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const [page ,setpage]=useState(1)
  const [totalpage ,settotalpage] =useState(1)

  const categoryfetch = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/public",{
        params:{
          page,
          limit:3
        }
      });
      setData(res.data.category || []);
      settotalpage(res.data.totalpage)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { categoryfetch(); }, [page]);

  const filtered = data.filter(
    (item) =>
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = data.filter((d) => d.status === "active").length;
  const inactiveCount = data.length - activeCount;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:8000/api/getout/${deleteTarget._id}`);
      setData((prev) => prev.filter((d) => d._id !== deleteTarget._id));
    } catch (err) {
      console.log(err);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-8 overflow-x-hidden">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              All Categories
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Manage and organise your content categories
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/addcategory")}
            className="self-start sm:self-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm shadow-emerald-200 transition-colors"
          >
            <span className="text-lg leading-none">+</span> Add Category
          </motion.button>
        </div>

        {/* ── Stat bar ── */}
        <div className="flex flex-wrap gap-3 mb-6">
          <StatCard label="Total" value={data.length} color="bg-white shadow-sm" />
          <StatCard label="Active" value={activeCount} color="bg-emerald-50" />
          <StatCard label="Inactive" value={inactiveCount} color="bg-red-50" />
        </div>

        {/* ── Search ── */}
        <div className="relative mb-5 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories…"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all"
          />
        </div>

        {/* ── Table card ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">

          {/* Table head */}
          <div className="hidden md:grid grid-cols-[40px_1fr_1.4fr_72px_80px_90px_110px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>#</span>
            <span>Title</span>
            <span>Description</span>
            <span className="text-center">Image</span>
            <span className="text-center">Order</span>
            <span className="text-center">Status</span>
            <span className="text-center">Actions</span>
          </div>

          {/* Rows */}
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-slate-50"
          >
            <AnimatePresence>
              {filtered.length > 0 ? (
                filtered.map((item, index) => (
                  <motion.li
                    key={item._id}
                    variants={rowVariants}
                    exit="exit"
                    layout
                    className="grid grid-cols-1 md:grid-cols-[40px_1fr_1.4fr_72px_80px_90px_110px] gap-x-4 gap-y-2 px-5 py-4 items-center hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* SN */}
                    <span className="hidden md:block text-xs text-slate-400 font-mono">
                      {index + 1}
                    </span>

                    {/* Title */}
                    <div className="flex items-center gap-3">
                      {/* mobile image inline */}
                      <motion.div
                        whileHover={{ y: -3, scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        className="md:hidden shrink-0 w-10 h-10 rounded-xl overflow-hidden border border-slate-100 shadow-sm"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <span className="font-semibold text-slate-800 text-sm truncate">
                        {item.title}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-500 truncate hidden md:block">
                      {item.description || "—"}
                    </p>

                    {/* Image (desktop) */}
                    <div className="hidden md:flex justify-center">
                      <motion.div
                        whileHover={{ y: -4, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 280, damping: 16 }}
                        className="w-11 h-11 rounded-xl overflow-hidden border border-slate-100 shadow-sm"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    </div>

                    {/* Sort order */}
                    <p className="text-sm text-slate-500 text-center hidden md:block">
                      {item.sortorder ?? "—"}
                    </p>

                    {/* Status */}
                    <div className="flex md:justify-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === "active" ? "bg-emerald-500" : "bg-red-400"
                          }`}
                        />
                        {item.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:justify-center">
                      <motion.button
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => navigate(`/addcategory/${item._id}`)}
                        className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        ✏️ Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => setDeleteTarget(item)}
                        className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        🗑 Delete
                      </motion.button>
                    </div>
                  </motion.li>
                ))
              ) : (
                <motion.li
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-16 text-center"
                >
                  <p className="text-4xl mb-3">📂</p>
                  <p className="text-slate-500 font-medium">No categories found</p>
                  <p className="text-slate-400 text-sm mt-1">
                    {search ? "Try a different search term." : "Add your first category to get started."}
                  </p>
                </motion.li>
              )}
            </AnimatePresence>
          </motion.ul>
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

        {filtered.length > 0 && (
          <p className="text-xs text-slate-400 mt-3 text-right">
            Showing {filtered.length} of {data.length} categories
          </p>
        )}
      </div>

      {/* ── Delete Confirm Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            key="del-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4"
            onClick={() => !deleting && setDeleteTarget(null)}
          >
            <motion.div
              key="del-modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 text-center"
            >
              <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-2xl">
                🗑
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                Delete category?
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                <span className="font-semibold text-slate-700">
                  "{deleteTarget.title}"
                </span>{" "}
                will be permanently removed. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {deleting ? "Deleting…" : "Yes, delete"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Allcategory;