import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomDropdown from "../CustomDropdown";
import authApiInstance from "../../utils/privateApiInstance";

const RevenueChart = () => {
  const timeOptions = ["2025", "2024", "2023"];
  const [selectedYear, setSelectedYear] = useState("2025");
  const [chartData, setChartData] = useState([]); // State to store chart data

  // Fetch data from API on mount
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await authApiInstance.get("/api/dashboard/");
        if (res.status === 200) {
          // Format the data as needed
          setChartData(res.data.chart);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, []);

  // Use the fetched data for the selected year
  const data = chartData[selectedYear] || [];

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-2xl text-[#2e2e2e]">
          Revenue{" "}
          <span className="text-xs">
            <span className="text-[#2D9CDB]">Current Year</span> /
            <span className="text-[#E4572E]">Previous Year</span> Revenue
          </span>
        </h2>
        <div className="flex items-center space-x-2 w-40">
          <CustomDropdown
            options={timeOptions}
            defaultLabel={selectedYear}
            onSelect={(value) => setSelectedYear(value)}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" className="text-[#2e2e2e] font-semibold" />
          <YAxis
            ticks={[100, 200, 300, 400]}
            domain={[100, 400]}
            tickFormatter={(value) => `$${value}`}
            className="text-[#2e2e2e] font-semibold"
          />

          <Tooltip formatter={(value) => `$${value}`} />

          {/* Current Year (Blue) */}
          <Line
            type="monotone"
            dataKey="current"
            stroke="#2E7CF6"
            strokeWidth={2}
            dot={{ r: 4 }}
          />

          {/* Previous Year (Red) */}
          <Line
            type="monotone"
            dataKey="previous"
            stroke="#E4572E"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
