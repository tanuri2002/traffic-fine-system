import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

import { FaUserShield, FaEnvelope, FaLock } from "react-icons/fa";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fixAutofill = () => {
      const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
      inputs.forEach((input) => {
        input.style.backgroundColor = "transparent !important";
        input.style.backgroundImage = "none !important";
        input.style.WebkitAutofillBoxShadow = "0 0 0 1000px transparent inset !important";
        input.style.WebkitTextFillColor = "#fff !important";
        input.style.boxShadow = "0 0 0 1000px transparent inset !important";
      });
    };
    
    fixAutofill();
    setTimeout(fixAutofill, 50);
    setTimeout(fixAutofill, 100);
  }, []);

  const handleLogin = async () => {
    const response = await login(username, password);

    if (response.success) {
      navigate("/dashboard");
    } else {
      alert(response.message || "Invalid credentials");
    }
  };

  return (
    <div className="relative min-h-screen py-10 overflow-hidden bg-[#0b1324] flex justify-center items-center">
      {/* Animated Background Glow */}
      <div className="absolute top-[-150px] left-[-150px] w-[420px] h-[420px] bg-cyan-400/30 rounded-full blur-3xl animate-pulse"></div>

      <div className="absolute bottom-[-150px] right-[-150px] w-[420px] h-[420px] bg-blue-500/25 rounded-full blur-3xl animate-pulse"></div>

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="relative z-10 group">
        {/* Outer Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-[36px] blur opacity-35 group-hover:opacity-70 transition duration-1000"></div>

        {/* Main Card */}
          <div className="relative w-[440px] max-h-[85vh] rounded-[36px] overflow-hidden border border-white/10 bg-white/10 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.65)]">
          {/* Top Light Reflection */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/15 to-transparent"></div>

          {/* Decorative Gradient Line */}
          <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400"></div>

          <div className="px-12 py-12">
            {/* Logo */}
            <div className="flex flex-col items-center mb-10">
              <div className="relative">
                {/* Pulsing Glow */}
                <div className="absolute inset-0 rounded-full bg-cyan-400 blur-2xl opacity-40 animate-pulse"></div>

                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex justify-center items-center shadow-[0_0_40px_rgba(59,130,246,0.8)]">
                  <FaUserShield className="text-white text-5xl" />
                </div>
              </div>

              <h1 className="text-5xl font-black text-white mt-8 tracking-tight">
                Admin Portal
              </h1>

              <p className="text-slate-400 mt-3 text-center leading-relaxed">
                Sri Lanka Traffic Fine Management System
              </p>
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="text-slate-300 text-sm font-medium">
                Email Address
              </label>

              <div className="mt-3 flex items-center bg-transparent border border-white/25 rounded-2xl px-5 hover:border-cyan-400 focus-within:border-cyan-400 transition-all duration-300">
                <FaEnvelope className="text-slate-400 text-lg" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="off"
                  className="w-full p-4 outline-none text-white placeholder-slate-500"
                  style={{
                    backgroundColor: "transparent !important",
                    backgroundImage: "none !important",
                    WebkitAutofillBoxShadow: "0 0 0 1000px transparent inset !important",
                    WebkitAutofillTextFillColor: "#fff !important",
                    boxShadow: "0 0 0 1000px transparent inset !important",
                  }}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-10">
              <label className="text-slate-300 text-sm font-medium">
                Password
              </label>

              <div className="mt-3 flex items-center bg-transparent border border-white/25 rounded-2xl px-5 hover:border-cyan-400 focus-within:border-cyan-400 transition-all duration-300">
                <FaLock className="text-slate-400 text-lg" />

                <input
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="off"
                  className="w-full p-4 outline-none text-white placeholder-slate-500"
                  style={{
                    backgroundColor: "transparent !important",
                    backgroundImage: "none !important",
                    WebkitAutofillBoxShadow: "0 0 0 1000px transparent inset !important",
                    WebkitAutofillTextFillColor: "#fff !important",
                    boxShadow: "0 0 0 1000px transparent inset !important",
                  }}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="relative overflow-hidden w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-[0_10px_50px_rgba(59,130,246,0.6)] hover:scale-[1.02] transition-all duration-300"
            >
              <span className="relative z-10">Secure Login</span>

              {/* Shine Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>

            {/* Footer */}
            <div className="mt-10 text-center">
              <p className="text-slate-500 text-sm">Authorized access only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
