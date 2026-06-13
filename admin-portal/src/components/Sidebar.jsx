import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaList,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar() {

  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      name: "District Stats",
      path: "/district-stats",
      icon: <FaChartBar />,
    },
    {
      name: "Categories",
      path: "/category-breakdown",
      icon: <FaList />,
    },
  ];

  return (
    <div className="w-64 h-screen bg-[#0b111e]/95 text-white fixed shadow-2xl border-r border-white/10 backdrop-blur-xl">

      <div className="p-6 border-b border-white/10">

        <h1 className="text-2xl font-semibold">
          Traffic Admin
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Sri Lanka Police
        </p>

      </div>

      <div className="p-4 flex flex-col gap-2">

        {menuItems.map((item) => (

          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-4 rounded-xl border border-transparent transition-all duration-200
            ${
              location.pathname === item.path
                ? "bg-gradient-to-r from-blue-300/70 to-blue-400/70 shadow-[0_12px_32px_rgba(147,197,253,0.35)] border-white/20"
                : "hover:bg-white/8 hover:border-white/10"
            }`}
          >
            {item.icon}
            {item.name}
          </Link>

        ))}

      </div>

      <div className="absolute bottom-5 w-full px-4">

        <button
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-300 to-blue-400 hover:from-blue-200 hover:to-blue-300 p-3 rounded-xl shadow-[0_12px_32px_rgba(147,197,253,0.35)]"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </div>
  );
}

export default Sidebar;