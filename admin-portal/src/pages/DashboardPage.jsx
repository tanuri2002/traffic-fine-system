import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import RecentPaymentsTable from "../components/RecentPaymentsTable";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchDashboardOverview } from "../services/api";

function DashboardPage() {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    paidFines: 0,
    pendingCases: 0,
  });
  const [revenueByDistrict, setRevenueByDistrict] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetchDashboardOverview();
        const data = response?.data || {};

        if (isMounted) {
          setSummary({
            totalRevenue: Number(data.totalRevenue || 0),
            paidFines: Number(data.paidFines || 0),
            pendingCases: Number(data.pendingCases || 0),
          });
          setRevenueByDistrict(Array.isArray(data.revenueByDistrict) ? data.revenueByDistrict : []);
          setRecentPayments(Array.isArray(data.recentPayments) ? data.recentPayments : []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error?.response?.data?.error || error?.response?.data?.message || "Failed to load dashboard overview"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

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

              <div className="relative">
                <div className="flex items-end justify-between gap-4 mb-8">
                  <div>
                    <h1 className="text-3xl font-semibold text-white">
                      Dashboard Overview
                    </h1>
                    <p className="mt-2 text-slate-300">
                      Live totals from fines, categories, officers, and payments.
                    </p>
                  </div>
                </div>

                {loading ? (
                  <LoadingSpinner />
                ) : errorMessage ? (
                  <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-cyan-100">
                    {errorMessage}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <StatCard title="Total Revenue" value={formatCurrency(summary.totalRevenue)} color="#93c5fd" />
                      <StatCard title="Paid Fines" value={summary.paidFines.toLocaleString("en-LK")} color="#93c5fd" />
                      <StatCard title="Pending Cases" value={summary.pendingCases.toLocaleString("en-LK")} color="#93c5fd" />
                    </div>

                    <RevenueChart data={revenueByDistrict} />
                    <RecentPaymentsTable payments={recentPayments} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;