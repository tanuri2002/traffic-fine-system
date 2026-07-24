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
    <div className="w-64 h-screen bg-[#0A1420] text-[#F4F6F9] fixed border-r border-[#22314A]">
      <div className="p-6 border-b border-[#22314A]">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full border-2 border-[#C9A227] flex items-center justify-center shrink-0">
            <span className="text-[#E3CE84] text-sm font-bold">TA</span>
          </div>

          <div>
            <h1 className="font-serif text-[19px] leading-tight text-[#F4F6F9]">
              Traffic Admin
            </h1>
            <p className="text-[11.5px] text-[#9FB0C3]">Sri Lanka Police</p>
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
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[14.5px] font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-[#C9A227] text-[#0A1420]"
                  : "text-[#9FB0C3] hover:bg-[#101C30] hover:text-[#F4F6F9]"
              }`}
            >
              <span className={isActive ? "text-[#0A1420]" : "text-[#7C8CA0]"}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="absolute bottom-5 w-full px-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 border border-[#B4543A]/50 text-[#D98567]
                     hover:bg-[#B4543A]/10 hover:border-[#B4543A] p-3 rounded-lg text-[14.5px] font-medium transition-colors duration-200"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
