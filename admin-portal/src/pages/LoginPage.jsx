// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { login, signup } from "../services/authService";

// import { FaUserShield, FaIdBadge, FaLock, FaUser, FaEnvelope } from "react-icons/fa";

// function LoginPage() {
//   const [mode, setMode] = useState("login");
//   const [fullName, setFullName] = useState("");
//   const [officialEmail, setOfficialEmail] = useState("");
//   const [badgeNumber, setBadgeNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     setLoading(true);
//     setErrorMessage("");

//     const response = await login(badgeNumber, password);

//     setLoading(false);

//     if (response.success) {
//       navigate("/dashboard");
//     } else {
//       setErrorMessage(response.message || "Invalid credentials");
//     }
//   };

//   const handleSignup = async () => {
//     if (password !== confirmPassword) {
//       setErrorMessage("Passwords do not match");
//       return;
//     }

//     setLoading(true);
//     setErrorMessage("");

//     const response = await signup({
//       fullName,
//       officialEmail,
//       badgeNumber,
//       password,
//     });

//     setLoading(false);

//     if (response.success) {
//       setMode("login");
//       setPassword("");
//       setConfirmPassword("");
//       setErrorMessage("Account created. You can log in now.");
//     } else {
//       setErrorMessage(response.message || "Signup failed");
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (mode === "login") {
//       await handleLogin();
//       return;
//     }

//     await handleSignup();
//   };

//   const resetForm = () => {
//     setFullName("");
//     setOfficialEmail("");
//     setBadgeNumber("");
//     setPassword("");
//     setConfirmPassword("");
//     setErrorMessage("");
//   };

//   const switchMode = (nextMode) => {
//     setMode(nextMode);
//     resetForm();
//     setErrorMessage("");
//   };

//   const inputBase = "w-full bg-transparent p-4 outline-none text-white placeholder-slate-500";
//   const fieldShell = "mt-3 flex items-center gap-3 bg-white/5 border border-white/15 rounded-2xl px-5 hover:border-cyan-400 focus-within:border-cyan-400 transition-all duration-300";

//   return (
//     <div className="relative min-h-screen py-10 overflow-hidden bg-[#0b1324] flex justify-center items-center">
//       <div className="absolute top-[-150px] left-[-150px] w-[420px] h-[420px] bg-cyan-400/30 rounded-full blur-3xl animate-pulse"></div>

//       <div className="absolute bottom-[-150px] right-[-150px] w-[420px] h-[420px] bg-blue-500/25 rounded-full blur-3xl animate-pulse"></div>

//       <div
//         className="absolute inset-0 opacity-15"
//         style={{
//           backgroundImage:
//             "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
//           backgroundSize: "40px 40px",
//         }}
//       ></div>

//       <div className="relative z-10 group w-[min(92vw,520px)]">
//         <div className="absolute -inset-1 bg-linear-to-r from-cyan-400 to-blue-600 rounded-[36px] blur opacity-35 group-hover:opacity-70 transition duration-1000"></div>

//         <div className="relative rounded-[36px] overflow-hidden border border-white/10 bg-white/10 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.65)]">
//           <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-white/15 to-transparent"></div>

//           <div className="h-1 w-full bg-linear-to-r from-cyan-400 via-blue-500 to-cyan-400"></div>

//           <form className="px-8 py-10 sm:px-12 sm:py-12" onSubmit={handleSubmit}>
//             <div className="flex flex-col items-center mb-8">
//               <div className="relative">
//                 <div className="absolute inset-0 rounded-full bg-cyan-400 blur-2xl opacity-40 animate-pulse"></div>

//                 <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-cyan-400 to-blue-600 flex justify-center items-center shadow-[0_0_40px_rgba(59,130,246,0.8)]">
//                   <FaUserShield className="text-white text-5xl" />
//                 </div>
//               </div>

//               <h1 className="text-5xl font-black text-white mt-8 tracking-tight">
//                 Admin Portal
//               </h1>

//               <p className="text-slate-400 mt-3 text-center leading-relaxed">
//                 Sri Lanka Traffic Fine Management System
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-3 p-1 mb-6 rounded-2xl bg-white/5 border border-white/10">
//               <button
//                 type="button"
//                 onClick={() => switchMode("login")}
//                 className={`rounded-xl py-3 text-sm font-semibold transition-all ${mode === "login" ? "bg-cyan-500 text-white shadow-lg" : "text-slate-300 hover:text-white"}`}
//               >
//                 Login
//               </button>

//               <button
//                 type="button"
//                 onClick={() => switchMode("signup")}
//                 className={`rounded-xl py-3 text-sm font-semibold transition-all ${mode === "signup" ? "bg-cyan-500 text-white shadow-lg" : "text-slate-300 hover:text-white"}`}
//               >
//                 Signup
//               </button>
//             </div>

//             {mode === "signup" && (
//               <div className="mb-5">
//                 <label className="text-slate-300 text-sm font-medium">Full Name</label>

//                 <div className={fieldShell}>
//                   <FaUser className="text-slate-400 text-lg shrink-0" />

//                   <input
//                     type="text"
//                     placeholder="Enter full name"
//                     autoComplete="name"
//                     className={inputBase}
//                     value={fullName}
//                     onChange={(e) => setFullName(e.target.value)}
//                   />
//                 </div>
//               </div>
//             )}

//             {mode === "signup" && (
//               <div className="mb-5">
//                 <label className="text-slate-300 text-sm font-medium">Official Email</label>

//                 <div className={fieldShell}>
//                   <FaEnvelope className="text-slate-400 text-lg shrink-0" />

//                   <input
//                     type="email"
//                     placeholder="Enter official email"
//                     autoComplete="email"
//                     className={inputBase}
//                     value={officialEmail}
//                     onChange={(e) => setOfficialEmail(e.target.value)}
//                   />
//                 </div>
//               </div>
//             )}

//             <div className="mb-5">
//               <label className="text-slate-300 text-sm font-medium">
//                 {mode === "login" ? "Badge Number" : "Badge Number"}
//               </label>

//               <div className={fieldShell}>
//                 <FaIdBadge className="text-slate-400 text-lg shrink-0" />

//                 <input
//                   type="text"
//                   placeholder={mode === "login" ? "Enter badge number" : "Enter badge number"}
//                   autoComplete="off"
//                   className={inputBase}
//                   value={badgeNumber}
//                   onChange={(e) => setBadgeNumber(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="mb-5">
//               <label className="text-slate-300 text-sm font-medium">
//                 Password
//               </label>

//               <div className={fieldShell}>
//                 <FaLock className="text-slate-400 text-lg" />

//                 <input
//                   type="password"
//                   placeholder={mode === "login" ? "Enter your password" : "Create a password"}
//                   autoComplete={mode === "login" ? "current-password" : "new-password"}
//                   className={inputBase}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </div>
//             </div>

//             {mode === "signup" && (
//               <div className="mb-6">
//                 <label className="text-slate-300 text-sm font-medium">Confirm Password</label>

//                 <div className={fieldShell}>
//                   <FaLock className="text-slate-400 text-lg" />

//                   <input
//                     type="password"
//                     placeholder="Confirm your password"
//                     autoComplete="new-password"
//                     className={inputBase}
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                   />
//                 </div>
//               </div>
//             )}

//             {errorMessage && (
//               <div className="mb-5 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
//                 {errorMessage}
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="relative overflow-hidden w-full py-4 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-[0_10px_50px_rgba(59,130,246,0.6)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100"
//             >
//               <span className="relative z-10">{loading ? "Please wait..." : mode === "login" ? "Secure Login" : "Create Account"}</span>

//               <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
//             </button>

//             <button
//               type="button"
//               onClick={() => switchMode(mode === "login" ? "signup" : "login")}
//               className="mt-5 w-full text-sm font-medium text-slate-300 hover:text-white transition-colors"
//             >
//               {mode === "login" ? "Need an account? Sign up" : "Already registered? Log in"}
//             </button>

//             <div className="mt-10 text-center">
//               <p className="text-slate-500 text-sm">Authorized access only</p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../services/authService";

import { FaUserShield, FaIdBadge, FaLock, FaUser, FaEnvelope } from "react-icons/fa";

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
  // Navy + gold "official seal" system: solid panels (no heavy glass/blur),
  // high-contrast paper-white body text, gold reserved for accents only.
  const inputBase =
    "w-full bg-transparent py-3.5 outline-none text-[#F4F6F9] placeholder-[#6E7E93] text-[15px]";
  const fieldShell =
    "mt-2 flex items-center gap-3 bg-[#17253C] border border-[#28394F] rounded-lg px-4 " +
    "focus-within:border-[#C9A227] focus-within:ring-1 focus-within:ring-[#C9A227]/40 transition-colors duration-200";
  const label = "text-[#C3CEDB] text-[13px] font-semibold tracking-wide";

  return (
    <div className="relative min-h-screen py-12 bg-[#0A1420] flex justify-center items-center px-4">
      {/* Faint guilloché-style security texture, not a glow effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #C9A227 0px, #C9A227 1px, transparent 1px, transparent 14px)",
        }}
      ></div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(201,162,39,0.08), transparent 55%)",
        }}
      ></div>

      <div className="relative z-10 w-[min(94vw,480px)]">
        <div className="relative rounded-2xl overflow-hidden border border-[#22314A] bg-[#101C30] shadow-[0_30px_70px_rgba(0,0,0,0.55)]">
          {/* Hairline seal bar */}
          <div className="h-[3px] w-full bg-gradient-to-r from-[#8A6A17] via-[#C9A227] to-[#8A6A17]"></div>

          <form className="px-8 py-10 sm:px-10" onSubmit={handleSubmit} noValidate>
            {/* Emblem */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-20 h-20 rounded-full border-2 border-[#C9A227] flex justify-center items-center">
                <div className="absolute inset-1 rounded-full border border-[#C9A227]/40"></div>
                <FaUserShield className="text-[#E3CE84] text-3xl" />
              </div>

              <p className="mt-5 text-[11px] font-semibold tracking-[0.28em] text-[#C9A227] uppercase">
                Official Use Only
              </p>

              <h1 className="font-serif text-[32px] leading-tight text-[#F4F6F9] mt-2 text-center">
                Admin Portal
              </h1>

              <p className="text-[#9FB0C3] mt-2 text-[14px] text-center leading-relaxed max-w-[320px]">
                Sri Lanka Traffic Fine Management System
              </p>
            </div>

            {/* Mode switch */}
            <div
              role="tablist"
              aria-label="Choose login or signup"
              className="grid grid-cols-2 gap-1 p-1 mb-7 rounded-lg bg-[#0D1728] border border-[#22314A]"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                onClick={() => switchMode("login")}
                className={`rounded-md py-2.5 text-[14px] font-semibold transition-colors ${
                  mode === "login"
                    ? "bg-[#C9A227] text-[#0A1420]"
                    : "text-[#9FB0C3] hover:text-[#F4F6F9]"
                }`}
              >
                Login
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={mode === "signup"}
                onClick={() => switchMode("signup")}
                className={`rounded-md py-2.5 text-[14px] font-semibold transition-colors ${
                  mode === "signup"
                    ? "bg-[#C9A227] text-[#0A1420]"
                    : "text-[#9FB0C3] hover:text-[#F4F6F9]"
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
                  <FaUser className="text-[#7C8CA0] text-base shrink-0" />

                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter full name"
                    autoComplete="name"
                    className={inputBase}
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
                  <FaEnvelope className="text-[#7C8CA0] text-base shrink-0" />

                  <input
                    id="officialEmail"
                    type="email"
                    placeholder="Enter official email"
                    autoComplete="email"
                    className={inputBase}
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
                <FaIdBadge className="text-[#7C8CA0] text-base shrink-0" />

                <input
                  id="badgeNumber"
                  type="text"
                  placeholder="Enter badge number"
                  autoComplete="off"
                  className={inputBase}
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
                <FaLock className="text-[#7C8CA0] text-base shrink-0" />

                <input
                  id="password"
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
                <label htmlFor="confirmPassword" className={label}>
                  Confirm Password
                </label>

                <div className={fieldShell}>
                  <FaLock className="text-[#7C8CA0] text-base shrink-0" />

                  <input
                    id="confirmPassword"
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
              <div
                role="alert"
                aria-live="polite"
                className="mb-5 rounded-lg border border-[#C9A227]/40 bg-[#C9A227]/10 px-4 py-3 text-[13.5px] text-[#EAD48F]"
              >
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-[#C9A227] to-[#E3CE84] text-[#0A1420]
                         font-bold text-[15px] tracking-wide shadow-[0_10px_30px_rgba(201,162,39,0.25)]
                         hover:brightness-105 active:brightness-95 transition-all duration-200
                         disabled:opacity-60 disabled:cursor-not-allowed
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A227]"
            >
              {loading ? "Please wait..." : mode === "login" ? "Secure Login" : "Create Account"}
            </button>

            <button
              type="button"
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              className="mt-5 w-full text-[13.5px] font-medium text-[#9FB0C3] hover:text-[#F4F6F9] transition-colors"
            >
              {mode === "login" ? "Need an account? Sign up" : "Already registered? Log in"}
            </button>

            <div className="mt-9 flex items-center gap-3">
              <span className="h-px flex-1 bg-[#22314A]"></span>
              <p className="text-[#5E6E82] text-[11px] tracking-[0.2em] uppercase">
                Authorized Personnel Only
              </p>
              <span className="h-px flex-1 bg-[#22314A]"></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
