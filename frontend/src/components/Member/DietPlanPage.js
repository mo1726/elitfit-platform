import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyDietPlan } from "../../services/dietService";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const times = ["breakfast", "lunch", "dinner", "snack"];

const DietPlanPage = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [mealMap, setMealMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await getMyDietPlan();
        setPlan(res.data);
        const map = {};
        for (const entry of res.data.entries || []) {
          map[`${entry.day}-${entry.time}`] = entry.meal;
        }
        setMealMap(map);
      } catch (err) {
        toast.error("❌ Failed to load your diet plan.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, []);

  const renderMeal = (day, time) => {
    const key = `${day}-${time}`;
    return mealMap[key] || "—";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white px-4 py-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition ring-1 ring-zinc-700"
        >
          <FaArrowLeft className="text-green-400" />
          <span className="text-white">Back</span>
        </button>

        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-green-400 mb-2 tracking-tight">
            🥗 My Diet Plan
          </h1>
          {loading ? (
            <p className="text-gray-400 text-lg">Loading...</p>
          ) : plan ? (
            <p className="text-gray-400 text-sm">
              <span className="text-yellow-400 font-semibold">{plan.title}</span>{" "}
              <span className="text-gray-500">
                ({plan.startDate} → {plan.endDate})
              </span>
            </p>
          ) : (
            <p className="text-red-500 text-lg">No diet plan found.</p>
          )}
        </div>

        {/* Table */}
        {plan && (
          <div className="rounded-xl overflow-x-auto shadow-xl border border-zinc-800 bg-zinc-900 ring-1 ring-green-500/10">
            <table className="min-w-[600px] w-full text-sm table-auto text-left border-collapse">
              <thead className="bg-zinc-800 text-green-300 uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4 border border-zinc-700">Day</th>
                  {times.map((time) => (
                    <th key={time} className="p-4 border border-zinc-700 capitalize">
                      {time}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day, idx) => (
                  <tr
                    key={day}
                    className={`transition ${idx % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900"} hover:bg-zinc-800/70`}
                  >
                    <td className="p-4 border border-zinc-800 text-yellow-400 font-semibold whitespace-nowrap">
                      {day}
                    </td>
                    {times.map((time) => (
                      <td
                        key={time}
                        className="p-4 border border-zinc-800 text-gray-200 whitespace-pre-wrap"
                      >
                        {renderMeal(day, time)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietPlanPage;
