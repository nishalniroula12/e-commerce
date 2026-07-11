import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminSidebar from "../../component/AdminSidebar";

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

      // Backend returns { success, sellers }
      setSeller(res.data.sellers || res.data.seller || []);
    } catch (err) {
      console.log(err);
      setError("Couldn't load sellers. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Single source of truth for approve/reject.
  // Backend route just needs :id + { status } in the body — reuse one endpoint for both actions.
  const updateSellerStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      const res = await axios.put(
        `http://localhost:8000/api/sellerapprove/${id}`,
        { status },
        { withCredentials: true }
      );

      const updated = res.data.seller;
      // Update in place instead of refetching everything
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
    approved: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    rejected: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
    pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  };

  const filters = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      {/* Offset the main content so it never sits under a fixed sidebar.
          Adjust ml-64 to match your sidebar's actual width. */}
<main className="flex-1 px-6 py-8">
            <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Seller Management</h1>
              <p className="text-slate-500 mt-1">
                Review shop details and approve or reject seller applications.
              </p>
            </div>

            <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm w-fit">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                    filter === f.key
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse"
                >
                  <div className="w-20 h-20 rounded-full bg-slate-200 mx-auto" />
                  <div className="h-4 bg-slate-200 rounded mt-4 w-2/3 mx-auto" />
                  <div className="h-3 bg-slate-200 rounded mt-3 w-full" />
                  <div className="h-3 bg-slate-200 rounded mt-2 w-5/6" />
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
                      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col"
                    >
                      <img
                        src={item.shoplogo || "https://placehold.co/96x96?text=Shop"}
                        alt={item.shopname || "Shop logo"}
                        className="w-24 h-24 rounded-full object-cover mx-auto border border-slate-100"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/96x96?text=Shop";
                        }}
                      />

                      <h2 className="text-lg font-semibold text-center mt-4 text-slate-900">
                        {item.shopname || "Unnamed shop"}
                      </h2>
                      {item.user?.email && (
                        <p className="text-center text-sm text-slate-400">{item.user.email}</p>
                      )}

                      <div className="mt-4 space-y-2 text-sm text-slate-600 flex-1">
                        <p>
                          <span className="font-medium text-slate-800">Address:</span>{" "}
                          {item.address || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium text-slate-800">Tax Number:</span>{" "}
                          {item.taxnumber || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium text-slate-800">Total Sales:</span>{" "}
                          {item.totalsales || 0}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">Status:</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                              statusStyles[status] || statusStyles.pending
                            }`}
                          >
                            {status}
                          </span>
                        </p>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => updateSellerStatus(item._id, "approved")}
                          disabled={isUpdating || status === "approved"}
                          className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          {isUpdating ? "..." : "Approve"}
                        </button>

                        <button
                          onClick={() => updateSellerStatus(item._id, "rejected")}
                          disabled={isUpdating || status === "rejected"}
                          className="flex-1 bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          {isUpdating ? "..." : "Reject"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredSellers.length === 0 && (
                <div className="text-center text-slate-400 mt-16">
                  No sellers found{filter !== "all" ? ` for "${filter}"` : ""}.
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