import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../services/authService";

import { FaUserShield, FaIdBadge, FaLock, FaUser, FaEnvelope, FaArrowRight } from "react-icons/fa";

function LoginPage() {
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
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
      fullName,
      officialEmail,
      badgeNumber,
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
    setFullName("");
    setOfficialEmail("");
    setBadgeNumber("");
    setPassword("");
    setConfirmPassword("");
    setErrorMessage("");
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    resetForm();
    setErrorMessage("");
  };

  // ---- Design tokens -------------------------------------------------
  // Blue + white driver/officer-portal system: bright blue gradient accents
  // on clean white panels, matching the rest of the admin portal.
  const inputBase =
    "lp-input w-full bg-transparent py-3.5 outline-none !text-[#0f2940] placeholder-[#cbd5e1] text-[15px]";
  const inputStyle = { color: "#0f2940", WebkitTextFillColor: "#0f2940" };
  const fieldShell =
    "mt-2 flex items-center gap-3 bg-[#f8fbff] border border-[rgba(16,40,64,0.08)] rounded-xl px-4 " +
    "focus-within:bg-white focus-within:border-[#2678ea] focus-within:ring-4 focus-within:ring-[#2678ea]/12 transition-all duration-200";
  const label = "text-[#5c7188] text-[12.5px] font-semibold tracking-wide uppercase";

  return (
    <div className="relative min-h-screen py-12 bg-[#eef4fb] flex justify-center items-center px-4 overflow-hidden">
      <style>{`
        @keyframes loginCardIn {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes emblemPop {
          0% { opacity: 0; transform: scale(0.6); }
          60% { opacity: 1; transform: scale(1.06); }
          100% { opacity: 1; transform: scale(1); }
        }
        .login-card-animate { animation: loginCardIn 480ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        .login-emblem-animate { animation: emblemPop 560ms cubic-bezier(0.16, 1, 0.3, 1) 80ms both; }

        /* Chrome/Safari force their own text color on autofilled fields —
           this is the only reliable way to override it. */
        .lp-input:-webkit-autofill,
        .lp-input:-webkit-autofill:hover,
        .lp-input:-webkit-autofill:focus,
        .lp-input:-webkit-autofill:active {
          -webkit-text-fill-color: #0f2940 !important;
          caret-color: #0f2940 !important;
          box-shadow: 0 0 0 1000px #f8fbff inset !important;
          transition: background-color 9999s ease-in-out 0s;
        }

        input.lp-input::placeholder,
        .lp-input::placeholder {
          color: #cbd5e1 !important;
          -webkit-text-fill-color: #cbd5e1 !important;
          opacity: 1 !important;
        }

        input.lp-input::-webkit-input-placeholder {
          color: #cbd5e1 !important;
          -webkit-text-fill-color: #cbd5e1 !important;
          opacity: 1 !important;
        }

        input.lp-input:-moz-placeholder,
        input.lp-input::-moz-placeholder {
          color: #cbd5e1 !important;
          opacity: 1 !important;
        }

        input.lp-input:-ms-input-placeholder {
          color: #cbd5e1 !important;
        }
      `}</style>

      {/* Glowing accent blobs, echoing the driver portal hero */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-[#2678ea]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-[#5fb6ff]/20 rounded-full blur-3xl animate-pulse"></div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #2678ea 0px, #2678ea 1px, transparent 1px, transparent 14px)",
        }}
      ></div>

      <div className="relative z-10 w-[min(94vw,480px)] login-card-animate">
        <div className="relative">
          {/* Soft glow halo behind the card */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-[#2678ea] to-[#5fb6ff] rounded-[28px] blur-xl opacity-25"></div>

          <div className="relative rounded-2xl overflow-hidden border border-[#e5edf6] bg-white shadow-[0_30px_70px_rgba(15,41,64,0.2)]">
            {/* Header accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#2678ea] via-[#5fb6ff] to-[#2678ea]"></div>

            <form className="px-8 py-10 sm:px-10" onSubmit={handleSubmit} noValidate>
              {/* Emblem */}
              <div className="flex flex-col items-center mb-8">
                <div className="login-emblem-animate relative w-20 h-20 rounded-full bg-gradient-to-br from-[#2678ea] to-[#1a5cc2] flex justify-center items-center shadow-[0_18px_38px_rgba(38,120,234,0.4)]">
                  <div className="absolute -inset-2 rounded-full border border-[#2678ea]/20"></div>
                  <div className="absolute inset-1 rounded-full border border-white/25"></div>
                  <FaUserShield className="text-white text-3xl" />
                </div>

                <p className="mt-5 inline-flex rounded-full bg-[#2678ea]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.28em] text-[#1a5cc2] uppercase">
                  Official Use Only
                </p>

                <h1 className="text-[34px] font-extrabold leading-tight mt-2 text-center tracking-tight">
                  <span className="text-[#12324d]">Admin</span>{" "}
                  <span className="bg-gradient-to-r from-[#2678ea] to-[#1a5cc2] bg-clip-text text-transparent">
                    Portal
                  </span>
                </h1>

                <p className="text-[#5c7188] mt-2 text-[14px] text-center leading-relaxed max-w-[320px]">
                  Sri Lanka Traffic Fine Management System
                </p>
              </div>

              {/* Mode switch */}
              <div
                role="tablist"
                aria-label="Choose login or signup"
                className="relative grid grid-cols-2 gap-1 p-1 mb-7 rounded-xl bg-[#f0f5fc] border border-[#e5edf6]"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "login"}
                  onClick={() => switchMode("login")}
                  className={`rounded-lg py-2.5 text-[14px] font-semibold transition-all duration-200 ${
                    mode === "login"
                      ? "bg-gradient-to-r from-[#2678ea] to-[#1a5cc2] text-white shadow-[0_8px_18px_rgba(38,120,234,0.32)]"
                      : "text-[#5c7188] hover:text-[#12324d]"
                  }`}
                >
                  Login
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "signup"}
                  onClick={() => switchMode("signup")}
                  className={`rounded-lg py-2.5 text-[14px] font-semibold transition-all duration-200 ${
                    mode === "signup"
                      ? "bg-gradient-to-r from-[#2678ea] to-[#1a5cc2] text-white shadow-[0_8px_18px_rgba(38,120,234,0.32)]"
                      : "text-[#5c7188] hover:text-[#12324d]"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {mode === "signup" && (
                <div className="mb-5">
                  <label htmlFor="fullName" className={label}>
                    Full Name
                  </label>

                  <div className={fieldShell}>
                    <FaUser className="text-[#9aa8ba] text-base shrink-0" />

                    <input
                      id="fullName"
                      type="text"
                      placeholder="Enter full name"
                      autoComplete="name"
                      className={inputBase}
                      style={inputStyle}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {mode === "signup" && (
                <div className="mb-5">
                  <label htmlFor="officialEmail" className={label}>
                    Official Email
                  </label>

                  <div className={fieldShell}>
                    <FaEnvelope className="text-[#9aa8ba] text-base shrink-0" />

                    <input
                      id="officialEmail"
                      type="email"
                      placeholder="Enter official email"
                      autoComplete="email"
                      className={inputBase}
                      style={inputStyle}
                      value={officialEmail}
                      onChange={(e) => setOfficialEmail(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="mb-5">
                <label htmlFor="badgeNumber" className={label}>
                  Badge Number
                </label>

                <div className={fieldShell}>
                  <FaIdBadge className="text-[#9aa8ba] text-base shrink-0" />

                  <input
                    id="badgeNumber"
                    type="text"
                    placeholder="Enter badge number"
                    autoComplete="off"
                    className={inputBase}
                      style={inputStyle}
                    value={badgeNumber}
                    onChange={(e) => setBadgeNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="password" className={label}>
                  Password
                </label>

                <div className={fieldShell}>
                  <FaLock className="text-[#9aa8ba] text-base shrink-0" />

                  <input
                    id="password"
                    type="password"
                    placeholder={mode === "login" ? "Enter your password" : "Create a password"}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    className={inputBase}
                      style={inputStyle}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {mode === "signup" && (
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className={label}>
                    Confirm Password
                  </label>

                  <div className={fieldShell}>
                    <FaLock className="text-[#9aa8ba] text-base shrink-0" />

                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      className={inputBase}
                      style={inputStyle}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {errorMessage && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="mb-5 rounded-xl border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-4 py-3 text-[13.5px] text-[#b45309]"
                >
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2678ea] to-[#1a5cc2] text-white
                           font-bold text-[15px] tracking-wide shadow-[0_12px_32px_rgba(38,120,234,0.35)]
                           hover:shadow-[0_16px_40px_rgba(38,120,234,0.45)] hover:-translate-y-0.5
                           active:brightness-95 active:translate-y-0 transition-all duration-200
                           disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_12px_32px_rgba(38,120,234,0.35)]
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2678ea]
                           inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Please wait..."
                ) : (
                  <>
                    {mode === "login" ? "Secure Login" : "Create Account"}
                    <FaArrowRight className="text-[13px] transition-transform duration-200 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                className="mt-5 w-full text-[13.5px] font-medium text-[#5c7188] hover:text-[#1a5cc2] transition-colors"
              >
                {mode === "login" ? "Need an account? Sign up" : "Already registered? Log in"}
              </button>

              <div className="mt-9 flex items-center gap-3">
                <span className="h-px flex-1 bg-[#e5edf6]"></span>
                <p className="text-[#a2aebd] text-[11px] tracking-[0.2em] uppercase">
                  Authorized Personnel Only
                </p>
                <span className="h-px flex-1 bg-[#e5edf6]"></span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;