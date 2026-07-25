// import { useEffect, useState } from "react";

// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
// import LoadingSpinner from "../components/LoadingSpinner";
// import { fetchDistrictStatistics } from "../services/api";

// function DistrictStatsPage() {
//   const [districts, setDistricts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     let isMounted = true;

//     const loadDistrictStats = async () => {
//       try {
//         setLoading(true);
//         setErrorMessage("");

//         const response = await fetchDistrictStatistics();

//         if (isMounted) {
//           setDistricts(Array.isArray(response?.data) ? response.data : []);
//         }
//       } catch (error) {
//         if (isMounted) {
//           setErrorMessage(
//             error?.response?.data?.error || error?.response?.data?.message || "Failed to load district statistics"
//           );
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     loadDistrictStats();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString("en-LK")}`;

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-[#0b1324]">
//       {/* Animated Background Glow */}
//       <div className="absolute -top-37.5 -left-37.5 w-105 h-105 bg-cyan-400/30 rounded-full blur-3xl animate-pulse"></div>
//       <div className="absolute -bottom-37.5 -right-37.5 w-105 h-105 bg-blue-500/25 rounded-full blur-3xl animate-pulse"></div>

//       {/* Grid Overlay */}
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
//               <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-white/15 to-transparent"></div>
//               <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-cyan-400 via-blue-500 to-cyan-400"></div>
//               <h1 className="relative text-3xl font-semibold text-white mb-8">District Statistics</h1>

//               {loading ? (
//                 <LoadingSpinner />
//               ) : errorMessage ? (
//                 <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-cyan-100">
//                   {errorMessage}
//                 </div>
//               ) : (
//                 <table className="relative w-full border border-white/15 rounded-2xl overflow-hidden">
//                   <thead className="bg-white/10 text-white">
//                     <tr>
//                       <th className="p-4 text-left">District</th>
//                       <th className="p-4 text-left">Total Cases</th>
//                       <th className="p-4 text-left">Pending Cases</th>
//                       <th className="p-4 text-left">Total Collection</th>
//                     </tr>
//                   </thead>

//                   <tbody className="text-slate-200">
//                     {districts.length === 0 ? (
//                       <tr className="border-b border-white/10">
//                         <td className="p-4" colSpan="4">
//                           No district statistics found.
//                         </td>
//                       </tr>
//                     ) : (
//                       districts.map((district) => (
//                         <tr key={district.district} className="border-b border-white/10">
//                           <td className="p-4">{district.district}</td>
//                           <td className="p-4">{Number(district.totalCases || 0).toLocaleString("en-LK")}</td>
//                           <td className="p-4">{Number(district.pendingCases || 0).toLocaleString("en-LK")}</td>
//                           <td className="p-4">{formatCurrency(district.totalCollection)}</td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DistrictStatsPage;



import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchDistrictStatistics } from "../services/api";

function DistrictStatsPage() {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDistrictStats = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetchDistrictStatistics();

        if (isMounted) {
          setDistricts(Array.isArray(response?.data) ? response.data : []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error?.response?.data?.error || error?.response?.data?.message || "Failed to load district statistics"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDistrictStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString("en-LK")}`;
  const formatNumber = (value) => Number(value || 0).toLocaleString("en-LK");

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A1420]">
      {/* Faint guilloché-style security texture, consistent with the admin auth screen */}
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

              <p className="relative text-[11px] font-semibold tracking-[0.28em] text-[#C9A227] uppercase mb-2">
                Regional Overview
              </p>

              <h1 className="relative font-serif text-[28px] text-[#F4F6F9] mb-8">
                District Statistics
              </h1>

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
                <div className="relative overflow-hidden rounded-lg border border-[#22314A]">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#0D1728]">
                        <th className="p-4 text-left text-[12.5px] font-semibold tracking-wide text-[#C9A227] uppercase">
                          District
                        </th>
                        <th className="p-4 text-right text-[12.5px] font-semibold tracking-wide text-[#C9A227] uppercase">
                          Total Cases
                        </th>
                        <th className="p-4 text-right text-[12.5px] font-semibold tracking-wide text-[#C9A227] uppercase">
                          Pending Cases
                        </th>
                        <th className="p-4 text-right text-[12.5px] font-semibold tracking-wide text-[#C9A227] uppercase">
                          Total Collection
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {districts.length === 0 ? (
                        <tr>
                          <td className="p-6 text-center text-[#9FB0C3]" colSpan="4">
                            No district statistics found.
                          </td>
                        </tr>
                      ) : (
                        districts.map((district, index) => (
                          <tr
                            key={district.district}
                            className={`border-t border-[#22314A] ${
                              index % 2 === 1 ? "bg-[#0D1728]/50" : ""
                            } hover:bg-[#17253C] transition-colors`}
                          >
                            <td className="p-4 text-[14.5px] font-medium text-[#F4F6F9]">
                              {district.district}
                            </td>
                            <td className="p-4 text-[14.5px] text-right tabular-nums text-[#C3CEDB]">
                              {formatNumber(district.totalCases)}
                            </td>
                            <td className="p-4 text-[14.5px] text-right tabular-nums text-[#C3CEDB]">
                              {formatNumber(district.pendingCases)}
                            </td>
                            <td className="p-4 text-[14.5px] text-right tabular-nums font-semibold text-[#E3CE84]">
                              {formatCurrency(district.totalCollection)}
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
  );
}

export default DistrictStatsPage;
