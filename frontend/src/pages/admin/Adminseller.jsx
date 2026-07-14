import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminSidebar from "../../component/AdminSidebar";

/* ────────────────────────────────────────────────────────────────────────
   Design tokens: Minimalist Editorial Light
   - Primary Background: Warm Paper White (#FBF9F6) -> Base page body
   - Surface Panels: Stark Pure White (#FFFFFF)
   - Border Elements: Soft Muted Mist (#EFEBE4)
   - Accent Text: Slate Charcoal Black (#17111F)
   ─────────────────────────────────────────────────────────────────────── */

const Adminseller = () => {
  const [seller, setSeller] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchSeller = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:8000/api/getseller", {
        withCredentials: true,
      });
      setSeller(res.data.sellers || res.data.seller || []);
    } catch (err) {
      console.log(err);
      setError("Couldn't load sellers. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateSellerStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      const res = await axios.put(
        `http://localhost:8000/api/sellerapprove/${id}`,
        { status },
        { withCredentials: true }
      );

      const updated = res.data.seller;
      setSeller((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, verificationstatus: updated?.verificationstatus || status } : item
        )
      );
    } catch (err) {
      console.log(err.response?.data || err);
      setError("Couldn't update seller status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchSeller();
  }, []);

  const filteredSellers =
    filter === "all"
      ? seller
      : seller.filter((item) => item.verificationstatus === filter);

  const statusStyles = {
    approved: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    rejected: "bg-rose-50 text-rose-600 border border-rose-200",
    pending: "bg-amber-50 text-amber-600 border border-amber-200",
  };

  const filters = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="flex min-h-screen bg-[#FBF9F6] text-neutral-800 antialiased font-sans">
      <AdminSidebar />

      <main className="flex-1 w-full min-w-0 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#EFEBE4] pb-6">
            <div>
              <h1 className="font-sans text-2xl font-extrabold tracking-tight text-[#17111F] sm:text-3xl">
                Seller Management
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Review shop details and approve or reject seller applications.
              </p>
            </div>

            <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-[#EFEBE4] shadow-sm w-fit">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                    filter === f.key
                      ? "bg-[#17111F] text-white shadow-sm"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 text-xs font-bold tracking-wide uppercase">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-[#EFEBE4] p-6 shadow-sm animate-pulse space-y-4"
                >
                  <div className="w-24 h-24 rounded-full bg-neutral-100 mx-auto" />
                  <div className="h-4 bg-neutral-100 rounded w-2/3 mx-auto" />
                  <div className="space-y-2">
                    <div className="h-3 bg-neutral-100 rounded w-full" />
                    <div className="h-3 bg-neutral-100 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSellers.map((item) => {
                  const isUpdating = updatingId === item._id;
                  const status = item.verificationstatus || "pending";

                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl border border-[#EFEBE4] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-6 flex flex-col justify-between"
                    >
                      <div>
                        <img
                          src={item.shoplogo || "https://placehold.co/96x96?text=Shop"}
                          alt={item.shopname || "Shop logo"}
                          className="w-24 h-24 rounded-full object-cover mx-auto border border-neutral-100 shadow-sm bg-neutral-50"
                          onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/96x96?text=Shop";
                          }}
                        />

                        <h2 className="text-base font-bold text-center mt-4 text-[#17111F] tracking-tight">
                          {item.shopname || "Unnamed shop"}
                        </h2>
                        {item.user?.email && (
                          <p className="text-center font-mono text-xs text-neutral-400 mt-0.5">{item.user.email}</p>
                        )}

                        <div className="mt-6 space-y-2.5 text-xs text-neutral-600 border-t border-neutral-50 pt-4">
                          <p className="flex justify-between items-start gap-4">
                            <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Address</span>{" "}
                            <span className="text-right text-neutral-700 font-medium">{item.address || "N/A"}</span>
                          </p>
                          <p className="flex justify-between items-center gap-4">
                            <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Tax Number</span>{" "}
                            <span className="font-mono text-neutral-700 font-medium">{item.taxnumber || "N/A"}</span>
                          </p>
                          <p className="flex justify-between items-center gap-4">
                            <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Total Sales</span>{" "}
                            <span className="font-mono text-neutral-700 font-bold">{Number(item.totalsales || 0).toLocaleString()}</span>
                          </p>
                          <p className="flex justify-between items-center gap-4">
                            <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Status</span>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                statusStyles[status] || statusStyles.pending
                              }`}
                            >
                              <span className={`h-1 w-1 rounded-full ${
                                status === "approved" ? "bg-emerald-500" : status === "rejected" ? "bg-rose-500" : "bg-amber-500"
                              }`} />
                              {status}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6 pt-4 border-t border-neutral-50">
                        <button
                          onClick={() => updateSellerStatus(item._id, "approved")}
                          disabled={isUpdating || status === "approved"}
                          className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-98 transition-all duration-150 shadow-sm"
                        >
                          {isUpdating && updatingId === item._id ? "..." : "Approve"}
                        </button>

                        <button
                          onClick={() => updateSellerStatus(item._id, "rejected")}
                          disabled={isUpdating || status === "rejected"}
                          className="flex-1 bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-98 transition-all duration-150 shadow-sm"
                        >
                          {isUpdating && updatingId === item._id ? "..." : "Reject"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredSellers.length === 0 && (
                <div className="text-center text-neutral-400 mt-20 p-8 border border-dashed border-[#EFEBE4] rounded-2xl bg-white shadow-sm">
                  <div className="text-3xl mb-2">🔎</div>
                  <p className="text-sm font-medium">No accounts registered under this tier</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Filter criteria: "{filter}"</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Adminseller;