// ✅ DietPlanListPage.js (View Diet Plan)
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEntriesByPlanId } from "../../services/dietService";
import RoleNavbar from "../Layout/RoleNavbar";
import { toast } from "react-toastify";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const times = ["Breakfast", "Lunch", "Dinner", "Snack"];

const DietPlanListPage = () => {
  const { planId } = useParams();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!planId) return;
    const fetch = async () => {
      try {
        const res = await getEntriesByPlanId(planId);
        setEntries(res.data || []);
      } catch (err) {
        toast.error("Failed to load diet plan");
      }
    };
    fetch();
  }, [planId]);

  const getMeal = (day, time) =>
    entries.find((e) => e.day === day && e.time.toLowerCase() === time.toLowerCase())?.meal || "-";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <RoleNavbar />
      <div className="max-w-5xl mx-auto p-6 mt-8 bg-zinc-900 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-blue-400 mb-2">View Diet Plan</h2>
        <p className="text-sm text-gray-400 mb-4">Plan ID: <span className="text-white font-semibold">#{planId}</span></p>

        <div className="overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-zinc-800 text-blue-300">
                <th className="p-2 text-left">Day</th>
                {times.map((t) => (
                  <th key={t} className="p-2 text-left">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {daysOfWeek.map((day) => (
                <tr key={day} className="border-b border-zinc-700">
                  <td className="p-2 font-semibold text-yellow-400">{day}</td>
                  {times.map((time) => (
                    <td key={time} className="p-2 text-gray-200">{getMeal(day, time)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DietPlanListPage;
