import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import authApiInstance from "../../utils/privateApiInstance";

export default function PlanManagement() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [statusMap, setStatusMap] = useState({});

  // ---------- 1️⃣ FETCH SUBSCRIPTION LIST ----------
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const res = await authApiInstance.get("/subscription/list/");
        if (res.status === 200) {
          const formatted = res.data.data.map((item) => ({
            id: item.id,
            package_id: item.package_id,
            amount: parseFloat(item.initial_price),
            discount: parseFloat(item.discount),
            type: item.timing,
            status: item.is_active ? "Active" : "Postpone",
          }));
          setPackages(formatted);
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const editIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
    >
      <g
        fill="none"
        stroke="#2e2e2e"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <path strokeDasharray={20} strokeDashoffset={20} d="M3 21h18">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.2s"
            values="20;0"
          />
        </path>
        <path
          strokeDasharray={48}
          strokeDashoffset={48}
          d="M7 17v-4l10 -10l4 4l-10 10h-4"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.2s"
            dur="0.6s"
            values="48;0"
          />
        </path>
        <path strokeDasharray={8} strokeDashoffset={8} d="M14 6l4 4">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.8s"
            dur="0.2s"
            values="8;0"
          />
        </path>
      </g>
    </svg>
  );

  const startEdit = (packageId, field, currentValue) => {
    setEditingField(`${packageId}-${field}`);
    setTempValue(currentValue.toString());
  };

  // ---------- 2️⃣ PATCH API CALL FOR UPDATE ----------
  const saveEdit = async (packageId, field) => {
    const updatedPkg = packages.find((p) => p.id === packageId);
    console.log("Updated Id:", updatedPkg);
    if (!updatedPkg) return;

    const updatedData = {
      initial_price:
        field === "amount" ? parseFloat(tempValue) : updatedPkg.amount,
      discount:
        field === "discount" ? parseFloat(tempValue) : updatedPkg.discount,
      is_active: (statusMap[packageId] || updatedPkg.status) === "Active",
    };

    try {
      const res = await authApiInstance.patch(
        `/admin/user/subscription/${packageId}/update-status/`,
        updatedData
      );
      if (res.status === 200) {
        // Local state update
        setPackages((prev) =>
          prev.map((pkg) =>
            pkg.id === packageId
              ? {
                  ...pkg,
                  amount: updatedData.initial_price,
                  discount: updatedData.discount,
                }
              : pkg
          )
        );
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
    }

    setEditingField(null);
    setTempValue("");
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValue("");
  };

  // Handle dropdown selection
  const handleSelect = async (userId, option) => {
    setStatusMap((prevStatus) => ({
      ...prevStatus,
      [userId]: option,
    }));

    const selectedPkg = packages.find((p) => p.id === userId);
    if (!selectedPkg) return;

    try {
      await authApiInstance.patch(
        `/admin/user/subscription/${userId}/update-status/`,
        {
          initial_price: selectedPkg.amount,
          discount: selectedPkg.discount,
          is_active: option === "Active",
        }
      );

      setPackages((prev) =>
        prev.map((pkg) =>
          pkg.id === userId ? { ...pkg, status: option } : pkg
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const CustomDropdown = ({ options, defaultLabel, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(defaultLabel);

    const handleOptionClick = (option) => {
      setSelected(option);
      onSelect(option);
      setIsOpen(false);
    };

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium ${
            selected === "Active"
              ? "bg-[#4CAF50] text-white"
              : "bg-[#E4572E] text-white"
          }`}
        >
          {selected}
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className="block w-full px-3 py-2 text-xs text-left hover:bg-gray-50"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen">
      {/* Table Header */}
      <div className="grid grid-cols-5 gap-4 px-6 py-4 text-sm font-medium text-[#636363]">
        <div className="text-left">Package ID</div>
        <div className="text-center">Package Amount</div>
        <div className="text-center">Discount</div>
        <div className="text-center">Type</div>
        <div className="text-center">Status</div>
      </div>

      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className="grid grid-cols-5 gap-4 px-6 py-4 items-center border-b border-[#DFDFDF]"
        >
          <div className="font-semibold text-base text-left">
            {pkg.package_id}
          </div>

          {/* Amount */}
          <div className="flex items-center gap-2 justify-center">
            {pkg.package_id === "free" ? ( // "free" package হলে এডিট অপশন disable
              <div className="flex items-center gap-2">
                <span className="font-semibold">${pkg.amount}</span>
              </div>
            ) : editingField === `${pkg.id}-amount` ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-20 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={() => saveEdit(pkg.id, "amount")}
                  className="p-1 text-green-600"
                >
                  <Check size={14} />
                </button>
                <button onClick={cancelEdit} className="p-1 text-red-600">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-semibold">${pkg.amount}</span>
                <button
                  onClick={() => startEdit(pkg.id, "amount", pkg.amount)}
                  className="p-1"
                >
                  {editIcon()}
                </button>
              </div>
            )}
          </div>

          {/* Discount */}
          <div className="flex items-center gap-2 justify-center">
            {pkg.package_id === "free" ? ( // "free" package হলে এডিট অপশন disable
              <div className="flex items-center gap-2">
                <span className="font-semibold">{pkg.discount}%</span>
              </div>
            ) : editingField === `${pkg.id}-discount` ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-16 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <span className="text-sm">%</span>
                <button
                  onClick={() => saveEdit(pkg.id, "discount")}
                  className="p-1 text-green-600"
                >
                  <Check size={14} />
                </button>
                <button onClick={cancelEdit} className="p-1 text-red-600">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-semibold">{pkg.discount}%</span>
                <button
                  onClick={() => startEdit(pkg.id, "discount", pkg.discount)}
                  className="p-1"
                >
                  {editIcon()}
                </button>
              </div>
            )}
          </div>

          <div className="font-medium text-base text-[#E4572E] text-center">
            {pkg.type}
          </div>

          {/* Status */}
          <div className="flex justify-center">
            <CustomDropdown
              options={["Active", "Postpone"]}
              defaultLabel={statusMap[pkg.id] || pkg.status}
              onSelect={(option) => handleSelect(pkg.id, option)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
