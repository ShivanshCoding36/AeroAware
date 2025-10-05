import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function ForecastChart({ data }) {
  const chartData = [
    { name: "Current", pm25: data.ground.pm25 },
    { name: "Next Hour", pm25: data.forecast.predicted_pm25_next_hour },
  ];

  return (
    <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-3xl border border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-300">PM2.5 Trend</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Line type="monotone" dataKey="pm25" stroke="#38bdf8" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
