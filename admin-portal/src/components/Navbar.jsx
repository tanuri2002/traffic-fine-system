import { FaBell, FaUserCircle } from "react-icons/fa";

function Navbar() {
  return (
    <div className="relative bg-white border-b border-[#e5edf6] px-8 py-4 flex justify-between items-center shadow-[0_4px_16px_rgba(15,41,64,0.04)]">
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#2678ea] via-[#5fb6ff] to-[#2678ea]"></div>

      <div>
        <h1 className="text-[22px] font-extrabold bg-gradient-to-r from-[#12324d] to-[#1a5cc2] bg-clip-text text-transparent">
          Traffic Fine Monitoring System
        </h1>

        <p className="text-[13px] text-[#5c7188]">
          National Traffic Fine Administration
        </p>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative" aria-label="Notifications">
          <FaBell className="text-2xl text-[#2678ea]" />

          <span className="absolute -top-1 -right-1 bg-gradient-to-br from-[#2678ea] to-[#1a5cc2] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-[0_4px_10px_rgba(38,120,234,0.4)]">
            3
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2678ea] to-[#1a5cc2] text-white shadow-[0_8px_18px_rgba(38,120,234,0.28)]">
            <FaUserCircle className="text-2xl" />
          </div>

          <div>
            <p className="font-semibold text-[14.5px] text-[#12324d]">
              Admin User
            </p>

            <p className="text-[12.5px] text-[#5c7188]">
              Senior Officer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
