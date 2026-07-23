// function StatCard({ title, value, color }) {

//   return (
//     <div
//       className="rounded-2xl border border-white/12 bg-gradient-to-br from-white/14 via-white/8 to-white/6 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.32)] hover:shadow-[0_16px_44px_rgba(0,0,0,0.4)] transition-all duration-300 p-6 border-l-6"
//       style={{
//         borderColor: color,
//         boxShadow: "0 14px 34px rgba(34,211,238,0.25)",
//       }}
//     >

//       <p className="text-slate-200 text-base">
//         {title}
//       </p>

//       <h2 className="text-3xl font-semibold mt-3 text-white">
//         {value}
//       </h2>

//     </div>
//   );
// }

// export default StatCard;



function StatCard({ title, value, color }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#22314A] bg-[#101C30] shadow-[0_12px_30px_rgba(0,0,0,0.35)] hover:border-[#2E4362] transition-colors duration-200 p-6">
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ backgroundColor: color }}
      ></div>

      <p className="text-[13.5px] font-semibold tracking-wide text-[#9FB0C3] uppercase">
        {title}
      </p>

      <h2 className="text-[28px] font-bold mt-3 text-[#F4F6F9]" style={{ color }}>
        {value}
      </h2>
    </div>
  );
}

export default StatCard;
