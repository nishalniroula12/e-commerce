import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logoutdata } from "../Redux/slice";
import {
  FaBoxOpen,
  FaTags,
  FaChevronDown,
  FaTachometerAlt,
  FaList,
  FaPlus,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";

/**
 * Layout: on desktop the sidebar is a sticky flex item (not `fixed`), so it
 * sits beside the page content by construction. Below `lg` it becomes a
 * fixed off-canvas drawer over a slim top bar.
 *
 * Palette: graphite background (#0A0A0C), amber as the primary accent,
 * teal reserved for the "online" status pulse.
 */

const linkBase =
  "group relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200";

const SidebarLink = ({ to, icon: Icon, children, sub = false }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `${linkBase} ${sub ? "py-2 text-[13px]" : ""} ${
        isActive ? "text-white" : "text-slate-400 hover:text-slate-100"
      }`
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <motion.span
            layoutId="active-pill"
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="absolute inset-0 rounded-lg bg-amber-500 shadow-md shadow-amber-500/30"
          />
        )}
        <span className="relative z-10 flex items-center gap-2.5">
          {Icon && <Icon className={sub ? "text-[12px]" : "text-[15px]"} />}
          {children}
        </span>
      </>
    )}
  </NavLink>
);

const NavGroup = ({ icon: Icon, label, isOpen, onToggle, children }) => (
  <div className="mb-1">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
    >
      <span className="flex items-center gap-2.5">
        <Icon className="text-[15px] text-amber-400" />
        {label}
      </span>
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <FaChevronDown className="text-[10px] text-slate-500" />
      </motion.span>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="mt-1 flex flex-col gap-1 border-l border-white/10 py-1 pl-6">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const SidebarBody = ({ onNavigate }) => {
  const [productOpen, setProductOpen] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch(logoutdata());
    onNavigate?.();
    navigate("/");
  };

  return (
    <div className="flex h-full flex-col bg-[#0A0A0C]">
      {/* Brand header */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 font-mono text-sm font-bold text-white shadow-lg shadow-amber-500/20">
          A
        </div>
        <div>
          <h2 className="text-[15px] font-semibold tracking-wide text-white">
            Admin Console
          </h2>
          <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-400" />
            </span>
            System online
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Overview
        </p>
        <SidebarLink to="/admindashboard" icon={FaTachometerAlt}>
          Dashboard
        </SidebarLink>

        <p className="px-3 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Catalog
        </p>

        <NavGroup
          icon={FaBoxOpen}
          label="Products"
          isOpen={productOpen}
          onToggle={() => setProductOpen((v) => !v)}
        >
          <SidebarLink to="/productadd" icon={FaList} sub>
            All products
          </SidebarLink>
          </NavGroup>

        <NavGroup
          icon={FaTags}
          label="Categories"
          isOpen={categoryOpen}
          onToggle={() => setCategoryOpen((v) => !v)}
        >
          <SidebarLink to="/admincategory" icon={FaList} sub>
            All categories
          </SidebarLink>
        </NavGroup>
        <NavGroup
          icon={FaTags}
          label="Seller"
          isOpen={categoryOpen}
          onToggle={() => setCategoryOpen((v) => !v)}
        >
          <SidebarLink to="/adminseller" icon={FaList} sub>
            All Seller
          </SidebarLink>
        </NavGroup>
      
      </nav>


      {/* User + logout footer */}
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
            <FaUserShield className="text-[15px]" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-200">
              {user?.name || "Administrator"}
            </p>
            <p className="truncate text-[11px] text-slate-500">
              {user?.email || "Signed in"}
            </p>
          </div>
        </div>

        <motion.button
          onClick={logout}
          whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-rose-500/10 py-2.5 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/15"
        >
          <FaSignOutAlt className="text-[13px]" />
          Log out
        </motion.button>
      </div>
    </div>
  );
};

const AdminSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#0A0A0C] px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-amber-400 to-orange-600 font-mono text-xs font-bold text-white">
            A
          </div>
          <span className="text-sm font-semibold text-white">
            Admin Console
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-2 text-slate-300 hover:bg-white/5"
          aria-label="Open menu"
        >
          <FaBars />
        </button>
      </div>

      {/* Desktop sidebar — sticky flex item, sits beside content naturally */}
      <aside className="hidden border-r border-white/10 lg:sticky lg:top-0 lg:z-30 lg:block lg:h-screen lg:w-72 lg:shrink-0">
        <SidebarBody />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <React.Fragment key="drawer">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 rounded-md p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
              <SidebarBody onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </React.Fragment>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;