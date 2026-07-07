import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../component/Sidebar";

// ── animation variants ────────────────────────────────────────────────
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
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.16 } },
};

// ── stat card ────────────────────────────────────────────────
const StatCard = ({ label, value, color }) => (
  <div className={`flex-1 min-w-[110px] rounded-2xl p-4 ${color}`}>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
    <p className="text-xs text-slate-500 mt-0.5">{label}</p>
  </div>
);

// ── component ────────────────────────────────────────────────
const Allproduct = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page ,setpage] =useState(1)
  const [totalpage ,settotalpage]=useState(1)

  const nav = useNavigate();  

  // FETCH PRODUCTS
  const productfetch = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/get",{
        params:{
          page,
          limit:2
        }
      });
      setData(res.data.product || []);
      settotalpage(res.data.totalpage)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    productfetch();
  }, [page]);

  // FILTER
  const filtered = data.filter(
    (item) =>
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = data.filter((d) => d.status === "active").length;
  const inactiveCount = data.length - activeCount;

  // DELETE
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      await axios.delete(
        `http://localhost:8000/api/remove/${deleteTarget._id}`
      );

      setData((prev) =>
        prev.filter((d) => d._id !== deleteTarget._id)
      );
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-8 overflow-x-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">All Products</h2>
            <p className="text-sm text-slate-400">Manage your product inventory</p>
          </div>

          <button
            onClick={() => nav("/addproduct")}
            className="bg-emerald-600 text-white px-5 py-2 rounded-xl"
          >
            + Add Product
          </button>
        </div>

        {/* STATS */}
        <div className="flex gap-3 mb-6">
          <StatCard label="Total" value={data.length} color="bg-white shadow-sm" />
          <StatCard label="Active" value={activeCount} color="bg-emerald-50" />
          <StatCard label="Inactive" value={inactiveCount} color="bg-red-50" />
        </div>

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="mb-5 px-4 py-2 border rounded-xl w-full max-w-sm"
        />

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* HEADER ROW */}
          <div className="hidden md:grid grid-cols-[40px_1fr_80px_120px_100px_80px_90px_110px] gap-4 px-5 py-3 bg-slate-50 text-xs font-semibold text-slate-400">
            <span>#</span>
            <span>Title</span>
            <span className="text-center">Image</span>
            <span className="text-center">Category</span>
            <span className="text-center">Price</span>
            <span className="text-center">Stock</span>
            <span className="text-center">Status</span>
            <span className="text-center">Actions</span>
          </div>

          {/* BODY */}
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y"
          >
            <AnimatePresence>
              {filtered.length > 0 ? (
                filtered.map((item, index) => (
                  <motion.li
                    key={item._id}
                    variants={rowVariants}
                    exit="exit"
                    className="grid grid-cols-1 md:grid-cols-[40px_1fr_80px_120px_100px_80px_90px_110px] gap-4 px-5 py-4 items-center"
                  >
                    {/* SN */}
                    <span className="hidden md:block text-xs text-slate-400">
                      {index + 1}
                    </span>

                    {/* TITLE */}
                    <span className="font-semibold">{item.title}</span>

                    {/* IMAGE */}
                    <div className="flex justify-center">
                      <img
                        src={item.image}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    </div>

                    {/* CATEGORY ⭐ FIX ADDED HERE */}
                    <p className="text-sm text-center text-slate-600">
                      {item.category?.title || "No Category"}
                    </p>

                    {/* PRICE */}
                    <p className="text-sm text-center">
                      Rs {item.price}
                    </p>

                    {/* STOCK */}
                    <p className="text-sm text-center">
                      {item.stock}
                    </p>

                    {/* STATUS */}
                    <div className="flex justify-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => nav(`/addproduct/${item._id}`)}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.li>
                ))
              ) : (
                <motion.li className="text-center py-10 text-slate-500">
                  No Products Found
                </motion.li>
              )}
            </AnimatePresence>
          </motion.ul>
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
      

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => !deleting && setDeleteTarget(null)}
          >
            <motion.div
              className="bg-white p-6 rounded-xl"
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-bold mb-2">Delete Product?</h3>
              <p className="text-sm mb-4">{deleteTarget.title}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 border rounded-lg py-2"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-500 text-white rounded-lg py-2"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
     </div>
     
  );
};

export default Allproduct;