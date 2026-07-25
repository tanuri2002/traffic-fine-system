import { useEffect, useState } from "react";
import { FaUserShield } from "react-icons/fa";

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
    "rounded-lg border border-[rgba(16,40,64,0.08)] bg-white px-4 py-3 text-[15px] text-[#0f2940] " +
    "placeholder-[#8b99a9] outline-none transition-all duration-150 " +
    "focus:border-[#2678ea] focus:ring-2 focus:ring-[#2678ea]/15 focus:shadow-[0_4px_14px_rgba(38,120,234,0.1)]";

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
                    <FaUserShield />
                  </div>
                  <div>
                    <p className="inline-flex rounded-full bg-[#2678ea]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#1a5cc2] uppercase mb-1.5">
                      Field Personnel
                    </p>
                    <h1 className="text-[28px] font-extrabold bg-gradient-to-r from-[#12324d] to-[#1a5cc2] bg-clip-text text-transparent leading-tight">
                      Officer Registry
                    </h1>
                    <p className="text-[14px] text-[#5c7188] mt-1">
                      Police officer details retrieved from the officer registry table.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleAddOfficer}
                  className="grid gap-4 lg:grid-cols-[1fr_1.2fr_1fr_1fr_auto] mb-8 rounded-xl border border-[#e5edf6] bg-[#f8fbff] p-5"
                >
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

                  <label className="flex items-center justify-between gap-3 rounded-lg border border-[rgba(16,40,64,0.08)] bg-white px-4 py-3 text-[#0f2940]">
                    <span className="text-sm font-medium">Active</span>

                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(event) => setActive(event.target.checked)}
                      className="h-4 w-4 accent-[#2678ea]"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={saving || !canManageOfficers}
                    className="rounded-lg bg-gradient-to-r from-[#2678ea] to-[#1a5cc2] px-6 py-3 font-bold text-white
                               shadow-[0_10px_30px_rgba(38,120,234,0.28)] transition-all duration-200
                               hover:brightness-105 hover:-translate-y-0.5 active:brightness-95 active:translate-y-0
                               disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:brightness-100"
                  >
                    {saving ? "Saving..." : canManageOfficers ? "Add Officer" : "Admin Only"}
                  </button>
                </form>

                {successMessage && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="mb-5 rounded-lg border border-[#34c759]/40 bg-[#34c759]/10 px-4 py-3 text-[13.5px] text-[#1ea346]"
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
                    className="rounded-lg border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-4 py-3 text-[13.5px] text-[#b45309]"
                  >
                    {errorMessage}
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-[#e5edf6] shadow-[0_8px_24px_rgba(15,41,64,0.06)]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-[#2678ea]/8 to-[#5fb6ff]/8">
                          <th className="px-5 py-4 text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase">ID</th>
                          <th className="px-5 py-4 text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase">Badge No</th>
                          <th className="px-5 py-4 text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase">Name</th>
                          <th className="px-5 py-4 text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase">Phone</th>
                          <th className="px-5 py-4 text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase">District</th>
                          <th className="px-5 py-4 text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase">Active</th>
                        </tr>
                      </thead>

                      <tbody>
                        {officers.length === 0 ? (
                          <tr>
                            <td className="px-5 py-6 text-center text-[#5c7188]" colSpan="6">
                              No officer records found.
                            </td>
                          </tr>
                        ) : (
                          officers.map((officer, index) => (
                            <tr
                              key={officer.id}
                              className={`border-t border-[#e5edf6] ${
                                index % 2 === 1 ? "bg-[#f8fbff]/70" : ""
                              } transition-all duration-150 hover:bg-[#f0f7ff] hover:shadow-[inset_3px_0_0_#2678ea]`}
                            >
                              <td className="px-5 py-4 text-[14px] text-[#5c7188] tabular-nums">{officer.id}</td>
                              <td className="px-5 py-4 text-[14.5px] tabular-nums font-semibold text-[#1a5cc2]">{officer.badge_number}</td>
                              <td className="px-5 py-4 text-[14.5px] font-medium text-[#12324d]">{officer.name}</td>
                              <td className="px-5 py-4 text-[14.5px] tabular-nums text-[#5c7188]">{officer.phone}</td>
                              <td className="px-5 py-4 text-[14.5px] text-[#5c7188]">{officer.district}</td>
                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                    officer.active
                                      ? "bg-[#34c759]/12 text-[#1ea346]"
                                      : "bg-[#94a3b8]/12 text-[#64748b]"
                                  }`}
                                >
                                  <span className={`h-1.5 w-1.5 rounded-full ${officer.active ? "bg-[#1ea346]" : "bg-[#64748b]"}`}></span>
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