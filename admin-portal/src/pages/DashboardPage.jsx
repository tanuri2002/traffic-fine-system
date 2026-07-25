import { useEffect, useState } from "react";
import { FaChartLine } from "react-icons/fa";

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

              <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2678ea] to-[#1a5cc2] text-white text-2xl shadow-[0_12px_26px_rgba(38,120,234,0.32)]">
                    <FaChartLine />
                  </div>
                  <div>
                    <p className="inline-flex rounded-full bg-[#2678ea]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#1a5cc2] uppercase mb-1.5">
                      Command Summary
                    </p>
                    <h1 className="text-[28px] font-extrabold bg-gradient-to-r from-[#12324d] to-[#1a5cc2] bg-clip-text text-transparent leading-tight">
                      Dashboard Overview
                    </h1>
                    <p className="mt-1 text-[14px] text-[#5c7188]">
                      Live totals from fines, categories, officers, and payments.
                    </p>
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
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <StatCard title="Total Revenue" value={formatCurrency(summary.totalRevenue)} color="#2678ea" />
                      <StatCard title="Paid Fines" value={summary.paidFines.toLocaleString("en-LK")} color="#34c759" />
                      <StatCard title="Pending Cases" value={summary.pendingCases.toLocaleString("en-LK")} color="#f59e0b" />
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

