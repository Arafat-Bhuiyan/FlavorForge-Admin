import userRedIcon from "../../assets/images/user-red-icon.png";
import RevenueChart from "./RevenueChart";
import RecentUsers from "./RecentUsers";
import authApiInstance from "../../utils/privateApiInstance";
import { useEffect, useState } from "react";

export const StartCards = () => {
  const [dashboardData, setDashboardData] = useState({
    total_user: 0,
    active_subscription: 0,
    ai_usages: 0,
    chart: [],
  });

  // Fetch data from API on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await authApiInstance.get("/api/dashboard/");
        if (res.status === 200) {
          setDashboardData(res.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);
  return (
    <div className="col-span-8">
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Users */}
        <div className="flex items-center  gap-5 py-6 px-10 bg-[#FFFDFD] border border-[#E4572E] rounded-xl shadow-lg">
          <img src={userRedIcon} className="w-16 h-16" alt="" />
          <div className="flex flex-col gap-3">
            <p className="text-[#2E2E2E] font-semibold text-5xl">
              {dashboardData.total_user}
            </p>
            <p className="text-[#2E2E2E] font-normal text-xl">Total Users</p>
          </div>
        </div>
        {/* Active Subscription */}
        <div className="flex items-center  gap-5 py-6 px-10 bg-[#FFFDFD] border border-[#E4572E] rounded-xl shadow-lg">
          <img src={userRedIcon} className="w-16 h-16" alt="" />
          <div className="flex flex-col gap-3">
            <p className="text-[#2E2E2E] font-semibold text-5xl">
              {dashboardData.active_subscription}
            </p>
            <p className="text-[#2E2E2E] font-normal text-xl">
              Active Subscription
            </p>
          </div>
        </div>
        {/* Users */}
        <div className="flex items-center  gap-5 py-6 px-10 bg-[#FFFDFD] border border-[#E4572E] rounded-xl shadow-lg">
          <img src={userRedIcon} className="w-16 h-16" alt="" />
          <div className="flex flex-col gap-3">
            <p className="text-[#2E2E2E] font-semibold text-5xl">
              {dashboardData.ai_usages}
            </p>
            <p className="text-[#2E2E2E] font-normal text-xl">
              AI Requests Today
            </p>
          </div>
        </div>
      </div>

      {/* Chart, Table, Ingredients */}
      <div className="grid grid-cols-1 gap-6">
        {/* Chart */}
        <RevenueChart />

        {/* Table, Ingredients  */}
        <div className="w-full">
          <RecentUsers />
          {/* <div className="w-2/3">
            
          </div>
          <div className="w-1/3">
            <TopIngredients />
          </div> */}
        </div>
      </div>
    </div>
  );
};
