import { useEffect, useState } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";

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
    <div className="relative min-h-screen overflow-hidden bg-[#eef4fb]">
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

      <div className="relative z-10 flex">
        <Sidebar />

        <div className="ml-64 w-full">
          <Navbar />

          <div className="p-8">
            <div className="relative overflow-hidden rounded-2xl border border-[#e5edf6] bg-white shadow-[0_20px_50px_rgba(15,41,64,0.12)] p-8">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2678ea] via-[#5fb6ff] to-[#2678ea]"></div>

              <div className="relative flex items-center gap-4 mb-8">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2678ea] to-[#1a5cc2] text-white text-2xl shadow-[0_12px_26px_rgba(38,120,234,0.32)]">
                  <FaMapMarkedAlt />
                </div>
                <div>
                  <p className="inline-flex rounded-full bg-[#2678ea]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#1a5cc2] uppercase mb-1.5">
                    Regional Overview
                  </p>
                  <h1 className="text-[28px] font-extrabold bg-gradient-to-r from-[#12324d] to-[#1a5cc2] bg-clip-text text-transparent leading-tight">
                    District Statistics
                  </h1>
                </div>
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : errorMessage ? (
                <div
                  role="alert"
                  aria-live="polite"
                  className="rounded-lg border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-4 py-3 text-[13.5px] text-[#b45309]"
                >
                  {errorMessage}
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-xl border border-[#e5edf6] shadow-[0_8px_24px_rgba(15,41,64,0.06)]">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#2678ea]/8 to-[#5fb6ff]/8">
                        <th className="p-4 text-left text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase">
                          District
                        </th>
                        <th className="p-4 text-right text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase">
                          Total Cases
                        </th>
                        <th className="p-4 text-right text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase">
                          Pending Cases
                        </th>
                        <th className="p-4 text-right text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase">
                          Total Collection
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {districts.length === 0 ? (
                        <tr>
                          <td className="p-6 text-center text-[#5c7188]" colSpan="4">
                            No district statistics found.
                          </td>
                        </tr>
                      ) : (
                        districts.map((district, index) => (
                          <tr
                            key={district.district}
                            className={`border-t border-[#e5edf6] ${
                              index % 2 === 1 ? "bg-[#f8fbff]/70" : ""
                            } transition-all duration-150 hover:bg-[#f0f7ff] hover:shadow-[inset_3px_0_0_#2678ea]`}
                          >
                            <td className="p-4 text-[14.5px] font-medium text-[#12324d]">
                              {district.district}
                            </td>
                            <td className="p-4 text-[14.5px] text-right tabular-nums text-[#5c7188]">
                              {formatNumber(district.totalCases)}
                            </td>
                            <td className="p-4 text-[14.5px] text-right tabular-nums text-[#5c7188]">
                              {formatNumber(district.pendingCases)}
                            </td>
                            <td className="p-4 text-[14.5px] text-right tabular-nums font-bold text-[#1a5cc2]">
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
//   const formatNumber = (value) => Number(value || 0).toLocaleString("en-LK");

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-[#0A1420]">
//       {/* Faint guilloché-style security texture, consistent with the admin auth screen */}
//       <div
//         className="pointer-events-none absolute inset-0 opacity-[0.05]"
//         style={{
//           backgroundImage:
//             "repeating-linear-gradient(115deg, #C9A227 0px, #C9A227 1px, transparent 1px, transparent 14px)",
//         }}
//       ></div>

//       <div
//         className="pointer-events-none absolute inset-0"
//         style={{
//           background: "radial-gradient(ellipse at 50% 0%, rgba(201,162,39,0.06), transparent 55%)",
//         }}
//       ></div>

//       <div className="relative z-10 flex">
//         <Sidebar />

//         <div className="ml-64 w-full">
//           <Navbar />

//           <div className="p-8">
//             <div className="relative overflow-hidden rounded-2xl border border-[#22314A] bg-[#101C30] shadow-[0_30px_70px_rgba(0,0,0,0.55)] p-8">
//               {/* Hairline seal bar */}
//               <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#8A6A17] via-[#C9A227] to-[#8A6A17]"></div>

//               <p className="relative text-[11px] font-semibold tracking-[0.28em] text-[#C9A227] uppercase mb-2">
//                 Regional Overview
//               </p>

//               <h1 className="relative font-serif text-[28px] text-[#F4F6F9] mb-8">
//                 District Statistics
//               </h1>

//               {loading ? (
//                 <LoadingSpinner />
//               ) : errorMessage ? (
//                 <div
//                   role="alert"
//                   aria-live="polite"
//                   className="rounded-lg border border-[#C9A227]/40 bg-[#C9A227]/10 px-4 py-3 text-[13.5px] text-[#EAD48F]"
//                 >
//                   {errorMessage}
//                 </div>
//               ) : (
//                 <div className="relative overflow-hidden rounded-lg border border-[#22314A]">
//                   <table className="w-full border-collapse">
//                     <thead>
//                       <tr className="bg-[#0D1728]">
//                         <th className="p-4 text-left text-[12.5px] font-semibold tracking-wide text-[#C9A227] uppercase">
//                           District
//                         </th>
//                         <th className="p-4 text-right text-[12.5px] font-semibold tracking-wide text-[#C9A227] uppercase">
//                           Total Cases
//                         </th>
//                         <th className="p-4 text-right text-[12.5px] font-semibold tracking-wide text-[#C9A227] uppercase">
//                           Pending Cases
//                         </th>
//                         <th className="p-4 text-right text-[12.5px] font-semibold tracking-wide text-[#C9A227] uppercase">
//                           Total Collection
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {districts.length === 0 ? (
//                         <tr>
//                           <td className="p-6 text-center text-[#9FB0C3]" colSpan="4">
//                             No district statistics found.
//                           </td>
//                         </tr>
//                       ) : (
//                         districts.map((district, index) => (
//                           <tr
//                             key={district.district}
//                             className={`border-t border-[#22314A] ${
//                               index % 2 === 1 ? "bg-[#0D1728]/50" : ""
//                             } hover:bg-[#17253C] transition-colors`}
//                           >
//                             <td className="p-4 text-[14.5px] font-medium text-[#F4F6F9]">
//                               {district.district}
//                             </td>
//                             <td className="p-4 text-[14.5px] text-right tabular-nums text-[#C3CEDB]">
//                               {formatNumber(district.totalCases)}
//                             </td>
//                             <td className="p-4 text-[14.5px] text-right tabular-nums text-[#C3CEDB]">
//                               {formatNumber(district.pendingCases)}
//                             </td>
//                             <td className="p-4 text-[14.5px] text-right tabular-nums font-semibold text-[#E3CE84]">
//                               {formatCurrency(district.totalCollection)}
//                             </td>
//                           </tr>
//                         ))
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DistrictStatsPage;
