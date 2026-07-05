import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logoutdata } from "../Redux/slice";
import { useDispatch } from "react-redux";

// ── icons (inline SVG so no extra dep) ──────────────────────────────────────
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  category:  "M4 6h16M4 12h8m-8 6h16",
  product:   "M20 7l-8-4-8 4m16 0v10l-8 4m0-14L4 17m8 4V11",
  orders:    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  add:       "M12 5v14M5 12h14",
  list:      "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  pending:   "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0",
  delivered: "M5 13l4 4L19 7",
  profile:   "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8",
  password:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",
  logout:    "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  chevron:   "M19 9l-7 7-7-7",
  menu:      "M4 6h16M4 12h16M4 18h16",
  close:     "M18 6L6 18M6 6l12 12",
  bell:      "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
};

// ── motion variants ──────────────────────────────────────────────────────────
const sidebarV = {
  open:   { x: 0,    transition: { type: "spring", stiffness: 300, damping: 30 } },
  closed: { x: -280, transition: { type: "spring", stiffness: 300, damping: 30 } },
};
const dropdownV = {
  hidden: { opacity: 0, height: 0,   transition: { duration: 0.2 } },
  show:   { opacity: 1, height: "auto", transition: { duration: 0.25, staggerChildren: 0.05, delayChildren: 0.05 } },
};
const itemV = {
  hidden: { opacity: 0, x: -12 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.2 } },
};
const overlayV = {
  hidden: { opacity: 0 },
  show:   { opacity: 1 },
};

// ── helpers ──────────────────────────────────────────────────────────────────
const NavItem = ({ to, iconPath, label }) => (
  <motion.div variants={itemV}>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
         ${isActive
           ? "bg-gradient-to-r from-violet-600/30 to-indigo-600/20 text-violet-300 border border-violet-500/30"
           : "text-slate-400 hover:text-white hover:bg-white/5"}`
      }
    >
      <Icon d={iconPath} size={15} />
      {label}
    </NavLink>
  </motion.div>
);

const AccordionSection = ({ icon, label, isOpen, onToggle, children }) => (
  <div className="mb-1">
    <motion.button
      onClick={onToggle}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-300 transition-colors"
    >
      <span className="flex items-center gap-3">
        <span className={`p-1.5 rounded-lg transition-colors ${isOpen ? "bg-violet-600/20 text-violet-400" : "bg-white/5 text-slate-400"}`}>
          <Icon d={icon} size={15} />
        </span>
        {label}
      </span>
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.25 }}
        className="text-slate-500"
      >
        <Icon d={icons.chevron} size={14} />
      </motion.span>
    </motion.button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          variants={dropdownV}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="overflow-hidden ml-3 pl-4 border-l border-white/8 mt-1 mb-1 flex flex-col gap-0.5"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// ── main component ────────────────────────────────────────────────────────────
const Sidebar = () => {
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [productOpen,  setProductOpen]  = useState(false);
  const [ordersOpen,   setOrdersOpen]   = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const navigate = useNavigate();
  const dispatch =useDispatch()

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = async () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      dispatch(logoutdata())
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* ── Brand ── */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Seller Panel</p>
            <p className="text-slate-500 text-xs">Dashboard</p>
          </div>
        </div>
      </div>

      {/* ── User card ── */}
      <div className="mx-3 mb-5 p-3 rounded-2xl bg-gradient-to-r from-violet-900/40 to-indigo-900/30 border border-violet-500/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {(user?.name?.[0] || user?.email?.[0] || "S").toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.name || "Seller"}</p>
            <p className="text-slate-400 text-xs truncate">{user?.email || "seller@store.com"}</p>
          </div>
          <div className="ml-auto">
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* ── Nav label ── */}
      <p className="px-5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-2">
        Main Menu
      </p>

      {/* ── Nav items ── */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto scrollbar-thin">

        {/* Dashboard */}
        <motion.div whileHover={{ x: 2 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200
               ${isActive
                 ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25"
                 : "text-slate-400 hover:text-white hover:bg-white/5"}`
            }
          >
            <Icon d={icons.dashboard} size={16} />
            Dashboard
          </NavLink>
        </motion.div>

        {/* Category */}
        <AccordionSection
          icon={icons.category}
          label="Category"
          isOpen={categoryOpen}
          onToggle={() => setCategoryOpen(p => !p)}
        >
          <NavItem to="/addcategory" iconPath={icons.add}  label="Add Category" />
          <NavItem to="/allcategory" iconPath={icons.list} label="All Categories" />
        </AccordionSection>

        {/* Product */}
        <AccordionSection
          icon={icons.product}
          label="Product"
          isOpen={productOpen}
          onToggle={() => setProductOpen(p => !p)}
        >
          <NavItem to="/addproduct" iconPath={icons.add}  label="Add Product" />
          <NavItem to="/allproduct" iconPath={icons.list} label="All Products" />
        </AccordionSection>

        {/* Orders */}
        <AccordionSection
          icon={icons.orders}
          label="Orders"
          isOpen={ordersOpen}
          onToggle={() => setOrdersOpen(p => !p)}
        >
          <NavItem to="/order"       iconPath={icons.add}       label="New Order" />
          <NavItem to="/orders/pending"   iconPath={icons.pending}   label="Pending" />
          <NavItem to="/orders/delivered" iconPath={icons.delivered} label="Delivered" />
        </AccordionSection>

        {/* Divider */}
        <div className="my-3 border-t border-white/5" />
        <p className="px-3 text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-2">
          Account
        </p>

        {/* Profile */}
        <AccordionSection
          icon={icons.profile}
          label="Profile"
          isOpen={profileOpen}
          onToggle={() => setProfileOpen(p => !p)}
        >
          <NavItem to="/seller/profile"         iconPath={icons.profile}  label="My Profile" />
          <NavItem to="/seller/change-password" iconPath={icons.password} label="Change Password" />
        </AccordionSection>

      </nav>

      {/* ── Logout ── */}
      <div className="p-3 mt-2">
        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.01, backgroundColor: "rgba(239,68,68,0.12)" }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 border border-red-500/20 hover:border-red-500/40 transition-colors"
        >
          <Icon d={icons.logout} size={16} />
          Sign Out
        </motion.button>
      </div>

    </div>
  );

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-slate-950/95 backdrop-blur border-b border-white/8">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <span className="text-white font-bold text-sm">Seller Panel</span>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} className="relative text-slate-400 hover:text-white">
            <Icon d={icons.bell} size={20} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-violet-500 rounded-full" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(p => !p)}
            className="text-slate-400 hover:text-white p-1"
          >
            <Icon d={mobileOpen ? icons.close : icons.menu} size={22} />
          </motion.button>
        </div>
      </div>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="overlay"
            variants={overlayV}
            initial="hidden"
            animate="show"
            exit="hidden"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* ── Mobile sidebar (slide-in) ── */}
      <motion.aside
        variants={sidebarV}
        initial="closed"
        animate={mobileOpen ? "open" : "closed"}
        className="
          lg:hidden fixed top-0 left-0 z-50 h-full w-72
          bg-slate-950 border-r border-white/8
          shadow-2xl shadow-black/60
        "
      >
        <SidebarContent />
      </motion.aside>

      {/* ── Desktop sidebar (static) ── */}
      <aside className="
        hidden lg:flex flex-col w-64 xl:w-72 min-h-screen flex-shrink-0
        bg-slate-950 border-r border-white/[0.07]
        relative
      ">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-violet-900/20 to-transparent" />
        <div className="relative z-10 flex flex-col h-full">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;