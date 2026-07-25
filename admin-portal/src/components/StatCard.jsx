function StatCard({ title, value, color }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#e5edf6] bg-white shadow-[0_12px_30px_rgba(15,41,64,0.08)] hover:shadow-[0_16px_38px_rgba(15,41,64,0.14)] hover:-translate-y-0.5 transition-all duration-200 p-6">
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ backgroundColor: color }}
      ></div>

      <p className="text-[13.5px] font-semibold tracking-wide text-[#5c7188] uppercase">
        {title}
      </p>

      <h2 className="text-[28px] font-bold mt-3" style={{ color }}>
        {value}
      </h2>
    </div>
  );
}

export default StatCard;
