import axios from "axios";
import React, { useState } from "react";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { logindata } from "../Redux/slice";
import { useDispatch } from "react-redux";
import Navbar from "../component/Navbar";

const Login = () => {
  const [data, setdata] = useState([]);
  const nav = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center px-4">
        <div className="w-full max-w-5xl bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col md:flex-row">
          {/* Left Side */}
          <div className="md:w-1/2 p-10 text-white flex flex-col justify-center">
            <h1 className="text-5xl font-bold mb-6">Welcome Back 👋</h1>

            <p className="text-lg text-gray-200 mb-8">
              Login to access your marketplace dashboard and continue shopping
              or managing your store.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛍️</span>
                <p>Browse thousands of products</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-2xl">🏪</span>
                <p>Manage your seller account</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <p>Secure & Fast Login</p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="md:w-1/2 bg-white p-8 md:p-12">
            <h2 className="text-4xl font-bold text-center text-gray-800">
              Login
            </h2>

            <p className="text-center text-gray-500 mt-2 mb-8">
              Sign in to your account
            </p>

            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              onSubmit={async (values) => {
                try {
                  const res = await axios.post(
                    "http://localhost:8000/api/login",
                    values,
                    { withCredentials: true }
                  );
                  console.log(res.data)
                  console.log(res.data.users.role);

                  const { users, token } = res.data;

                  localStorage.setItem("token", res.data.token);
                  localStorage.setItem("user", JSON.stringify(res.data.users));

                  dispatch(logindata(res.data));

                  if (res.data.users.role === "admin") {
                    nav("/admindashboard");
                  } else if (res.data.users.role === "seller") {
                    console.log(res.data);
                    nav("/sellerpanel");
                  } else {
                    nav("/");
                  }
                  setdata(res.data);
                  console.log(res.data);
                } catch (error) {
                  console.log(error)
                  }
              }}
            >
              {({ handleChange, values, handleSubmit }) => (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition"
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
                      placeholder="Enter your password"
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-indigo-600 hover:text-pink-500 font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition duration-300 shadow-lg"
                  >
                    Login
                  </button>

                  <div className="text-center">
                    <p className="text-gray-600">Don't have an account?</p>

                    <button
                      type="button"
                      onClick={() => nav("/signin")}
                      className="mt-2 font-bold text-indigo-600 hover:text-pink-500"
                    >
                      Create Account →
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

export default Login;
