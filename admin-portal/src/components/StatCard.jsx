function StatCard({ title, value, color }) {

  return (
    <div
      className="rounded-2xl border border-white/12 bg-gradient-to-br from-white/14 via-white/8 to-white/6 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.32)] hover:shadow-[0_16px_44px_rgba(0,0,0,0.4)] transition-all duration-300 p-6 border-l-6"
      style={{
        borderColor: color,
        boxShadow: "0 14px 34px rgba(34,211,238,0.25)",
      }}
    >

      <p className="text-slate-200 text-base">
        {title}
      </p>

      <h2 className="text-3xl font-semibold mt-3 text-white">
        {value}
      </h2>

    </div>
  );
}

export default StatCard;