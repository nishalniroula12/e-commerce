import { useState, useEffect, useRef } from "react";
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiSearch,
  FiChevronDown,
  FiChevronRight,
  FiHeadphones,
  FiHeart,
  FiBell,
  FiSun,
  FiMoon,
  FiPackage,
  FiLogOut,
  FiSettings,
  FiTrash2,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

// ── Dummy data — wire these up to your real store/cart/wishlist state ──
const CATEGORY_MEGA_MENU = [
  {
    title: "Women",
    items: ["Dresses", "Tops & tees", "Jeans", "Ethnic wear", "Outerwear"],
  },
  {
    title: "Men",
    items: ["Shirts", "T-shirts", "Trousers", "Jackets", "Ethnic wear"],
  },
  {
    title: "Kids",
    items: ["Boys", "Girls", "Infants", "School wear"],
  },
  {
    title: "Accessories",
    items: ["Bags", "Belts", "Watches", "Footwear", "Jewelry"],
  },
];

const SEARCH_SUGGESTIONS = [
  "Denim jacket",
  "Floral summer dress",
  "Slim fit chinos",
  "Oversized hoodie",
  "Leather ankle boots",
];

const MINI_CART_ITEMS = [
  { id: 1, name: "Denim jacket · size M", qty: 1, price: 2499 },
  { id: 2, name: "Floral summer dress · size S", qty: 1, price: 1799 },
  { id: 3, name: "Slim fit chinos · size 32", qty: 2, price: 1299 },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);

  const searchRef = useRef(null);
  const cartRef = useRef(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const nav = useNavigate();

  const isAuthenticate = useSelector((state) => state.data.isAuthenticate);
  const user = useSelector((state) => state.data.user);

  const cartCount = MINI_CART_ITEMS.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = MINI_CART_ITEMS.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  const filteredSuggestions = searchValue
    ? SEARCH_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(searchValue.toLowerCase())
      )
    : SEARCH_SUGGESTIONS;

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close any open dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setCartOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Escape key closes everything + lock body scroll while mobile drawer is open
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setSupportOpen(false);
        setCategoryOpen(false);
        setProfileOpen(false);
        setCartOpen(false);
        setNotifOpen(false);
        setSearchFocused(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeAllMenus = () => {
    setMobileOpen(false);
    setSupportOpen(false);
    setCategoryOpen(false);
    setProfileOpen(false);
    setCartOpen(false);
    setNotifOpen(false);
  };

  const theme = darkMode
    ? {
        bg: "#0f1512",
        surface: "#161d19",
        surfaceAlt: "#1e2622",
        border: "#273129",
        text: "#f3f5f3",
        textMuted: "#9ca39d",
        accent: "#22c55e",
        accentSoft: "#16341f",
      }
    : {
        bg: "#ffffff",
        surface: "#ffffff",
        surfaceAlt: "#f9fafb",
        border: "#e5e7eb",
        text: "#111827",
        textMuted: "#6b7280",
        accent: "#16a34a",
        accentSoft: "#f0fdf4",
      };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .navbar-root * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        .navbar-root button, .navbar-root a, .navbar-root [role="button"] { cursor: pointer; }
        .navbar-root button:disabled { cursor: not-allowed; opacity: 0.5; }

        /* ── Announcement bar ── */
        .nav-announcement {
          background: linear-gradient(90deg, ${theme.accent} 0%, #15803d 100%);
          color: #fff;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.4px;
          text-align: center;
          padding: 7px 40px 7px 16px;
          position: relative;
          overflow: hidden;
        }
        .nav-announcement-close {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.18);
          border: none;
          color: #fff;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: background 0.15s;
        }
        .nav-announcement-close:hover { background: rgba(255,255,255,0.32); }

        /* ── Main nav wrapper ── */
        .nav-main {
          position: sticky;
          top: 0;
          z-index: 50;
          background: ${theme.surface};
          transition: box-shadow 0.25s ease, background 0.25s ease;
        }
        .nav-main.scrolled { box-shadow: 0 4px 24px rgba(0,0,0,0.09); }
        .nav-main:not(.scrolled) { box-shadow: 0 1px 0 ${theme.border}; }

        /* ── Inner layout ── */
        .nav-inner {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 0 24px;
          height: 64px;
          max-width: 1320px;
          margin: 0 auto;
        }

        /* ── Logo ── */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .nav-logo-mark {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: ${theme.accent};
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          flex-shrink: 0;
        }
        .nav-logo-text {
          font-size: 18px;
          font-weight: 700;
          color: ${theme.accent};
          letter-spacing: -0.4px;
        }
        .nav-logo-text span { color: ${theme.text}; }

        /* ── Desktop links ── */
        .nav-links { display: flex; align-items: center; gap: 2px; }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: ${theme.text};
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.15s, color 0.15s;
          border: none;
          background: none;
          position: relative;
        }
        .nav-link:hover, .nav-link.active { background: ${theme.accentSoft}; color: ${theme.accent}; }
        .nav-link.active::after {
          content: "";
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: 2px;
          height: 2px;
          border-radius: 2px;
          background: ${theme.accent};
        }

        /* ── Mega menu (categories) ── */
        .mega-wrapper { position: relative; }
        .mega-menu {
          position: absolute;
          top: calc(100% + 10px);
          left: 0;
          background: ${theme.surface};
          border: 1px solid ${theme.border};
          border-radius: 14px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.14);
          display: grid;
          grid-template-columns: repeat(4, 170px);
          gap: 4px;
          padding: 18px;
          animation: dropIn 0.16s ease;
          z-index: 60;
        }
        .mega-col-title {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: ${theme.textMuted};
          margin-bottom: 8px;
          padding: 0 8px;
        }
        .mega-item {
          display: block;
          padding: 7px 8px;
          border-radius: 7px;
          font-size: 13.5px;
          color: ${theme.text};
          text-decoration: none;
          transition: background 0.13s, color 0.13s;
        }
        .mega-item:hover { background: ${theme.accentSoft}; color: ${theme.accent}; }

        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Search bar with suggestions ── */
        .nav-search-wrap { flex: 1; max-width: 400px; position: relative; }
        .nav-search {
          display: flex;
          align-items: center;
          position: relative;
        }
        .nav-search input {
          width: 100%;
          padding: 9px 16px 9px 40px;
          border: 1.5px solid ${theme.border};
          border-radius: 10px;
          font-size: 13.5px;
          color: ${theme.text};
          background: ${theme.surfaceAlt};
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
        }
        .nav-search input:focus {
          border-color: ${theme.accent};
          background: ${theme.surface};
          box-shadow: 0 0 0 3px ${theme.accentSoft};
        }
        .nav-search .search-icon {
          position: absolute;
          left: 13px;
          color: ${theme.textMuted};
          pointer-events: none;
          transition: color 0.2s;
        }
        .nav-search:focus-within .search-icon { color: ${theme.accent}; }

        .search-suggestions {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: ${theme.surface};
          border: 1px solid ${theme.border};
          border-radius: 12px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.14);
          padding: 6px;
          animation: dropIn 0.15s ease;
          z-index: 60;
        }
        .search-suggestion-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          border-radius: 8px;
          font-size: 13.5px;
          color: ${theme.text};
          transition: background 0.12s;
        }
        .search-suggestion-item:hover { background: ${theme.accentSoft}; color: ${theme.accent}; }

        /* ── Icon buttons (bell, wishlist, dark mode) ── */
        .icon-btn {
          position: relative;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: none;
          background: none;
          color: ${theme.text};
          transition: background 0.15s, color 0.15s, transform 0.1s;
          flex-shrink: 0;
        }
        .icon-btn:hover { background: ${theme.accentSoft}; color: ${theme.accent}; }
        .icon-btn:active { transform: scale(0.94); }
        .icon-dot {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          border: 2px solid ${theme.surface};
        }
        .icon-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          min-width: 16px;
          height: 16px;
          padding: 0 3px;
          background: #ef4444;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        /* ── Notification dropdown ── */
        .notif-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 280px;
          background: ${theme.surface};
          border: 1px solid ${theme.border};
          border-radius: 14px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.14);
          padding: 8px;
          animation: dropIn 0.15s ease;
          z-index: 60;
        }
        .notif-header {
          font-size: 13px;
          font-weight: 700;
          color: ${theme.text};
          padding: 8px 10px 4px;
        }
        .notif-item {
          padding: 9px 10px;
          border-radius: 8px;
          font-size: 13px;
          color: ${theme.textMuted};
          transition: background 0.12s;
        }
        .notif-item strong { color: ${theme.text}; font-weight: 600; }
        .notif-item:hover { background: ${theme.accentSoft}; }

        /* ── Mini cart dropdown ── */
        .mini-cart {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 300px;
          background: ${theme.surface};
          border: 1px solid ${theme.border};
          border-radius: 14px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.14);
          padding: 14px;
          animation: dropIn 0.15s ease;
          z-index: 60;
        }
        .mini-cart-empty { font-size: 13px; color: ${theme.textMuted}; text-align: center; padding: 20px 0; }
        .mini-cart-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 8px 0;
          border-bottom: 1px solid ${theme.border};
        }
        .mini-cart-row:last-of-type { border-bottom: none; }
        .mini-cart-name { font-size: 13px; color: ${theme.text}; font-weight: 500; }
        .mini-cart-meta { font-size: 12px; color: ${theme.textMuted}; }
        .mini-cart-remove {
          border: none;
          background: none;
          color: ${theme.textMuted};
          padding: 4px;
          border-radius: 6px;
          transition: color 0.13s, background 0.13s;
        }
        .mini-cart-remove:hover { color: #ef4444; background: rgba(239,68,68,0.1); }
        .mini-cart-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1.5px solid ${theme.border};
        }
        .mini-cart-total { font-size: 14px; font-weight: 700; color: ${theme.text}; }
        .mini-cart-checkout {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          background: ${theme.accent};
          border: none;
          text-decoration: none;
          transition: filter 0.15s;
        }
        .mini-cart-checkout:hover { filter: brightness(0.92); }

        /* ── Profile dropdown ── */
        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 10px 5px 5px;
          border-radius: 999px;
          border: 1.5px solid ${theme.border};
          background: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .profile-trigger:hover { border-color: ${theme.accent}; background: ${theme.accentSoft}; }
        .profile-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: ${theme.accent};
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .profile-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 200px;
          background: ${theme.surface};
          border: 1px solid ${theme.border};
          border-radius: 14px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.14);
          padding: 8px;
          animation: dropIn 0.15s ease;
          z-index: 60;
        }
        .profile-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          color: ${theme.text};
          text-decoration: none;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          transition: background 0.12s, color 0.12s;
        }
        .profile-menu-item:hover { background: ${theme.accentSoft}; color: ${theme.accent}; }
        .profile-menu-item.danger:hover { background: rgba(239,68,68,0.1); color: #ef4444; }
        .profile-divider { height: 1px; background: ${theme.border}; margin: 6px 0; }

        /* ── Auth buttons ── */
        .btn-login {
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 600;
          color: ${theme.accent};
          border: 1.5px solid ${theme.accent};
          background: transparent;
          text-decoration: none;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .btn-login:hover { background: ${theme.accentSoft}; }
        .btn-signup {
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 600;
          color: #fff;
          background: ${theme.accent};
          border: none;
          text-decoration: none;
          transition: filter 0.15s, transform 0.1s;
          white-space: nowrap;
        }
        .btn-signup:hover { filter: brightness(0.92); transform: translateY(-1px); }

        /* ── Right cluster ── */
        .nav-right { display: flex; align-items: center; gap: 6px; margin-left: auto; flex-shrink: 0; }

        /* ── Mobile toggle ── */
        .nav-mobile-toggle {
          display: none;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border: none;
          background: ${theme.surfaceAlt};
          border-radius: 8px;
          color: ${theme.text};
          flex-shrink: 0;
        }

        /* ── Mobile drawer + backdrop ── */
        .nav-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 55;
          animation: fadeIn 0.18s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .nav-mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(84vw, 340px);
          background: ${theme.surface};
          z-index: 56;
          padding: 18px;
          overflow-y: auto;
          animation: slideIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .nav-mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .nav-mobile-search { position: relative; margin-bottom: 16px; }
        .nav-mobile-search input {
          width: 100%;
          padding: 10px 16px 10px 40px;
          border: 1.5px solid ${theme.border};
          border-radius: 10px;
          font-size: 14px;
          color: ${theme.text};
          background: ${theme.surfaceAlt};
          outline: none;
        }
        .nav-mobile-search .search-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: ${theme.textMuted};
        }
        .mobile-section-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: ${theme.textMuted};
          margin: 14px 0 6px;
        }
        .mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 12px 4px;
          border-bottom: 1px solid ${theme.border};
          font-size: 14px;
          font-weight: 500;
          color: ${theme.text};
          text-decoration: none;
          transition: color 0.15s;
        }
        .mobile-link:hover { color: ${theme.accent}; }
        .mobile-link-left { display: flex; align-items: center; gap: 10px; }
        .mobile-auth { display: flex; gap: 10px; margin-top: auto; padding-top: 16px; }
        .mobile-auth a { flex: 1; text-align: center; }

        /* ── Responsive breakpoints ── */
        @media (max-width: 1080px) {
          .nav-search-wrap { max-width: 260px; }
        }
        @media (max-width: 900px) {
          .mega-menu { grid-template-columns: repeat(2, 160px); }
        }
        @media (max-width: 768px) {
          .nav-links, .nav-search-wrap, .profile-trigger, .nav-right .icon-btn.desktop-only { display: none !important; }
          .nav-mobile-toggle { display: flex; }
          .nav-logo-text { font-size: 16px; }
        }
        @media (max-width: 400px) {
          .nav-inner { padding: 0 14px; gap: 10px; }
        }
      `}</style>

      <div className="navbar-root">
        {/* Announcement bar */}
        {announcementVisible && (
          <div className="nav-announcement">
            Free shipping on orders above ₹499 — Shop now
            <button
              className="nav-announcement-close"
              onClick={() => setAnnouncementVisible(false)}
              aria-label="Dismiss announcement"
            >
              <FiX size={12} />
            </button>
          </div>
        )}

        {/* Main nav */}
        <nav className={`nav-main${scrolled ? " scrolled" : ""}`}>
          <div className="nav-inner">
            {/* Logo */}
            <NavLink to="/" className="nav-logo" onClick={closeAllMenus}>
              <span className="nav-logo-mark">TL</span>
              <span className="nav-logo-text">
                Thread<span>line</span>
              </span>
            </NavLink>

            {/* Desktop nav links */}
            <div className="nav-links">
              <NavLink
                to="/"
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                Home
              </NavLink>

              {/* Categories mega menu */}
              <div
                className="mega-wrapper"
                onMouseEnter={() => setCategoryOpen(true)}
                onMouseLeave={() => setCategoryOpen(false)}
              >
                <button className="nav-link">
                  Categories
                  <FiChevronDown
                    size={14}
                    style={{
                      transition: "transform 0.2s",
                      transform: categoryOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                {categoryOpen && (
                  <div className="mega-menu">
                    {CATEGORY_MEGA_MENU.map((col) => (
                      <div key={col.title}>
                        <div className="mega-col-title">{col.title}</div>
                        {col.items.map((item) => (
                          <a key={item} href="#" className="mega-item">
                            {item}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Help & Support dropdown */}
              <div
                className="mega-wrapper"
                onMouseEnter={() => setSupportOpen(true)}
                onMouseLeave={() => setSupportOpen(false)}
              >
                <button className="nav-link">
                  Help & support
                  <FiChevronDown
                    size={14}
                    style={{
                      transition: "transform 0.2s",
                      transform: supportOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                {supportOpen && (
                  <div
                    className="mega-menu"
                    style={{ gridTemplateColumns: "200px" }}
                  >
                    <a href="#" className="mega-item" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <FiHeadphones size={15} /> Contact support
                    </a>
                    <a href="#" className="mega-item" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <FiUser size={15} /> FAQ
                    </a>
                    <a href="#" className="mega-item" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <FiPackage size={15} /> Track my order
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Search with live suggestions */}
            <div className="nav-search-wrap" ref={searchRef}>
              <div className="nav-search">
                <FiSearch size={15} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                />
              </div>
              {searchFocused && filteredSuggestions.length > 0 && (
                <div className="search-suggestions">
                  {filteredSuggestions.map((s) => (
                    <div
                      key={s}
                      className="search-suggestion-item"
                      onClick={() => {
                        setSearchValue(s);
                        setSearchFocused(false);
                      }}
                    >
                      <FiSearch size={13} />
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right cluster */}
            <div className="nav-right">
              {/* Dark mode toggle */}
              <button
                className="icon-btn desktop-only"
                onClick={() => setDarkMode((d) => !d)}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              {/* Wishlist */}
              <button className="icon-btn desktop-only" aria-label="Wishlist">
                <FiHeart size={18} />
              </button>

              {/* Notifications */}
              <div style={{ position: "relative" }} ref={notifRef}>
                <button
                  className="icon-btn desktop-only"
                  onClick={() => setNotifOpen((o) => !o)}
                  aria-label="Notifications"
                >
                  <FiBell size={18} />
                  <span className="icon-dot" />
                </button>
                {notifOpen && (
                  <div className="notif-menu">
                    <div className="notif-header">Notifications</div>
                    <div className="notif-item">
                      <strong>Order shipped</strong> — your order #4821 is on the way.
                    </div>
                    <div className="notif-item">
                      <strong>20% off</strong> — pantry essentials this weekend.
                    </div>
                    <div className="notif-item">
                      <strong>Back in stock</strong> — items from your wishlist.
                    </div>
                  </div>
                )}
              </div>

              {/* Mini cart */}
              <div style={{ position: "relative" }} ref={cartRef}>
                <button
                  className="icon-btn"
                  onClick={() => setCartOpen((o) => !o)}
                  aria-label={`Cart, ${cartCount} items`}
                >
                  <FiShoppingCart size={18} />
                  {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
                </button>
                {cartOpen && (
                  <div className="mini-cart">
                    {MINI_CART_ITEMS.length === 0 ? (
                      <div className="mini-cart-empty">Your cart is empty.</div>
                    ) : (
                      <>
                        {MINI_CART_ITEMS.map((item) => (
                          <div className="mini-cart-row" key={item.id}>
                            <div>
                              <div className="mini-cart-name">{item.name}</div>
                              <div className="mini-cart-meta">
                                Qty {item.qty} · ₹{item.price}
                              </div>
                            </div>
                            <button className="mini-cart-remove" aria-label={`Remove ${item.name}`}>
                              <FiTrash2 size={15} />
                            </button>
                          </div>
                        ))}
                        <div className="mini-cart-footer">
                          <span className="mini-cart-total">₹{cartTotal}</span>
                          <NavLink to="/cart" className="mini-cart-checkout" onClick={() => setCartOpen(false)}>
                            Checkout
                          </NavLink>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Auth / profile */}
              {isAuthenticate ? (
                <div style={{ position: "relative" }} ref={profileRef}>
                  <button
                    className="profile-trigger"
                    onClick={() => setProfileOpen((o) => !o)}
                  >
                    <span className="profile-avatar">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </span>
                    <FiChevronDown
                      size={14}
                      style={{
                        transition: "transform 0.2s",
                        transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>
                  {profileOpen && (
                    <div className="profile-menu">
                        <NavLink to="/sellerpanel" className="profile-menu-item">
                          <FiSettings size={15} /> Seller panel
                        </NavLink>
                      
                      {user?.role === "admin" && (
                        <NavLink to="/admindashboard" className="profile-menu-item">
                          <FiSettings size={15} /> Admin panel
                        </NavLink>
                      )}
                      <div className="profile-divider" />
                      <button className="profile-menu-item danger">
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8 }} className="desktop-only">
                  <NavLink to="/login" className="btn-login">
                    Log in
                  </NavLink>
                  <NavLink to="/signin" className="btn-signup">
                    Sign up
                  </NavLink>
                </div>
              )}

              {/* Mobile toggle */}
              <button
                className="nav-mobile-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile backdrop + drawer */}
        {mobileOpen && (
          <>
            <div className="nav-backdrop" onClick={() => setMobileOpen(false)} />
            <div className="nav-mobile-drawer">
              <div className="nav-mobile-header">
                <span className="nav-logo-text">
                  Thread<span>line</span>
                </span>
                <button
                  className="icon-btn"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="nav-mobile-search">
                <FiSearch size={15} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>

              <NavLink to="/" className="mobile-link" onClick={() => setMobileOpen(false)}>
                <span className="mobile-link-left">Home</span>
                <FiChevronRight size={16} />
              </NavLink>

              <div className="mobile-section-title">Shop</div>
              {CATEGORY_MEGA_MENU.map((col) => (
                <a key={col.title} href="#" className="mobile-link">
                  <span className="mobile-link-left">{col.title}</span>
                  <FiChevronRight size={16} />
                </a>
              ))}

              <div className="mobile-section-title">Account</div>
              <NavLink to="/cart" className="mobile-link" onClick={() => setMobileOpen(false)}>
                <span className="mobile-link-left">
                  <FiShoppingCart size={16} /> Cart ({cartCount})
                </span>
                <FiChevronRight size={16} />
              </NavLink>
              <a href="#" className="mobile-link">
                <span className="mobile-link-left">
                  <FiHeart size={16} /> Wishlist
                </span>
                <FiChevronRight size={16} />
              </a>
              <NavLink to="/product" className="mobile-link" onClick={() => setMobileOpen(false)}>
                <span className="mobile-link-left">
                  <FiHeadphones size={16} /> Help & support
                </span>
                <FiChevronRight size={16} />
              </NavLink>
              <button
                className="mobile-link"
                style={{ width: "100%", border: "none", background: "none" }}
                onClick={() => setDarkMode((d) => !d)}
              >
                <span className="mobile-link-left">
                  {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />} Dark mode
                </span>
              </button>

              {!isAuthenticate && (
                <div className="mobile-auth">
                  <NavLink to="/login" className="btn-login" onClick={() => setMobileOpen(false)}>
                    Log in
                  </NavLink>
                  <NavLink to="/signin" className="btn-signup" onClick={() => setMobileOpen(false)}>
                    Sign up
                  </NavLink>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;