import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DistrictStatsPage() {

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b1324]">
      {/* Animated Background Glow */}
      <div className="absolute top-[-150px] left-[-150px] w-[420px] h-[420px] bg-cyan-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[420px] h-[420px] bg-blue-500/25 rounded-full blur-3xl animate-pulse"></div>

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
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/15 to-transparent"></div>
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400"></div>
              <h1 className="relative text-3xl font-semibold text-white mb-8">District Statistics</h1>

              <table className="relative w-full border border-white/15 rounded-2xl overflow-hidden">
                <thead className="bg-white/10 text-white">
                  <tr>
                    <th className="p-4 text-left">District</th>
                    <th className="p-4 text-left">Total Collection</th>
                  </tr>
                </thead>

                <tbody className="text-slate-200">
                  <tr className="border-b border-white/10">
                    <td className="p-4">Colombo</td>
                    <td className="p-4">Rs. 150000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DistrictStatsPage;