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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b1324]">
      {/* Animated Background Glow */}
      <div className="absolute -top-37.5 -left-37.5 w-105 h-105 bg-cyan-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-37.5 -right-37.5 w-105 h-105 bg-blue-500/25 rounded-full blur-3xl animate-pulse"></div>

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="relative z-10 flex">
        <Sidebar />

        <div className="ml-64 w-full">
          <Navbar />

          <div className="p-8">
            <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/10 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.65)] p-8">
              <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-white/15 to-transparent"></div>
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-cyan-400 via-blue-500 to-cyan-400"></div>
              <h1 className="relative text-3xl font-semibold text-white mb-8">District Statistics</h1>

              {loading ? (
                <LoadingSpinner />
              ) : errorMessage ? (
                <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-cyan-100">
                  {errorMessage}
                </div>
              ) : (
                <table className="relative w-full border border-white/15 rounded-2xl overflow-hidden">
                  <thead className="bg-white/10 text-white">
                    <tr>
                      <th className="p-4 text-left">District</th>
                      <th className="p-4 text-left">Total Cases</th>
                      <th className="p-4 text-left">Pending Cases</th>
                      <th className="p-4 text-left">Total Collection</th>
                    </tr>
                  </thead>

                  <tbody className="text-slate-200">
                    {districts.length === 0 ? (
                      <tr className="border-b border-white/10">
                        <td className="p-4" colSpan="4">
                          No district statistics found.
                        </td>
                      </tr>
                    ) : (
                      districts.map((district) => (
                        <tr key={district.district} className="border-b border-white/10">
                          <td className="p-4">{district.district}</td>
                          <td className="p-4">{Number(district.totalCases || 0).toLocaleString("en-LK")}</td>
                          <td className="p-4">{Number(district.pendingCases || 0).toLocaleString("en-LK")}</td>
                          <td className="p-4">{formatCurrency(district.totalCollection)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DistrictStatsPage;