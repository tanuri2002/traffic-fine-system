import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function RevenueChart() {

  const data = [
    { district: "Colombo", revenue: 4000 },
    { district: "Kandy", revenue: 2400 },
    { district: "Galle", revenue: 3200 },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/8 backdrop-blur-md shadow-[0_14px_40px_rgba(0,0,0,0.32)] p-6 mt-8">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-200/80 via-blue-300/80 to-blue-200/80"></div>

      <h2 className="text-2xl font-semibold mb-6 text-white">
        District Revenue
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <BarChart data={data}>
          <XAxis dataKey="district" stroke="#cbd5f5" />
          <YAxis stroke="#cbd5f5" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0c1424",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: "10px",
            }}
            cursor={{ fill: "transparent" }}
          />
          <Bar dataKey="revenue" fill="#93c5fd" radius={[6, 6, 0, 0]} />
        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default RevenueChart;