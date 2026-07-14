import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, ShieldCheck, Lock, ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "../component/Navbar"; // Change the path if needed

const Forget = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showRepassword, setShowRepassword] = useState(false);

  const sendOtp = async () => {
    if (!email) {
      return alert("Please enter your email");
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/forget", {
        email,
      });

      alert(res.data.message);
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!otp || !password || !repassword) {
      return alert("Please fill all fields");
    }

    if (password !== repassword) {
      return alert("Passwords do not match");
    }

    if (password.length < 6) {
      return alert("Password must be at least 6 characters long");
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/reset", {
        token: otp,
        password,
      });

      alert(res.data.message || "Password reset successful");

      setEmail("");
      setOtp("");
      setPassword("");
      setRepassword("");
      setStep(1);

      // Redirect to login after a successful reset
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-100 flex items-center justify-center px-4 py-10">
        <div className="bg-white/90 backdrop-blur shadow-2xl ring-1 ring-black/5 rounded-3xl p-8 w-full max-w-md">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div
              className={`h-2 w-10 rounded-full transition-colors ${
                step >= 1 ? "bg-indigo-600" : "bg-gray-200"
              }`}
            />
            <div
              className={`h-2 w-10 rounded-full transition-colors ${
                step >= 2 ? "bg-indigo-600" : "bg-gray-200"
              }`}
            />
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="h-14 w-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-3">
              {step === 1 ? (
                <Mail className="h-7 w-7 text-indigo-600" />
              ) : (
                <ShieldCheck className="h-7 w-7 text-indigo-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              {step === 1 ? "Forgot Password" : "Reset Your Password"}
            </h2>
            <p className="text-sm text-gray-500 text-center mt-1">
              {step === 1
                ? "Enter your email and we'll send you a code"
                : "Enter the OTP sent to your email and choose a new password"}
            </p>
          </div>

          {step === 1 && (
            <>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative mb-6">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                />
              </div>

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition shadow-lg shadow-indigo-600/20"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                OTP
              </label>
              <div className="relative mb-4">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition tracking-widest"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative mb-4">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative mb-6">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showRepassword ? "text" : "password"}
                  placeholder="Confirm password"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={repassword}
                  onChange={(e) => setRepassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && resetPassword()}
                />
                <button
                  type="button"
                  onClick={() => setShowRepassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                  aria-label={showRepassword ? "Hide password" : "Show password"}
                >
                  {showRepassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {password && repassword && password !== repassword && (
                <p className="text-sm text-red-500 -mt-4 mb-4">
                  Passwords do not match
                </p>
              )}

              <button
                onClick={resetPassword}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition shadow-lg shadow-green-600/20"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Forget;