import axios from "axios";
import React, { useEffect, useState } from "react";
import Sidebar from "../../component/Sidebar";
import { motion } from "framer-motion";
import {
  FaBox,
  FaMapMarkerAlt,
  FaReceipt,
} from "react-icons/fa";

const containerStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const itemVariant = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

const OrderSkeleton = () => (
  <div className="mb-6 animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
    <div className="mb-4 flex justify-between border-b border-slate-100 pb-4">
      <div className="h-5 w-40 rounded bg-slate-200" />
      <div className="h-5 w-24 rounded bg-slate-200" />
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-slate-100" />
        <div className="h-4 w-3/4 rounded bg-slate-100" />
      </div>
      <div className="h-20 rounded bg-slate-100" />
    </div>
  </div>
);

const Order = () => {
  const [order, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/createorder", {
        withCredentials: true,
      });
      console.log("API Response Debug:", res.data); // Helpful for checking inner structures!
      setOrders(res.data.order || res.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status) => {
    const lowerStatus = status?.toLowerCase();
    if (
      lowerStatus === "delivered" ||
      lowerStatus === "completed" ||
      lowerStatus === "paid"
    ) {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }
    if (lowerStatus === "pending" || lowerStatus === "processing") {
      return "bg-amber-50 text-amber-700 border border-amber-200";
    }
    return "bg-slate-100 text-slate-700 border border-slate-300";
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 antialiased lg:flex-row">
      <Sidebar />

      <main className="w-full min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          
          {/* Header section */}
          <div className="mb-8 border-b border-slate-200 pb-6">
            <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              <FaReceipt className="text-xs" /> Order history
            </p>
            <h1 className="mt-1 font-sans text-2xl font-extrabold uppercase tracking-wider text-slate-900 sm:text-3xl">
              My orders
            </h1>
          </div>

          {loading ? (
            <div className="space-y-4">
              <OrderSkeleton />
              <OrderSkeleton />
            </div>
          ) : order.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <FaBox className="mx-auto mb-4 text-4xl text-slate-300" />
              <p className="text-sm font-bold uppercase tracking-wider text-slate-700">
                No orders yet
              </p>
              <p className="mt-1 text-xs text-slate-400 font-medium">
                Orders placed in the system will show up here.
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerStagger}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {order.map((item) => {
                // Defensive fallback check in case backend structure relies on alternate naming patterns
                const orderItems = item.items || item.orderItems || [];

                return (
                  <motion.div
                    key={item._id}
                    variants={cardVariant}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                  >
                    {/* Card header metadata */}
                    <div className="mb-5 flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                      <div>
                        <span className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                          Order reference
                        </span>
                        <span className="break-all font-mono text-sm font-bold text-slate-900">
                          {item.orderId || item._id}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(
                            item.status
                          )}`}
                        >
                          <span className="h-1 w-1 rounded-full bg-current" />
                          {item.status || "Unknown"}
                        </span>
                        {item.paymentstatus && (
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(
                              item.paymentstatus
                            )}`}
                          >
                            {item.paymentstatus}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Core info grids */}
                    <div className="mb-5 grid grid-cols-1 gap-6 border-b border-slate-100 pb-5 md:grid-cols-12">
                      {/* Payment summary meta */}
                      <div className="space-y-2 md:col-span-5">
                        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Method
                          </span>
                          <span className="font-mono text-xs font-bold uppercase text-slate-700">
                            {item.paymentmethod || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Total
                          </span>
                          <span className="font-mono text-base font-extrabold text-slate-900">
                            Rs. {Number(item.totalAmount || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Shipping address container */}
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-7">
                        <h4 className="mb-2 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                          <FaMapMarkerAlt className="text-slate-500" /> Shipping address
                        </h4>
                        <div className="space-y-0.5 text-xs font-medium text-slate-600">
                          <p className="font-bold text-slate-800">
                            {item.shippingaddress?.name || "No name detailed"}{" "}
                            {item.shippingaddress?.phone && (
                              <span className="ml-1 font-normal font-mono text-slate-400">
                                ({item.shippingaddress?.phone})
                              </span>
                            )}
                          </p>
                          <p>
                            {item.shippingaddress?.street || item.shippingaddress?.addressLine1 || ""},{" "}
                            {item.shippingaddress?.city || ""}
                          </p>
                          <p>
                            {item.shippingaddress?.state || ""} {item.shippingaddress?.zipCode || ""} · {item.shippingaddress?.country || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Line items layout inside the order block */}
                    <div>
                      <h4 className="mb-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                        Items Purchased ({orderItems.length})
                      </h4>
                      <motion.div
                        variants={containerStagger}
                        initial="hidden"
                        animate="visible"
                        className="space-y-2.5"
                      >
                        {orderItems.map((subItem) => (
                          <motion.div
                            key={subItem._id}
                            variants={itemVariant}
                            className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-50 transition-colors"
                          >
                            {subItem.image || subItem.product?.image ? (
                              <img
                                src={subItem.image || subItem.product?.image}
                                alt={subItem.product?.title || "Product item"}
                                className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 bg-white object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400">
                                <FaBox className="text-xs" />
                              </div>
                            )}

                            <div className="grid min-w-0 flex-1 grid-cols-1 items-center gap-2 sm:grid-cols-2 md:grid-cols-4">
                              <div className="sm:col-span-1 md:col-span-2">
                                <h5 className="truncate text-xs font-bold text-slate-800 uppercase tracking-wide">
                                  {subItem.product?.title || "Product item"}
                                </h5>
                                <p className="mt-0.5 font-mono text-[10px] font-bold text-slate-400">
                                  Stock units: {subItem.product?.stock ?? "N/A"}
                                </p>
                              </div>

                              <div className="font-mono text-xs text-slate-500 font-medium">
                                <p>
                                  Price: <span className="text-slate-700">Rs.{subItem.price}</span>
                                </p>
                                <p>
                                  Qty: <span className="text-slate-700">x{subItem.quantity}</span>
                                </p>
                              </div>

                              <div className="text-left sm:text-right">
                                <span className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                                  Subtotal
                                </span>
                                <span className="font-mono text-xs font-bold text-slate-800">
                                  Rs. {((subItem.price || 0) * (subItem.quantity || 0)).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Order;