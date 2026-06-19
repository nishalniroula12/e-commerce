import axios from "axios";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Sidebar from "../../component/Sidebar";
import {  logoutdata } from "../../Redux/slice";
import { useDispatch } from "react-redux";
const Seller = () => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
const dispatch =useDispatch()
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/niske",
        {},
        { withCredentials: true }
      );

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      dispatch(logoutdata())
navigate("/")
      

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex">
      
      {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
    </div>
  );
};

export default Seller;