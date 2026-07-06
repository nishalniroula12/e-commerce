import axios from "axios";
import React, { useEffect, useState } from "react";
import Sidebar from "../../component/Sidebar";
import { motion } from "framer-motion";
import {
  FaBox,
  FaMapMarkerAlt,
  FaReceipt,
} from "react-icons/fa";

/**
 * Redesigned Orders Console
 * Theme: Cobalt Ink (#0A0E1A) — swapped out of the previous amethyst
 * palette. Sky-blue carries the accent role; status badges keep their
 * semantic colors (emerald/amber) so meaning still reads at a glance.
 */

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
  <div className="mb-6 animate-pulse rounded-2xl border border-white/10 bg-[#111826] p-6">
    <div className="mb-4 flex justify-between border-b border-white/10 pb-4">
      <div className="h-5 w-40 rounded bg-white/10" />
      <div className="h-5 w-24 rounded bg-white/10" />
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-white/5" />
        <div className="h-4 w-3/4 rounded bg-white/5" />
      </div>
      <div className="h-20 rounded bg-white/5" />
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
      setOrders(res.data.order || []);
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
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }
    if (lowerStatus === "pending" || lowerStatus === "processing") {
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    }
    return "bg-sky-500/10 text-sky-400 border border-sky-500/20";
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0E1A] text-slate-200/90 antialiased selection:bg-sky-500/30 lg:flex-row">
      <Sidebar />

      <main className="w-full min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Header section */}
          <div className="mb-8 border-b border-white/10 pb-6">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-sky-400">
              <FaReceipt className="text-xs" /> Order history
            </p>
            <h1 className="mt-1 font-sans text-2xl font-bold tracking-tight text-white sm:text-3xl">
              My orders
            </h1>
          </div>

          {loading ? (
            <div className="space-y-4">
              <OrderSkeleton />
              <OrderSkeleton />
            </div>
          ) : order.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#111826] px-6 py-16 text-center shadow-xl shadow-black/30">
              <FaBox className="mx-auto mb-4 text-4xl text-slate-600" />
              <p className="text-base font-semibold text-slate-300">
                No orders yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Orders you place will show up here.
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerStagger}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {order.map((item) => (
                <motion.div
                  key={item._id}
                  variants={cardVariant}
                  className="rounded-2xl border border-white/10 bg-[#111826] p-5 shadow-xl shadow-black/30 sm:p-6"
                >
                  {/* Card header metadata */}
                  <div className="mb-5 flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Order reference
                      </span>
                      <span className="break-all font-mono text-sm font-bold text-white">
                        {item.orderId}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(
                          item.status
                        )}`}
                      >
                        <span className="h-1 w-1 rounded-full bg-current" />
                        {item.status}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(
                          item.paymentstatus
                        )}`}
                      >
                        {item.paymentstatus}
                      </span>
                    </div>
                  </div>

                  {/* Core information split */}
                  <div className="mb-5 grid grid-cols-1 gap-6 border-b border-white/10 pb-5 md:grid-cols-12">
                    {/* Payment meta */}
                    <div className="space-y-2.5 md:col-span-5">
                      <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 px-4 py-2">
                        <span className="text-xs font-medium text-slate-400">
                          Payment method
                        </span>
                        <span className="font-mono text-xs font-semibold uppercase text-slate-200">
                          {item.paymentmethod}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                        <span className="text-xs font-medium text-slate-400">
                          Total
                        </span>
                        <span className="font-mono text-base font-bold text-sky-400">
                          Rs. {Number(item.totalAmount).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Shipping address */}
                    <div className="rounded-xl border border-white/10 bg-black/10 p-4 md:col-span-7">
                      <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <FaMapMarkerAlt className="text-sky-400" /> Shipping
                        address
                      </h4>
                      <div className="space-y-1 text-xs text-slate-300">
                        <p className="font-semibold text-white">
                          {item.shippingaddress?.name}{" "}
                          <span className="ml-2 font-normal text-slate-500">
                            ({item.shippingaddress?.phone})
                          </span>
                        </p>
                        <p>
                          {item.shippingaddress?.street},{" "}
                          {item.shippingaddress?.city}
                        </p>
                        <p>
                          {item.shippingaddress?.state},{" "}
                          {item.shippingaddress?.zipCode} ·{" "}
                          {item.shippingaddress?.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Line items */}
                  <div>
                    <h4 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Items
                    </h4>
                    <motion.div
                      variants={containerStagger}
                      initial="hidden"
                      animate="visible"
                      className="space-y-3"
                    >
                      {item.items?.map((subItem) => (
                        <motion.div
                          key={subItem._id}
                          variants={itemVariant}
                          className="flex items-center gap-4 rounded-xl border border-white/5 bg-black/20 p-3 transition-colors last:border-0 hover:bg-white/5"
                        >
                          <img
                            src={subItem.image}
                            alt={subItem.product?.title || "Product"}
                            className="h-14 w-14 shrink-0 rounded-lg border border-white/10 bg-slate-800 object-cover"
                          />

                          <div className="grid min-w-0 flex-1 grid-cols-1 items-center gap-2 sm:grid-cols-2 md:grid-cols-4">
                            <div className="sm:col-span-1 md:col-span-2">
                              <h5 className="truncate text-sm font-semibold text-white">
                                {subItem.product?.title || "Product"}
                              </h5>
                              <p className="mt-0.5 font-mono text-[10px] text-slate-500">
                                Stock: {subItem.product?.stock ?? "N/A"}
                              </p>
                            </div>

                            <div className="space-y-0.5 font-mono text-xs">
                              <p className="text-slate-400">
                                Price:{" "}
                                <span className="text-slate-200">
                                  Rs.{subItem.price}
                                </span>
                              </p>
                              <p className="text-slate-400">
                                Qty:{" "}
                                <span className="text-slate-200">
                                  x{subItem.quantity}
                                </span>
                              </p>
                            </div>

                            <div className="text-left sm:text-right">
                              <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                Subtotal
                              </span>
                              <span className="font-mono text-sm font-semibold text-slate-100">
                                Rs.{" "}
                                {(subItem.price * subItem.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Order;