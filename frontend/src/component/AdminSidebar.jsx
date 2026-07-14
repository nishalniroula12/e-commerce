import React, { useMemo, useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logoutdata } from "../Redux/slice";
import {
  FaBoxOpen,
  FaTags,
  FaChevronDown,
  FaChevronLeft,
  FaTachometerAlt,
  FaList,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUserShield,
  FaSearch,
} from "react-icons/fa";

// ── Nav data — single source of truth ──────
const NAV = [
  {
    section: "Overview",
    items: [{ to: "/admindashboard", icon: FaTachometerAlt, label: "Dashboard" }],
  },
  {
    section: "Catalog",
    items: [
      {
        icon: FaBoxOpen,
        label: "Products",
        children: [{ to: "/productadd", icon: FaList, label: "All products" }],
      },
      {
        icon: FaTags,
        label: "Categories",
        children: [{ to: "/admincategory", icon: FaList, label: "All categories" }],
      },
      {
        icon: FaTags,
        label: "Seller",
        children: [{ to: "/adminseller", icon: FaList, label: "All Seller" }],
      },
    ],
  },
];

const linkBase =
  "group relative flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200";

// Tooltip shown next to an icon when the rail is collapsed
const RailTooltip = ({ label }) => (
  <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white opacity-0 shadow-md ring-1 ring-slate-950/5 transition-opacity duration-150 group-hover:opacity-100">
    {label}
  </span>
);

const SidebarLink = ({ to, icon: Icon, children, sub = false, collapsed = false }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `${linkBase} ${sub ? "py-2.5 text-[11px]" : ""} ${collapsed ? "justify-center px-0" : ""} ${
        isActive ? "text-white" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 active:scale-98"
      }`
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <motion.span
            layoutId={collapsed ? "active-pill-rail" : "active-pill"}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className={`absolute inset-0 rounded-xl bg-slate-900 shadow-sm ${
              collapsed ? "mx-1" : ""
            }`}
          />
        )}
        <span className={`relative z-10 flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
          {Icon && <Icon className={sub ? "text-[11px]" : "text-[14px]"} />}
          {!collapsed && children}
        </span>
        {collapsed && <RailTooltip label={children} />}
      </>
    )}
  </NavLink>
);

// Expanded mode: accordion group. Collapsed mode: icon + hover flyout panel.
const NavGroup = ({ icon: Icon, label, isOpen, onToggle, children, collapsed, forceOpen }) => {
  if (collapsed) {
    return (
      <div className="group relative mb-1">
        <button className="flex w-full items-center justify-center rounded-xl px-0 py-3 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900">
          <Icon className="text-[14px] text-slate-600" />
        </button>
        <RailTooltip label={label} />
        {/* Flyout panel */}
        <div className="invisible absolute left-full top-0 z-50 ml-2 w-48 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100">
          <p className="px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
            {label}
          </p>
          <div className="flex flex-col gap-0.5">{children}</div>
        </div>
      </div>
    );
  }

  const open = forceOpen ?? isOpen;

  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-slate-950 active:scale-98"
      >
        <span className="flex items-center gap-2.5">
          <Icon className="text-[14px] text-slate-500" />
          {label}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18, ease: "easeOut" }}>
          <FaChevronDown className="text-[9px] text-slate-400" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-1 flex flex-col gap-1 border-l border-slate-200 py-1 ml-5 pl-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarBody = ({ onNavigate, collapsed = false, onToggleCollapse }) => {
  const [openGroups, setOpenGroups] = useState({ Products: true });
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);

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

  const toggleGroup = (label) => setOpenGroups((g) => ({ ...g, [label]: !g[label] }));

  const filteredNav = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAV;

    return NAV.map((section) => {
      const items = section.items
        .map((item) => {
          if (item.children) {
            const matchChildren = item.children.filter((c) => c.label.toLowerCase().includes(q));
            const selfMatch = item.label.toLowerCase().includes(q);
            if (selfMatch || matchChildren.length) {
              return { ...item, children: selfMatch ? item.children : matchChildren };
            }
            return null;
          }
          return item.label.toLowerCase().includes(q) ? item : null;
        })
        .filter(Boolean);
      return { ...section, items };
    }).filter((section) => section.items.length > 0);
  }, [query]);

  const isSearching = query.trim().length > 0;

  return (
    <div className="flex h-full flex-col bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className={`flex items-center gap-3 border-b border-slate-100 px-6 py-5 ${collapsed ? "justify-center px-3" : ""}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 font-mono text-sm font-bold text-white shadow-sm">
          A
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Admin Console</h2>
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              online
            </p>
          </div>
        )}
      </div>

      {/* Search Bar */}
      {!collapsed && (
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-slate-400 focus-within:bg-white transition-all">
            <FaSearch className="text-[11px] text-slate-400 shrink-0" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search features..."
              inputMode="search"
              className="w-full bg-transparent text-xs font-medium text-slate-800 placeholder-slate-400 outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} className="shrink-0 p-1 text-slate-400 hover:text-slate-600" aria-label="Clear search">
                <FaTimes className="text-[10px]" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`flex-1 space-y-1 overflow-y-auto py-4 ${collapsed ? "px-2" : "px-4"}`}>
        {filteredNav.length === 0 && (
          <p className="px-3 py-6 text-center text-xs font-medium text-slate-400">No results for "{query}"</p>
        )}

        {filteredNav.map((section) => (
          <div key={section.section}>
            {!collapsed && (
              <p className="px-3 pb-2 pt-4 text-[9px] font-extrabold uppercase tracking-widest text-slate-400 first:pt-0">
                {section.section}
              </p>
            )}

            {section.items.map((item) =>
              item.children ? (
                <NavGroup
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  collapsed={collapsed}
                  isOpen={!!openGroups[item.label]}
                  forceOpen={isSearching ? true : undefined}
                  onToggle={() => toggleGroup(item.label)}
                >
                  {item.children.map((c) => (
                    <SidebarLink key={c.to} to={c.to} icon={c.icon} sub collapsed={false}>
                      {c.label}
                    </SidebarLink>
                  ))}
                </NavGroup>
              ) : (
                <SidebarLink key={item.to} to={item.to} icon={item.icon} collapsed={collapsed}>
                  {item.label}
                </SidebarLink>
              )
            )}
          </div>
        ))}
      </nav>

      {/* Footer / Account profile */}
      <div
        className={`border-t border-slate-100 p-4 ${collapsed ? "px-2" : ""}`}
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <div
          className={`mb-3 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 ${
            collapsed ? "justify-center px-0 bg-transparent" : ""
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
            <FaUserShield className="text-[14px]" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-800 uppercase tracking-wider">{user?.name || "Administrator"}</p>
              <p className="truncate font-mono text-[10px] text-slate-400 mt-0.5">{user?.email || "signed in"}</p>
            </div>
          )}
        </div>

        <motion.button
          onClick={logout}
          whileTap={{ scale: 0.98 }}
          className={`flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 border border-rose-100 py-3 text-xs font-bold uppercase tracking-wider text-rose-600 transition-colors hover:bg-rose-100/60 active:bg-rose-200 ${
            collapsed ? "px-0" : ""
          }`}
        >
          <FaSignOutAlt className="text-[12px]" />
          {!collapsed && "Log out"}
        </motion.button>

        {/* Collapse toggle (Desktop only) */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="mt-3 hidden w-full items-center justify-center gap-2 rounded-xl py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700 lg:flex"
          >
            <motion.span animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <FaChevronLeft className="text-[9px]" />
            </motion.span>
            {!collapsed && "Collapse Panel"}
          </button>
        )}
      </div>
    </div>
  );
};

const AdminSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("sidebar-collapsed") === "1");
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Responsive Mobile Top Bar */}
      <div
        className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3.5 backdrop-blur-md lg:hidden"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 font-mono text-xs font-bold text-white">
            A
          </div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Admin Console</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
          aria-label="Open menu"
        >
          <FaBars className="text-[15px]" />
        </button>
      </div>

      {/* Desktop Sticky Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 288 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="sticky top-0 z-30 hidden h-screen shrink-0 lg:block"
      >
        <SidebarBody collapsed={collapsed} onToggleCollapse={() => setCollapsed((v) => !v)} />
      </motion.aside>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <React.Fragment key="drawer">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            />
            {/* Drawer body */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[20rem] lg:hidden shadow-2xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 rounded-xl p-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700 active:scale-95 transition-all"
                aria-label="Close menu"
              >
                <FaTimes className="text-[15px]" />
              </button>
              <SidebarBody onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </React.Fragment>
        )}
      </AnimatePresence>

      {/* Spacer to prevent layout clipping underneath fixed top bar on small screens */}
      <div className="h-[57px] lg:hidden" style={{ height: "calc(57px + env(safe-area-inset-top))" }} />
    </>
  );
};

export default AdminSidebar;