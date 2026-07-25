import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaList,
  FaTable,
  FaSignOutAlt,
} from "react-icons/fa";

import { clearToken } from "../services/authService";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

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
    {
      name: "Officer Registry",
      path: "/admin-table",
      icon: <FaTable />,
    },
  ];

  const handleLogout = () => {
    clearToken();
    navigate("/");
  };

  return (
    <div className="w-64 h-screen fixed text-white bg-gradient-to-b from-[#0a2a5e] via-[#0b3a7a] to-[#082e6b] shadow-[6px_0_30px_rgba(8,30,72,0.25)]">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#2678ea] to-[#5fb6ff] flex items-center justify-center shrink-0 shadow-[0_8px_18px_rgba(38,120,234,0.35)]">
            <span className="text-white text-sm font-bold">TA</span>
          </div>

          <div>
            <h1 className="text-[19px] font-bold leading-tight text-white">
              Traffic Admin
            </h1>
            <p className="text-[11.5px] text-[#a9c3ef]">Sri Lanka Police</p>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[14.5px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-[#2678ea] to-[#1a5cc2] text-white shadow-[0_8px_20px_rgba(38,120,234,0.35)]"
                  : "text-[#a9c3ef] hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={isActive ? "text-white" : "text-[#a9c3ef]"}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="absolute bottom-5 w-full px-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 border border-[#ef4444]/40 text-[#fca5a5]
                     hover:bg-[#ef4444]/10 hover:border-[#ef4444] p-3 rounded-lg text-[14.5px] font-medium transition-colors duration-200"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
