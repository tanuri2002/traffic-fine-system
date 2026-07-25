import { useEffect, useState } from "react";
import { FaClipboardList } from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchCategoryBreakdown } from "../services/api";

function CategoryBreakdownPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetchCategoryBreakdown();

        if (isMounted) {
          setCategories(Array.isArray(response?.data) ? response.data : []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error?.response?.data?.error || error?.response?.data?.message || "Failed to load category breakdown"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCategories();

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
                  <FaClipboardList />
                </div>
                <div>
                  <p className="inline-flex rounded-full bg-[#2678ea]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#1a5cc2] uppercase mb-1.5">
                    Offense Registry
                  </p>
                  <h1 className="text-[28px] font-extrabold bg-gradient-to-r from-[#12324d] to-[#1a5cc2] bg-clip-text text-transparent leading-tight">
                    Category Breakdown
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
                <div className="relative overflow-x-auto rounded-xl border border-[#e5edf6] shadow-[0_8px_24px_rgba(15,41,64,0.06)]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#2678ea]/8 to-[#5fb6ff]/8">
                        <th className="p-4 text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase">Code</th>
                        <th className="p-4 text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase">Category</th>
                        <th className="p-4 text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase text-right">Fine Amount</th>
                        <th className="p-4 text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase text-right">Cases</th>
                        <th className="p-4 text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase text-right">Paid Cases</th>
                        <th className="p-4 text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase text-right">Collection</th>
                        <th className="p-4 text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase">Description</th>
                      </tr>
                    </thead>

                    <tbody>
                      {categories.length === 0 ? (
                        <tr>
                          <td className="p-6 text-center text-[#5c7188]" colSpan="7">
                            No category records found.
                          </td>
                        </tr>
                      ) : (
                        categories.map((item, index) => (
                          <tr
                            key={item.id}
                            className={`border-t border-[#e5edf6] ${
                              index % 2 === 1 ? "bg-[#f8fbff]/70" : ""
                            } transition-all duration-150 hover:bg-[#f0f7ff] hover:shadow-[inset_3px_0_0_#2678ea]`}
                          >
                            <td className="p-4 text-[14px] text-[#5c7188] tabular-nums">{item.code}</td>
                            <td className="p-4 text-[14.5px] font-medium text-[#12324d]">{item.title}</td>
                            <td className="p-4 text-[14.5px] text-right tabular-nums text-[#5c7188]">
                              {formatCurrency(item.amountLkr)}
                            </td>
                            <td className="p-4 text-[14.5px] text-right tabular-nums text-[#5c7188]">
                              {formatNumber(item.totalCases)}
                            </td>
                            <td className="p-4 text-[14.5px] text-right tabular-nums text-[#5c7188]">
                              {formatNumber(item.paidCases)}
                            </td>
                            <td className="p-4 text-[14.5px] text-right tabular-nums font-bold text-[#1a5cc2]">
                              {formatCurrency(item.totalCollection)}
                            </td>
                            <td className="p-4 text-[13.5px] text-[#5c7188] max-w-[240px]">
                              {item.description || "-"}
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

export default CategoryBreakdownPage;
