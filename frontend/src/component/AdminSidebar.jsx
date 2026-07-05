import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
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
  collapse:  "M15 18l-6-6 6-6",
  expand:    "M9 18l6-6-6-6",
  menu:      "M4 6h16M4 12h16M4 18h16",
  close:     "M18 6L6 18M6 6l12 12",
  bell:      "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  search:    "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35",
};

// ── nav data (single source of truth) ───────────────────────────────────────
const NAV = [
  { key: "dashboard", label: "Dashboard", icon: icons.dashboard, to: "/dashboard" },
  {
    key: "category", label: "Category", icon: icons.category,
    children: [{ to: "/allcategory", icon: icons.list, label: "All Categories" }],
  },
  {
    key: "product", label: "Product", icon: icons.product,
    children: [{ to: "/allproduct", icon: icons.list, label: "All Products" }],
  },
  {
    key: "orders", label: "Orders", icon: icons.orders,
    children: [
      { to: "/order", icon: icons.add, label: "New Order" },
      { to: "/orders/pending", icon: icons.pending, label: "Pending" },
      { to: "/orders/delivered", icon: icons.delivered, label: "Delivered" },
    ],
  },
];

const ACCOUNT_NAV = [
  {
    key: "profile", label: "Profile", icon: icons.profile,
    children: [
      { to: "/seller/profile", icon: icons.profile, label: "My Profile" },
      { to: "/seller/change-password", icon: icons.password, label: "Change Password" },
    ],
  },
];

// ── motion variants ──────────────────────────────────────────────────────────
const sidebarV = {
  open:   { x: 0,    transition: { type: "spring", stiffness: 320, damping: 32 } },
  closed: { x: -300, transition: { type: "spring", stiffness: 320, damping: 32 } },
};
const dropdownV = {
  hidden: { opacity: 0, height: 0 },
  show:   { opacity: 1, height: "auto", transition: { duration: 0.25, staggerChildren: 0.04, delayChildren: 0.04 } },
};
const itemV = {
  hidden: { opacity: 0, x: -10 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.18 } },
};
const overlayV = { hidden: { opacity: 0 }, show: { opacity: 1 } };
const railTextV = {
  expanded: { opacity: 1, width: "auto", marginLeft: 0 },
  collapsed: { opacity: 0, width: 0, marginLeft: -4 },
};

// ── Tooltip for collapsed rail ──────────────────────────────────────────────
const RailTooltip = ({ label, show }) => (
  <AnimatePresence>
    {show && (
      <motion.span
        initial={{ opacity: 0, x: -6, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -6, scale: 0.95 }}
        transition={{ duration: 0.12 }}
        className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50
                   whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-medium
                   text-white shadow-xl shadow-black/40 border border-white/10"
      >
        {label}
      </motion.span>
    )}
  </AnimatePresence>
);

// ── Leaf nav link (used inside dropdowns) ───────────────────────────────────
const NavItem = ({ to, iconPath, label, collapsed }) => {
  const [hover, setHover] = useState(false);
  return (
    <motion.div variants={itemV} className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
           ${isActive
             ? "bg-violet-500/15 text-violet-300"
             : "text-slate-400 hover:text-white hover:bg-white/5"}`
        }
      >
        <Icon d={iconPath} size={15} />
        {!collapsed && <span className="truncate">{label}</span>}
      </NavLink>
      {collapsed && <RailTooltip label={label} show={hover} />}
    </motion.div>
  );
};

// ── Top-level item with animated "liquid" active pill, expands to accordion ──
const NavGroup = ({ item, isOpen, onToggle, collapsed, activeId, setActiveId }) => {
  const [hover, setHover] = useState(false);
  const hasChildren = !!item.children;
  const isDirectActive = activeId === item.key;

  const content = (
    <>
      <span className="relative flex items-center gap-3 z-10">
        <Icon d={item.icon} size={16} />
        <motion.span
          variants={railTextV}
          animate={collapsed ? "collapsed" : "expanded"}
          transition={{ duration: 0.18 }}
          className="overflow-hidden whitespace-nowrap"
        >
          {item.label}
        </motion.span>
      </span>
      {hasChildren && !collapsed && (
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          className="relative z-10 text-slate-500"
        >
          <Icon d={icons.chevron} size={13} />
        </motion.span>
      )}
    </>
  );

  const baseClasses = `relative w-full flex items-center justify-between gap-3 px-3 py-2.8 py-[11px] rounded-xl
     text-sm font-semibold transition-colors duration-150
     ${isDirectActive ? "text-white" : "text-slate-300 hover:text-white"}`;

  return (
    <div className="mb-0.5 relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {hasChildren ? (
        <button onClick={onToggle} className={baseClasses}>
          {(isDirectActive || isOpen) && (
            <motion.span
              layoutId="rail-active"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600/25 to-indigo-600/10 border border-violet-500/20"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}
          {content}
        </button>
      ) : (
        <NavLink
          to={item.to}
          onClick={() => setActiveId(item.key)}
          className={({ isActive }) =>
            `relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors duration-150 ${
              isActive ? "text-white" : "text-slate-300 hover:text-white"
            }`
          }
        >
          {({ isActive }) =>
            isActive ? (
              <>
                <motion.span
                  layoutId="rail-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
                {content}
              </>
            ) : (
              content
            )
          }
        </NavLink>
      )}
      {collapsed && <RailTooltip label={item.label} show={hover} />}

      {hasChildren && (
        <AnimatePresence initial={false}>
          {isOpen && !collapsed && (
            <motion.div
              key="content"
              variants={dropdownV}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="overflow-hidden ml-3 pl-4 border-l border-white/8 mt-1 mb-1 flex flex-col gap-0.5"
            >
              {item.children.map((c) => (
                <NavItem key={c.to} {...c} iconPath={c.icon} collapsed={false} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

// ── main component ────────────────────────────────────────────────────────────
const AdminSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // desktop icon-rail mode
  const [openGroups, setOpenGroups] = useState({});
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // auto-open the group that matches the current route
  useEffect(() => {
    const allGroups = [...NAV, ...ACCOUNT_NAV].filter((n) => n.children);
    const match = allGroups.find((g) => g.children.some((c) => location.pathname.startsWith(c.to)));
    if (match) setOpenGroups((p) => ({ ...p, [match.key]: true }));
  }, [location.pathname]);

  // close mobile drawer whenever the route changes
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const toggleGroup = (key) =>
    setOpenGroups((p) => ({ ...p, [key]: !p[key] }));

  const logout = async () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      dispatch(logoutdata());
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNav = query
    ? NAV.map((n) => ({
        ...n,
        children: n.children?.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())),
      })).filter((n) => n.label.toLowerCase().includes(query.toLowerCase()) || n.children?.length)
    : NAV;

  const SidebarContent = ({ collapsed = false }) => (
    <LayoutGroup id="sidebar-content">
      <div className="flex flex-col h-full">

        {/* ── Brand ── */}
        <div className={`flex items-center gap-3 pt-6 pb-4 ${collapsed ? "px-3 justify-center" : "px-5"}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-tight truncate">Admin Panel</p>
              <p className="text-slate-500 text-xs">Dashboard</p>
            </div>
          )}
        </div>

        {/* ── User card ── */}
        <div className={`mb-5 rounded-2xl bg-gradient-to-r from-violet-900/40 to-indigo-900/30 border border-violet-500/20 ${collapsed ? "mx-2 p-2" : "mx-3 p-3"}`}>
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {(user?.name?.[0] || user?.email?.[0] || "S").toUpperCase()}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
            </div>
            {!collapsed && (
              <>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{user?.name || "Admin"}</p>
                  <p className="text-slate-400 text-xs truncate">{user?.email || "seller@store.com"}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Search (hidden when collapsed) ── */}
        {!collapsed && (
          <div className="px-3 mb-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <Icon d={icons.search} size={14} />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search menu..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-300
                           placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
              />
            </div>
          </div>
        )}

        {/* ── Nav ── */}
        <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden scrollbar-thin">
          {!collapsed && filteredNav.length === 0 && (
            <p className="px-2 py-6 text-center text-xs text-slate-600">No menu items match "{query}"</p>
          )}
          {filteredNav.map((item) => (
            <NavGroup
              key={item.key}
              item={item}
              collapsed={collapsed}
              isOpen={!!openGroups[item.key]}
              onToggle={() => toggleGroup(item.key)}
              activeId={openGroups.activeId}
              setActiveId={() => {}}
            />
          ))}

          <div className="my-3 border-t border-white/5" />
          {!collapsed && (
            <p className="px-3 text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-2">Account</p>
          )}
          {ACCOUNT_NAV.map((item) => (
            <NavGroup
              key={item.key}
              item={item}
              collapsed={collapsed}
              isOpen={!!openGroups[item.key]}
              onToggle={() => toggleGroup(item.key)}
              activeId={openGroups.activeId}
              setActiveId={() => {}}
            />
          ))}
        </nav>

        {/* ── Logout ── */}
        <div className={`mt-2 ${collapsed ? "p-2" : "p-3"}`}>
          <motion.button
            onClick={logout}
            whileHover={{ scale: 1.01, backgroundColor: "rgba(239,68,68,0.12)" }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-3 rounded-xl text-sm font-semibold text-red-400 border border-red-500/20 hover:border-red-500/40 transition-colors
                        ${collapsed ? "justify-center px-2 py-3" : "px-4 py-3"}`}
          >
            <Icon d={icons.logout} size={16} />
            {!collapsed && "Sign Out"}
          </motion.button>
        </div>
      </div>
    </LayoutGroup>
  );

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-slate-950/95 backdrop-blur border-b border-white/8">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <span className="text-white font-bold text-sm">Admin Panel</span>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} className="relative text-slate-400 hover:text-white">
            <Icon d={icons.bell} size={20} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-violet-500 rounded-full" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen((p) => !p)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
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

      {/* ── Mobile sidebar (slide-in, full width on very small screens) ── */}
      <motion.aside
        variants={sidebarV}
        initial="closed"
        animate={mobileOpen ? "open" : "closed"}
        className="lg:hidden fixed top-0 left-0 z-50 h-full w-[82vw] max-w-[300px]
                   bg-slate-950 border-r border-white/8 shadow-2xl shadow-black/60"
      >
        <SidebarContent collapsed={false} />
      </motion.aside>

      {/* ── Desktop sidebar (static, collapsible icon rail) ── */}
      <motion.aside
        animate={{ width: collapsed ? 84 : 272 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="hidden lg:flex flex-col min-h-screen flex-shrink-0 bg-slate-950 border-r border-white/[0.07] relative"
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-violet-900/20 to-transparent" />

        {/* Collapse toggle */}
        <motion.button
          onClick={() => setCollapsed((p) => !p)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-8 z-20 w-6 h-6 rounded-full bg-slate-800 border border-white/10
                     flex items-center justify-center text-slate-400 hover:text-white hover:bg-violet-600
                     shadow-lg shadow-black/40 transition-colors"
        >
          <Icon d={collapsed ? icons.expand : icons.collapse} size={12} />
        </motion.button>

        <div className="relative z-10 flex flex-col h-full">
          <SidebarContent collapsed={collapsed} />
        </div>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;