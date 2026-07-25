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
    <div className="relative overflow-hidden rounded-xl border border-[#e5edf6] bg-white shadow-[0_14px_40px_rgba(15,41,64,0.08)] p-6 mt-8">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#2678ea] via-[#5fb6ff] to-[#2678ea]"></div>

      <h2 className="text-[20px] font-bold mb-6 text-[#12324d]">
        District Revenue
      </h2>

      {data.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center rounded-lg border border-[#e5edf6] bg-[#f8fbff] text-[#5c7188] text-[14px]">
          No revenue data available yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <defs>
              <linearGradient id="revenueBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5fb6ff" />
                <stop offset="100%" stopColor="#2678ea" />
              </linearGradient>
            </defs>
            <XAxis dataKey="district" stroke="#5c7188" tick={{ fontSize: 12.5 }} />
            <YAxis stroke="#5c7188" tick={{ fontSize: 12.5 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5edf6",
                borderRadius: "8px",
                color: "#12324d",
                boxShadow: "0 8px 24px rgba(15,41,64,0.12)",
              }}
              labelStyle={{ color: "#1a5cc2", fontWeight: 600 }}
              cursor={{ fill: "rgba(38,120,234,0.06)" }}
            />
            <Bar dataKey="revenue" fill="url(#revenueBarGradient)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default RevenueChart;