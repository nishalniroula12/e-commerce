import { useState } from "react";
import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <nav className="bg-orange-400 shadow-md sticky top-0 z-50">
      {" "}
      {/* TOP BAR */}{" "}
      <div className="flex items-center justify-between px-6 py-3">
        {" "}
        {/* LOGO */}{" "}
    
<img
src="data:image/jpeg;base64,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"
alt="Logo"
className="w-15 h-15 rounded-full bg-white"></img>
    
    
        {/* DESKTOP MENU */}{" "}
        <div className="hidden md:flex items-center gap-8 relative">
          {" "}
          <NavLink to="/" className="hover:text-indigo-600 cursor-pointer">
            Home
          </NavLink>{" "}
          {/* CATEGORY */}{" "}
          <div
            className="relative"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            {" "}
            <NavLink to="/category" className="hover:text-indigo-600"> Categories </NavLink>
            </div>
            {/* PRODUCTS */}{" "}
          <div
            className="relative"
            onMouseEnter={() => setProdOpen(true)}
            onMouseLeave={() => setProdOpen(false)}
          >
            {" "}
            <NavLink to="/product" className="hover:text-indigo-600"> Products </NavLink>{" "}
            </div>
            
             <a className="hover:text-indigo-600 cursor-pointer">
            Become a Sellers
          </a>{" "}
          {/* SEARCH */}{" "}
          <input
            type="text"
            placeholder="Search products..."
            className="border px-3 py-1 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />{" "}
        </div>{" "}
        {/* RIGHT */}{" "}
        <div className="flex items-center gap-4">
          {" "}
          {/* CART */}{" "}
          <div className="relative cursor-pointer">
            {" "}
            <FiShoppingCart size={22} />{" "}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
              {" "}
              3{" "}
            </span>{" "}
          </div>{" "}
          {/* PROFILE */}{" "}
          <div className="relative">
            {" "}
            <FiUser
              size={22}
              className="cursor-pointer"
              onClick={() => setProfileOpen(!profileOpen)}
            />{" "}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden">
                {" "}
                <p className="px-4 py-2 font-semibold">My Account</p>{" "}
                <a className="block px-4 py-2 hover:bg-gray-100">Profile</a>{" "}
                <a className="block px-4 py-2 hover:bg-gray-100">Orders</a>{" "}
                <NavLink className="block px-4 py-2 text-red-500 hover:bg-gray-100">
                  {" "}
                  login{" "}
                </NavLink>{" "}
              </div>
            )}{" "}
          </div>{" "}
          {/* MOBILE MENU */}{" "}
          <div className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {" "}
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* MOBILE MENU */}{" "}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4 space-y-3">
          {" "}
          <a className="block">Home</a> <a className="block">Categories</a>{" "}
          <a className="block">Products</a> <a className="block">Sellers</a>{" "}
          <input
            className="w-full border px-3 py-2 rounded-lg"
            placeholder="Search..."
          />{" "}
        </div>
      )}{" "}
    </nav>
  );
};
export default Navbar;
