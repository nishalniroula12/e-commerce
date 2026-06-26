import { useState, useEffect, use } from "react";
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiSearch,
  FiChevronDown,
  FiHeadphones,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const nav = useNavigate();

  const isAuthenticate = useSelector((state) => state.data.isAuthenticate);
  const user = useSelector((state) => state.data.user);
  console.log(isAuthenticate);
  console.log(user);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .navbar-root * { font-family: 'Inter', sans-serif; box-sizing: border-box; }

        /* ── Top announcement bar ── */
        .nav-announcement {
          background: linear-gradient(90deg, #16a34a 0%, #15803d 100%);
          color: #fff;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.4px;
          text-align: center;
          padding: 7px 16px;
        }

        /* ── Main nav wrapper ── */
        .nav-main {
          position: sticky;
          top: 0;
          z-index: 50;
          background: #fff;
          transition: box-shadow 0.25s ease;
        }
        .nav-main.scrolled {
          box-shadow: 0 4px 24px rgba(0,0,0,0.09);
        }
        .nav-main:not(.scrolled) {
          box-shadow: 0 1px 0 #e5e7eb;
        }

        /* ── Inner layout ── */
        .nav-inner {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 0 24px;
          height: 64px;
          max-width: 1280px;
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
        .nav-logo img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #16a34a;
        }
        .nav-logo-text {
          font-size: 18px;
          font-weight: 700;
          color: #16a34a;
          letter-spacing: -0.4px;
        }
        .nav-logo-text span { color: #111827; }

        /* ── Search bar ── */
        .nav-search {
          flex: 1;
          max-width: 380px;
          position: relative;
          display: flex;
          align-items: center;
        }
        .nav-search input {
          width: 100%;
          padding: 9px 16px 9px 40px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 13.5px;
          color: #111827;
          background: #f9fafb;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
        }
        .nav-search input:focus {
          border-color: #16a34a;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.12);
        }
        .nav-search .search-icon {
          position: absolute;
          left: 13px;
          color: #9ca3af;
          pointer-events: none;
          transition: color 0.2s;
        }
        .nav-search input:focus ~ .search-icon,
        .nav-search:focus-within .search-icon {
          color: #16a34a;
        }

        /* ── Desktop links ── */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: auto;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s, color 0.15s;
          border: none;
          background: none;
          position: relative;
        }
        .nav-link:hover, .nav-link.active {
          background: #f0fdf4;
          color: #16a34a;
        }

        /* ── Dropdown ── */
        .dropdown-wrapper {
          position: relative;
        }
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.12);
          min-width: 200px;
          padding: 6px;
          animation: dropIn 0.15s ease;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          transition: background 0.13s, color 0.13s;
        }
        .dropdown-item:hover {
          background: #f0fdf4;
          color: #16a34a;
        }
        .dropdown-item svg { flex-shrink: 0; }

        /* ── Divider in dropdown ── */
        .dropdown-divider {
          height: 1px;
          background: #f3f4f6;
          margin: 6px 0;
        }

        /* ── Cart button ── */
        .nav-cart {
          position: relative;
          cursor: pointer;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: #374151;
          transition: background 0.15s, color 0.15s;
          flex-shrink: 0;
        }
        .nav-cart:hover { background: #f0fdf4; color: #16a34a; }
        .nav-cart-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 16px;
          height: 16px;
          background: #ef4444;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        /* ── Auth buttons ── */
        .btn-login {
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 600;
          color: #16a34a;
          border: 1.5px solid #16a34a;
          background: transparent;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .btn-login:hover { background: #f0fdf4; }

        .btn-signup {
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 600;
          color: #fff;
          background: #16a34a;
          border: none;
          text-decoration: none;
          transition: background 0.15s, transform 0.1s;
          white-space: nowrap;
          cursor: pointer;
        }
        .btn-signup:hover { background: #15803d; transform: translateY(-1px); }

        /* ── Mobile toggle ── */
        .nav-mobile-toggle {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          background: #f3f4f6;
          border-radius: 8px;
          cursor: pointer;
          color: #374151;
          margin-left: auto;
          flex-shrink: 0;
        }

        /* ── Mobile drawer ── */
        .nav-mobile-drawer {
          background: #fff;
          border-top: 1px solid #f3f4f6;
          padding: 16px 20px 20px;
          animation: slideDown 0.18s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-mobile-search {
          position: relative;
          margin-bottom: 16px;
        }
        .nav-mobile-search input {
          width: 100%;
          padding: 10px 16px 10px 40px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          color: #111827;
          background: #f9fafb;
          outline: none;
        }
        .nav-mobile-search input:focus {
          border-color: #16a34a;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.12);
        }
        .nav-mobile-search .search-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
        }
        .mobile-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 4px;
          border-bottom: 1px solid #f3f4f6;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.15s;
        }
        .mobile-link:hover { color: #16a34a; }
        .mobile-link:last-child { border-bottom: none; }
        .mobile-auth {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }
        .mobile-auth a {false
          flex: 1;
          text-align: center;
        }

        /* ── Responsive breakpoints ── */
        @media (max-width: 900px) {
          .nav-search { max-width: 260px; }
        }
        @media (max-width: 768px) {
          .nav-links, .nav-search { display: none !important; }
          .nav-mobile-toggle { display: flex; }
          .nav-logo-text { font-size: 16px; }
        }
        @media (max-width: 400px) {
          .nav-inner { padding: 0 14px; gap: 12px; }
        }
      `}</style>

      <div className="navbar-root">
        {/* Announcement bar */}
        <div className="nav-announcement">
          🎉 Free shipping on orders above ₹499 — Shop Now
        </div>

        {/* Main nav */}
        <nav className={`nav-main${scrolled ? " scrolled" : ""}`}>
          <div className="nav-inner">
            {/* Logo */}
            <NavLink to="/" className="nav-logo">
              <img
                src="data:image/jpeg;base64,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"
                alt="Logo"
              />
              <span className="nav-logo-text">
                Fresh<span>Mart</span>
              </span>
            </NavLink>

            {/* Search (desktop) */}
            <div className="nav-search" style={{ display: "flex" }}>
              <FiSearch
                size={15}
                className="search-icon"
                style={{ position: "absolute", left: 13 }}
              />
              <input
                type="text"
                placeholder="Search for products..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>

            {/* Desktop nav links */}
            <div className="nav-links">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                Home
              </NavLink>

              {/* Help & Support dropdown */}
              <div
                className="dropdown-wrapper"
                onMouseEnter={() => setSupportOpen(true)}
                onMouseLeave={() => setSupportOpen(false)}
              >
                <button
                  className="nav-link"
                  style={{ display: "flex", alignItems: "center", gap: 5 }}
                >
                  Help & Support
                  <FiChevronDown
                    size={14}
                    style={{
                      transition: "transform 0.2s",
                      transform: supportOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </button>

                {supportOpen && (
                  <div className="dropdown-menu">
                    <a href="#" className="dropdown-item">
                      <FiHeadphones size={15} /> Contact Support
                    </a>
                    <a href="#" className="dropdown-item">
                      <FiUser size={15} /> FAQ
                    </a>
                    <div className="dropdown-divider" />
                    <a href="#" className="dropdown-item">
                      <FiShoppingCart size={15} /> Track My Order
                    </a>
                  </div>
                )}
              </div>
              {/* Right side (Cart + Auth / Seller) */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                {isAuthenticate ? (
                  <>
                    <div className="nav-cart">
                      <FiShoppingCart size={20} />
                      <NavLink to="/cart" className="nav-cart-badge">
                        3
                      </NavLink>
                    </div>

                    {/* Seller Dashboard */}
                    {user?.role === "seller" && (
                      <NavLink to="/sellerpanel" className="nav-link">
                        Seller Panel
                      </NavLink>
                    )}

                    {/* You can also show Home shortcut if you want */}

                    {/* Cart still visible for logged users */}
                  </>
                ) : (
                  <>
                    {/* Cart */}
                    <div className="nav-cart">
                      <FiShoppingCart size={20} />
                      <NavLink to="/cart" className="nav-cart-badge">
                        3
                      </NavLink>
                    </div>

                    {/* Auth buttons */}
                    <div className="nav-links" style={{ gap: 8 }}>
                      <NavLink to="/login" className="btn-login">
                        Log in
                      </NavLink>
                      <NavLink to="/signin" className="btn-signup">
                        Sign up
                      </NavLink>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Cart */}
            {/* Mobile toggle */}
            <button
              className="nav-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>

          {/* Mobile drawer */}
          {mobileOpen && (
            <div className="nav-mobile-drawer">
              <div className="nav-mobile-search">
                <FiSearch size={15} className="search-icon" />
                <input type="text" placeholder="Search for products..." />
              </div>

              <NavLink
                to="/"
                className="mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                🏠 Home
              </NavLink>
              <a className="mobile-link" onClick={() => setMobileOpen(false)}>
                📦 Categories
              </a>
              <NavLink
                to="/product"
                className="mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                🎧 Help & Support
              </NavLink>
              <a className="mobile-link" onClick={() => setMobileOpen(false)}>
                🏪 Become a Seller
              </a>
              <NavLink
                to="/cart"
                className="mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                🛒 Cart (3 items)
              </NavLink>

              <div className="mobile-auth">
                <NavLink
                  to="/login"
                  className="btn-login"
                  style={{ display: "block" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/signin"
                  className="btn-signup"
                  style={{ display: "block", borderRadius: 8 }}
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </NavLink>
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
