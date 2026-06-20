import axios from "axios";
import { Formik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";

const Signin = () => {
  const nav = useNavigate();

  return (
    <><Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col lg:flex-row">
        
        {/* Left Side */}
        <div className="lg:w-1/2 p-10 flex flex-col justify-center text-white">
          <h1 className="text-5xl font-extrabold mb-6">
            Welcome to
            <span className="block text-yellow-300">
              Multi Vendor Store
            </span>
          </h1>

          <p className="text-lg text-gray-200 leading-relaxed">
            Create your account and start buying or selling products
            with a powerful marketplace platform.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚀</span>
              <p>Fast & Secure Registration</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl">🛍️</span>
              <p>Manage Products Easily</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <p>Grow Your Online Business</p>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="lg:w-1/2 bg-white p-8 md:p-12">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-2">
            Create Account
          </h2>

          <p className="text-center text-gray-500 mb-8">
            Join our marketplace today
          </p>

          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              role: "",
            }}
            onSubmit={async (values) => {
              try {
                const res = await axios.post(
                  "http://localhost:8000/api/register",
                  values,{withCredentials:true}
                );

                console.log(res.data);
                alert("Registration Successful");
              } catch (error) {
                console.log(error);
              }
            }}
          >
            {({ handleChange, values, handleSubmit }) => (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Select Role
                  </label>

                  <select
                    name="role"
                    value={values.role}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                  ><option>admin</option>
                  <option>seller</option>
                  <option>user</option>
                    
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition duration-300 shadow-lg"
                >
                  Create Account
                </button>

                <div className="text-center">
                  <p className="text-gray-600">
                    Already have an account?
                  </p>

                  <button
                    type="button"
                    onClick={() => nav("/login")}
                    className="mt-3 text-indigo-600 font-bold hover:text-pink-500 transition"
                  >
                    Login Here →
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
    </>
  );
};

export default Signin;