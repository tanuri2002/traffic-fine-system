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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b1324]">
      <div className="absolute top-[-150px] left-[-150px] w-[420px] h-[420px] bg-cyan-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[420px] h-[420px] bg-blue-500/25 rounded-full blur-3xl animate-pulse"></div>

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
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/15 to-transparent"></div>
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400"></div>

              <div className="relative">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div>
                    <h1 className="text-3xl font-semibold text-white">
                      Officer Registry
                    </h1>
                    <p className="text-slate-300 mt-2">
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
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Officer name"
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                  />

                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Phone"
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                  />

                  <input
                    type="text"
                    value={district}
                    onChange={(event) => setDistrict(event.target.value)}
                    placeholder="District"
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                  />

                  <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white">
                    <span className="text-sm font-medium">Active</span>

                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(event) => setActive(event.target.checked)}
                      className="h-4 w-4 accent-cyan-400"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={saving || !canManageOfficers}
                    className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-[0_10px_40px_rgba(59,130,246,0.35)] transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {saving ? "Saving..." : canManageOfficers ? "Add Officer" : "Admin Only"}
                  </button>
                </form>

                {successMessage && (
                  <div className="mb-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-emerald-100">
                    {successMessage}
                  </div>
                )}

                {loading ? (
                  <LoadingSpinner />
                ) : errorMessage ? (
                  <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-cyan-100">
                    {errorMessage}
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-white/15 bg-white/5">
                    <table className="w-full text-left">
                      <thead className="bg-white/10 text-white">
                        <tr>
                          <th className="px-5 py-4 font-medium">ID</th>
                          <th className="px-5 py-4 font-medium">Badge No</th>
                          <th className="px-5 py-4 font-medium">Name</th>
                          <th className="px-5 py-4 font-medium">Phone</th>
                          <th className="px-5 py-4 font-medium">District</th>
                          <th className="px-5 py-4 font-medium">Active</th>
                        </tr>
                      </thead>

                      <tbody className="text-slate-200">
                        {officers.length === 0 ? (
                          <tr>
                            <td className="px-5 py-6" colSpan="6">
                              No officer records found.
                            </td>
                          </tr>
                        ) : (
                          officers.map((officer) => (
                            <tr key={officer.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                              <td className="px-5 py-4">{officer.id}</td>
                              <td className="px-5 py-4">{officer.badge_number}</td>
                              <td className="px-5 py-4">{officer.name}</td>
                              <td className="px-5 py-4">{officer.phone}</td>
                              <td className="px-5 py-4">{officer.district}</td>
                              <td className="px-5 py-4">
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${officer.active ? "bg-emerald-400/15 text-emerald-300" : "bg-slate-400/15 text-slate-300"}`}>
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