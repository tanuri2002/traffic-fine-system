import { FaBell, FaUserCircle } from "react-icons/fa";

function Navbar() {

  return (
    <div className="relative border-b border-white/10 bg-white/8 backdrop-blur-xl px-8 py-4 flex justify-between items-center">
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-200/80 via-blue-300/80 to-blue-200/80"></div>

      <div>
        <h1 className="text-2xl font-semibold text-white">
          Traffic Fine Monitoring System
        </h1>

        <p className="text-sm text-slate-300">
          National Traffic Fine Administration
        </p>
      </div>

      <div className="flex items-center gap-6">

        <button className="relative">

          <FaBell className="text-2xl text-cyan-200" />

          <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(34,211,238,0.6)]">
            3
          </span>

        </button>

        <div className="flex items-center gap-2">

          <FaUserCircle className="text-3xl text-cyan-200" />

          <div>
            <p className="font-semibold text-white">
              Admin User
            </p>

            <p className="text-sm text-slate-300">
              Senior Officer
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Navbar;