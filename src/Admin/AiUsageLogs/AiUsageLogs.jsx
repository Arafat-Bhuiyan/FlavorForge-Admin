import { useEffect, useState } from "react";
import CustomDropdown from "../CustomDropdown";
import authApiInstance from "../../utils/privateApiInstance"; // API utility

export default function AiUsageLogs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);

  // Fetch AI usage logs data from the API
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await authApiInstance.get("/ai-model-logs/");
        if (res.status === 200) {
          setLogs(res.data); // Set logs from API response
          setFilteredLogs(res.data); // Set filtered logs initially as all logs
        }
      } catch (error) {
        console.error("Error fetching AI logs:", error);
      }
    };

    fetchLogs();
  }, []);

  // Filter logs based on ingredient
  const handleIngredientFilter = (ingredient) => {
    if (ingredient === "Filter by Ingredient") {
      setFilteredLogs(logs); // Show all logs if no filter
    } else {
      const filtered = logs.filter((log) =>
        log.ingredients.includes(ingredient)
      );
      setFilteredLogs(filtered);
    }
  };

  // Filter logs based on user email
  const handleUserFilter = (email) => {
    if (email === "Filter by User") {
      setFilteredLogs(logs); // Show all logs if no filter
    } else {
      const filtered = logs.filter((log) => log.email === email);
      setFilteredLogs(filtered);
    }
  };

  return (
    <div className="pt-5 flex flex-col gap-9">
      <div className="flex gap-4 w-full">
        {/* Ingredient Dropdown */}
        <CustomDropdown
          options={[
            "Chicken",
            "Fish",
            "Rice",
            "Egg",
            "Garlic",
            "Cheese",
            "Spinach",
            "Mushroom",
          ]}
          defaultLabel="Filter by Ingredient"
          onSelect={handleIngredientFilter}
        />

        {/* User Dropdown */}
        <CustomDropdown
          options={["Filter by User", ...new Set(logs.map((log) => log.email))]}
          defaultLabel="Filter by User"
          onSelect={handleUserFilter}
        />
      </div>

      <div className="w-full px-4 bg-white">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2 font-medium text-gray-800">Date</th>
              <th className="px-4 py-2 font-medium text-gray-800">
                User Email
              </th>
              <th className="px-6 py-2 font-medium text-gray-800">
                Ingredients
              </th>
              <th className="px-4 py-2 text-center font-medium text-gray-800">
                Recipe Generated
              </th>
              <th className="px-4 py-2 text-center font-medium text-gray-800">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr key={index} className="bg-[#E4572E]/5 shadow-sm rounded-lg">
                <td className="px-4 py-3">
                  {new Date(log.created_on).toLocaleDateString()}{" "}
                  {new Date(log.created_on).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3">{log.email || "N/A"}</td>
                <td className="px-4 py-3">
                  {log.ingredient_items.join(", ") || "N/A"}
                </td>
                <td className="px-4 py-3 text-center">{log.title || "N/A"}</td>
                <td className="px-4 py-3 text-center">{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
