// import { useEffect, useState } from "react";

// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
// import LoadingSpinner from "../components/LoadingSpinner";
// import API from "../services/api";
// import { getOfficer, getToken } from "../services/authService";

// function AdminTablePage() {
//   const token = getToken();
//   const currentOfficer = getOfficer();
//   const canManageOfficers = Boolean(token && currentOfficer?.role === "admin");

//   const [officers, setOfficers] = useState([]);
//   const [badgeNumber, setBadgeNumber] = useState("");
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [district, setDistrict] = useState("");
//   const [active, setActive] = useState(true);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   useEffect(() => {
//     let isMounted = true;

//     const loadOfficers = async () => {
//       try {
//         setLoading(true);
//         setErrorMessage("");

//         const response = await API.get("/auth/officer", {
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//         });

//         if (isMounted) {
//           setOfficers(Array.isArray(response.data) ? response.data : []);
//         }
//       } catch (error) {
//         if (isMounted) {
//           setErrorMessage(
//             error?.response?.data?.error || error?.response?.data?.message || "Failed to load officer registry records"
//           );
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     loadOfficers();

//     return () => {
//       isMounted = false;
//     };
//   }, [token]);

//   const handleAddOfficer = async (event) => {
//     event.preventDefault();

//     if (!canManageOfficers) {
//       setErrorMessage("You must be logged in as an admin to add officers.");
//       return;
//     }

//     try {
//       setSaving(true);
//       setErrorMessage("");
//       setSuccessMessage("");

//       await API.post(
//         "/auth/officer",
//         {
//           badgeNumber: badgeNumber.trim(),
//           name: name.trim(),
//           phone: phone.trim(),
//           district: district.trim(),
//           active,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const response = await API.get("/auth/officer", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setOfficers(Array.isArray(response.data) ? response.data : []);
//       setBadgeNumber("");
//       setName("");
//       setPhone("");
//       setDistrict("");
//       setActive(true);
//       setSuccessMessage("Officer added successfully.");
//     } catch (error) {
//       setErrorMessage(
//         error?.response?.data?.error || error?.response?.data?.message || "Failed to add officer"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-[#0b1324]">
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

//       <div className="relative z-10 flex">
//         <Sidebar />

//         <div className="ml-64 w-full">
//           <Navbar />

//           <div className="p-8">
//             <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/10 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.65)] p-8">
//               <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/15 to-transparent"></div>
//               <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400"></div>

//               <div className="relative">
//                 <div className="flex items-center justify-between gap-4 mb-8">
//                   <div>
//                     <h1 className="text-3xl font-semibold text-white">
//                       Officer Registry
//                     </h1>
//                     <p className="text-slate-300 mt-2">
//                       Police officer details retrieved from the officer registry table.
//                     </p>
//                   </div>
//                 </div>

//                 <form onSubmit={handleAddOfficer} className="grid gap-4 lg:grid-cols-[1fr_1.2fr_1fr_1fr_auto] mb-8">
//                   <input
//                     type="text"
//                     value={badgeNumber}
//                     onChange={(event) => setBadgeNumber(event.target.value)}
//                     placeholder="Badge number"
//                     className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
//                   />

//                   <input
//                     type="text"
//                     value={name}
//                     onChange={(event) => setName(event.target.value)}
//                     placeholder="Officer name"
//                     className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
//                   />

//                   <input
//                     type="tel"
//                     value={phone}
//                     onChange={(event) => setPhone(event.target.value)}
//                     placeholder="Phone"
//                     className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
//                   />

//                   <input
//                     type="text"
//                     value={district}
//                     onChange={(event) => setDistrict(event.target.value)}
//                     placeholder="District"
//                     className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
//                   />

//                   <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white">
//                     <span className="text-sm font-medium">Active</span>

//                     <input
//                       type="checkbox"
//                       checked={active}
//                       onChange={(event) => setActive(event.target.checked)}
//                       className="h-4 w-4 accent-cyan-400"
//                     />
//                   </label>

//                   <button
//                     type="submit"
//                     disabled={saving || !canManageOfficers}
//                     className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-[0_10px_40px_rgba(59,130,246,0.35)] transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
//                   >
//                     {saving ? "Saving..." : canManageOfficers ? "Add Officer" : "Admin Only"}
//                   </button>
//                 </form>

//                 {successMessage && (
//                   <div className="mb-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-emerald-100">
//                     {successMessage}
//                   </div>
//                 )}

//                 {loading ? (
//                   <LoadingSpinner />
//                 ) : errorMessage ? (
//                   <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-cyan-100">
//                     {errorMessage}
//                   </div>
//                 ) : (
//                   <div className="overflow-x-auto rounded-2xl border border-white/15 bg-white/5">
//                     <table className="w-full text-left">
//                       <thead className="bg-white/10 text-white">
//                         <tr>
//                           <th className="px-5 py-4 font-medium">ID</th>
//                           <th className="px-5 py-4 font-medium">Badge No</th>
//                           <th className="px-5 py-4 font-medium">Name</th>
//                           <th className="px-5 py-4 font-medium">Phone</th>
//                           <th className="px-5 py-4 font-medium">District</th>
//                           <th className="px-5 py-4 font-medium">Active</th>
//                         </tr>
//                       </thead>

//                       <tbody className="text-slate-200">
//                         {officers.length === 0 ? (
//                           <tr>
//                             <td className="px-5 py-6" colSpan="6">
//                               No officer records found.
//                             </td>
//                           </tr>
//                         ) : (
//                           officers.map((officer) => (
//                             <tr key={officer.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
//                               <td className="px-5 py-4">{officer.id}</td>
//                               <td className="px-5 py-4">{officer.badge_number}</td>
//                               <td className="px-5 py-4">{officer.name}</td>
//                               <td className="px-5 py-4">{officer.phone}</td>
//                               <td className="px-5 py-4">{officer.district}</td>
//                               <td className="px-5 py-4">
//                                 <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${officer.active ? "bg-emerald-400/15 text-emerald-300" : "bg-slate-400/15 text-slate-300"}`}>
//                                   {officer.active ? "Yes" : "No"}
//                                 </span>
//                               </td>
//                             </tr>
//                           ))
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminTablePage;



import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import API from "../services/api";
import { getOfficer, getToken } from "../services/authService";

function AdminTablePage() {
  const token = getToken();
  const currentOfficer = getOfficer();
  const canManageOfficers = Boolean(token && currentOfficer?.role === "admin");

  const [officers, setOfficers] = useState([]);
  const [badgeNumber, setBadgeNumber] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadOfficers = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await API.get("/auth/officer", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (isMounted) {
          setOfficers(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error?.response?.data?.error || error?.response?.data?.message || "Failed to load officer registry records"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOfficers();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleAddOfficer = async (event) => {
    event.preventDefault();

    if (!canManageOfficers) {
      setErrorMessage("You must be logged in as an admin to add officers.");
      return;
    }

    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      await API.post(
        "/auth/officer",
        {
          badgeNumber: badgeNumber.trim(),
          name: name.trim(),
          phone: phone.trim(),
          district: district.trim(),
          active,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const response = await API.get("/auth/officer", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOfficers(Array.isArray(response.data) ? response.data : []);
      setBadgeNumber("");
      setName("");
      setPhone("");
      setDistrict("");
      setActive(true);
      setSuccessMessage("Officer added successfully.");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.error || error?.response?.data?.message || "Failed to add officer"
      );
    } finally {
      setSaving(false);
    }
  };

  const fieldClass =
    "rounded-lg border border-[#28394F] bg-[#17253C] px-4 py-3 text-[15px] text-[#F4F6F9] " +
    "placeholder-[#6E7E93] outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/40 transition-colors";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A1420]">
      {/* Faint guilloché-style security texture, consistent across admin pages */}
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
          background: "radial-gradient(ellipse at 50% 0%, rgba(201,162,39,0.06), transparent 55%)",
        }}
      ></div>

      <div className="relative z-10 flex">
        <Sidebar />

        <div className="ml-64 w-full">
          <Navbar />

          <div className="p-8">
            <div className="relative overflow-hidden rounded-2xl border border-[#22314A] bg-[#101C30] shadow-[0_30px_70px_rgba(0,0,0,0.55)] p-8">
              {/* Hairline seal bar */}
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#8A6A17] via-[#C9A227] to-[#8A6A17]"></div>

              <div className="relative">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.28em] text-[#C9A227] uppercase mb-2">
                      Field Personnel
                    </p>
                    <h1 className="font-serif text-[28px] text-[#F4F6F9]">
                      Officer Registry
                    </h1>
                    <p className="text-[14px] text-[#9FB0C3] mt-2">
                      Police officer details retrieved from the officer registry table.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAddOfficer} className="grid gap-4 lg:grid-cols-[1fr_1.2fr_1fr_1fr_auto] mb-8">
                  <input
                    type="text"
                    value={badgeNumber}
                    onChange={(event) => setBadgeNumber(event.target.value)}
                    placeholder="Badge number"
                    className={fieldClass}
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Officer name"
                    className={fieldClass}
                  />

                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Phone"
                    className={fieldClass}
                  />

                  <input
                    type="text"
                    value={district}
                    onChange={(event) => setDistrict(event.target.value)}
                    placeholder="District"
                    className={fieldClass}
                  />

                  <label className="flex items-center justify-between gap-3 rounded-lg border border-[#28394F] bg-[#17253C] px-4 py-3 text-[#F4F6F9]">
                    <span className="text-sm font-medium">Active</span>

                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(event) => setActive(event.target.checked)}
                      className="h-4 w-4 accent-[#C9A227]"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={saving || !canManageOfficers}
                    className="rounded-lg bg-gradient-to-r from-[#C9A227] to-[#E3CE84] px-6 py-3 font-bold text-[#0A1420]
                               shadow-[0_10px_30px_rgba(201,162,39,0.25)] transition-all duration-200
                               hover:brightness-105 active:brightness-95
                               disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100"
                  >
                    {saving ? "Saving..." : canManageOfficers ? "Add Officer" : "Admin Only"}
                  </button>
                </form>

                {successMessage && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="mb-5 rounded-lg border border-[#3FA772]/40 bg-[#3FA772]/10 px-4 py-3 text-[13.5px] text-[#8FD9AF]"
                  >
                    {successMessage}
                  </div>
                )}

                {loading ? (
                  <LoadingSpinner />
                ) : errorMessage ? (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="rounded-lg border border-[#C9A227]/40 bg-[#C9A227]/10 px-4 py-3 text-[13.5px] text-[#EAD48F]"
                  >
                    {errorMessage}
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-[#22314A]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#0D1728]">
                          <th className="px-5 py-4 text-[12.5px] font-semibold tracking-wide text-[#C9A227] uppercase">ID</th>
                          <th className="px-5 py-4 text-[12.5px] font-semibold tracking-wide text-[#C9A227] uppercase">Badge No</th>
                          <th className="px-5 py-4 text-[12.5px] font-semibold tracking-wide text-[#C9A227] uppercase">Name</th>
                          <th className="px-5 py-4 text-[12.5px] font-semibold tracking-wide text-[#C9A227] uppercase">Phone</th>
                          <th className="px-5 py-4 text-[12.5px] font-semibold tracking-wide text-[#C9A227] uppercase">District</th>
                          <th className="px-5 py-4 text-[12.5px] font-semibold tracking-wide text-[#C9A227] uppercase">Active</th>
                        </tr>
                      </thead>

                      <tbody>
                        {officers.length === 0 ? (
                          <tr>
                            <td className="px-5 py-6 text-center text-[#9FB0C3]" colSpan="6">
                              No officer records found.
                            </td>
                          </tr>
                        ) : (
                          officers.map((officer, index) => (
                            <tr
                              key={officer.id}
                              className={`border-t border-[#22314A] ${
                                index % 2 === 1 ? "bg-[#0D1728]/50" : ""
                              } hover:bg-[#17253C] transition-colors`}
                            >
                              <td className="px-5 py-4 text-[14px] text-[#9FB0C3] tabular-nums">{officer.id}</td>
                              <td className="px-5 py-4 text-[14.5px] tabular-nums text-[#C3CEDB]">{officer.badge_number}</td>
                              <td className="px-5 py-4 text-[14.5px] font-medium text-[#F4F6F9]">{officer.name}</td>
                              <td className="px-5 py-4 text-[14.5px] tabular-nums text-[#C3CEDB]">{officer.phone}</td>
                              <td className="px-5 py-4 text-[14.5px] text-[#C3CEDB]">{officer.district}</td>
                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                    officer.active
                                      ? "bg-[#3FA772]/15 text-[#8FD9AF]"
                                      : "bg-[#6E7E93]/15 text-[#9FB0C3]"
                                  }`}
                                >
                                  {officer.active ? "Yes" : "No"}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminTablePage;

