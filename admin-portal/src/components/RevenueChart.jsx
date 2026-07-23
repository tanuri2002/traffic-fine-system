// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// function RevenueChart({ data = [] }) {

//   return (
//     <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/8 backdrop-blur-md shadow-[0_14px_40px_rgba(0,0,0,0.32)] p-6 mt-8">
//       <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-blue-200/80 via-blue-300/80 to-blue-200/80"></div>

//       <h2 className="text-2xl font-semibold mb-6 text-white">
//         District Revenue
//       </h2>

//       {data.length === 0 ? (
//         <div className="flex h-[300px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300">
//           No revenue data available yet.
//         </div>
//       ) : (
//         <ResponsiveContainer width="100%" height={300}>

//           <BarChart data={data}>
//             <XAxis dataKey="district" stroke="#cbd5f5" />
//             <YAxis stroke="#cbd5f5" />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "#0c1424",
//                 border: "1px solid rgba(255,255,255,0.16)",
//                 borderRadius: "10px",
//               }}
//               cursor={{ fill: "transparent" }}
//             />
//             <Bar dataKey="revenue" fill="#93c5fd" radius={[6, 6, 0, 0]} />
//           </BarChart>

//         </ResponsiveContainer>
//       )}

//     </div>
//   );
// }

// export default RevenueChart;



import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function RevenueChart({ data = [] }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#22314A] bg-[#101C30] shadow-[0_14px_40px_rgba(0,0,0,0.35)] p-6 mt-8">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#8A6A17] via-[#C9A227] to-[#8A6A17]"></div>

      <h2 className="font-serif text-[20px] mb-6 text-[#F4F6F9]">
        District Revenue
      </h2>

      {data.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center rounded-lg border border-[#22314A] bg-[#0D1728] text-[#9FB0C3] text-[14px]">
          No revenue data available yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="district" stroke="#9FB0C3" tick={{ fontSize: 12.5 }} />
            <YAxis stroke="#9FB0C3" tick={{ fontSize: 12.5 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0D1728",
                border: "1px solid #22314A",
                borderRadius: "8px",
                color: "#F4F6F9",
              }}
              labelStyle={{ color: "#C9A227", fontWeight: 600 }}
              cursor={{ fill: "rgba(201,162,39,0.06)" }}
            />
            <Bar dataKey="revenue" fill="#C9A227" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default RevenueChart;
