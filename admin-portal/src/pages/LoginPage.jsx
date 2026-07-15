import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../services/authService";

import { FaUserShield, FaIdBadge, FaLock, FaPhone, FaMapMarkerAlt, FaUser } from "react-icons/fa";

function LoginPage() {
  const [mode, setMode] = useState("login");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage("");

    const response = await login(badgeNumber, password);

    setLoading(false);

    if (response.success) {
      navigate("/dashboard");
    } else {
      setErrorMessage(response.message || "Invalid credentials");
    }
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const response = await signup({
      badgeNumber,
      name,
      phone,
      district,
      password,
    });

    setLoading(false);

    if (response.success) {
      setMode("login");
      setPassword("");
      setConfirmPassword("");
      setErrorMessage("Account created. You can log in now.");
    } else {
      setErrorMessage(response.message || "Signup failed");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (mode === "login") {
      await handleLogin();
      return;
    }

    await handleSignup();
  };

  const resetForm = () => {
    setBadgeNumber("");
    setName("");
    setPhone("");
    setDistrict("");
    setPassword("");
    setConfirmPassword("");
    setErrorMessage("");
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    resetForm();
    setErrorMessage("");
  };

  const inputBase = "w-full bg-transparent p-4 outline-none text-white placeholder-slate-500";
  const fieldShell = "mt-3 flex items-center gap-3 bg-white/5 border border-white/15 rounded-2xl px-5 hover:border-cyan-400 focus-within:border-cyan-400 transition-all duration-300";

  return (
    <div className="relative min-h-screen py-10 overflow-hidden bg-[#0b1324] flex justify-center items-center">
      <div className="absolute top-[-150px] left-[-150px] w-[420px] h-[420px] bg-cyan-400/30 rounded-full blur-3xl animate-pulse"></div>

      <div className="absolute bottom-[-150px] right-[-150px] w-[420px] h-[420px] bg-blue-500/25 rounded-full blur-3xl animate-pulse"></div>

      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="relative z-10 group w-[min(92vw,520px)]">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-[36px] blur opacity-35 group-hover:opacity-70 transition duration-1000"></div>

        <div className="relative rounded-[36px] overflow-hidden border border-white/10 bg-white/10 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.65)]">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/15 to-transparent"></div>

          <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400"></div>

          <form className="px-8 py-10 sm:px-12 sm:py-12" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
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

            <div className="grid grid-cols-2 gap-3 p-1 mb-6 rounded-2xl bg-white/5 border border-white/10">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`rounded-xl py-3 text-sm font-semibold transition-all ${mode === "login" ? "bg-cyan-500 text-white shadow-lg" : "text-slate-300 hover:text-white"}`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={`rounded-xl py-3 text-sm font-semibold transition-all ${mode === "signup" ? "bg-cyan-500 text-white shadow-lg" : "text-slate-300 hover:text-white"}`}
              >
                Signup
              </button>
            </div>

            {mode === "signup" && (
              <div className="mb-5">
                <label className="text-slate-300 text-sm font-medium">Name</label>

                <div className={fieldShell}>
                  <FaUser className="text-slate-400 text-lg shrink-0" />

                  <input
                    type="text"
                    placeholder="Enter full name"
                    autoComplete="name"
                    className={inputBase}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="mb-5">
              <label className="text-slate-300 text-sm font-medium">Badge Number</label>

              <div className={fieldShell}>
                <FaIdBadge className="text-slate-400 text-lg shrink-0" />

                <input
                  type="text"
                  placeholder="Enter badge number"
                  autoComplete="off"
                  className={inputBase}
                  value={badgeNumber}
                  onChange={(e) => setBadgeNumber(e.target.value)}
                />
              </div>
            </div>

            {mode === "signup" && (
              <div className="mb-5">
                <label className="text-slate-300 text-sm font-medium">Phone</label>

                <div className={fieldShell}>
                  <FaPhone className="text-slate-400 text-lg shrink-0" />

                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    autoComplete="tel"
                    className={inputBase}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            )}

            {mode === "signup" && (
              <div className="mb-5">
                <label className="text-slate-300 text-sm font-medium">District</label>

                <div className={fieldShell}>
                  <FaMapMarkerAlt className="text-slate-400 text-lg shrink-0" />

                  <input
                    type="text"
                    placeholder="Enter district"
                    autoComplete="off"
                    className={inputBase}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="mb-5">
              <label className="text-slate-300 text-sm font-medium">
                Password
              </label>

              <div className={fieldShell}>
                <FaLock className="text-slate-400 text-lg" />

                <input
                  type="password"
                  placeholder={mode === "login" ? "Enter your password" : "Create a password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className={inputBase}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {mode === "signup" && (
              <div className="mb-6">
                <label className="text-slate-300 text-sm font-medium">Confirm Password</label>

                <div className={fieldShell}>
                  <FaLock className="text-slate-400 text-lg" />

                  <input
                    type="password"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className={inputBase}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-5 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="relative overflow-hidden w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-[0_10px_50px_rgba(59,130,246,0.6)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100"
            >
              <span className="relative z-10">{loading ? "Please wait..." : mode === "login" ? "Secure Login" : "Create Account"}</span>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>

            <button
              type="button"
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              className="mt-5 w-full text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {mode === "login" ? "Need an account? Sign up" : "Already registered? Log in"}
            </button>

            <div className="mt-10 text-center">
              <p className="text-slate-500 text-sm">Authorized access only</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
