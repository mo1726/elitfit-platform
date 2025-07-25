import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPlanById,
  updateDietEntry,
} from "../../services/dietService";
import { toast, ToastContainer } from "react-toastify";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const meals = ["breakfast", "lunch", "dinner", "snack"];

const EditDietPlanPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [editedMeals, setEditedMeals] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const res = await getPlanById(planId);
        const mealMap = {};
        for (const entry of res.data.entries || []) {
          mealMap[`${entry.day}-${entry.time}`] = {
            meal: entry.meal,
            entryId: entry.id,
          };
        }
        setPlan(res.data);
        setEditedMeals(mealMap);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load plan data");
        console.error(err);
      }
    };
    loadPlan();
  }, [planId]);

  const handleChange = (day, time, value) => {
    setEditedMeals((prev) => ({
      ...prev,
      [`${day}-${time}`]: {
        ...prev[`${day}-${time}`],
        meal: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      for (const key in editedMeals) {
        const { entryId, meal } = editedMeals[key];
        await updateDietEntry(entryId, { meal });
      }
      toast.success("✅ Plan updated successfully");
    } catch (err) {
      toast.error("❌ Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleGoBack = () => navigate(-2);

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-gray-950 via-black to-zinc-900 text-white font-sans">
      <ToastContainer position="bottom-right" theme="dark" />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-green-400 mb-2">Edit Diet Plan</h1>
        <p className="text-sm text-gray-400 mb-6">
          Plan ID: <span className="text-yellow-400">#{plan?.id}</span>
        </p>

        {loading ? (
          <p className="text-gray-500 text-lg">Loading diet plan...</p>
        ) : (
          <div className="bg-zinc-950/80 border border-zinc-800 backdrop-blur-md rounded-xl shadow-xl p-6">
            <div className="overflow-x-auto rounded-md">
              <table className="w-full text-sm bg-transparent border-collapse">
                <thead className="text-green-300 bg-zinc-800 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-3 text-left">Day</th>
                    {meals.map((meal) => (
                      <th key={meal} className="p-3 text-left capitalize">{meal}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {daysOfWeek.map((day, idx) => (
                    <tr
                      key={day}
                      className={`border-t border-zinc-800 ${idx % 2 === 0 ? "bg-zinc-900" : "bg-zinc-800"}`}
                    >
                      <td className="p-3 font-semibold text-yellow-300">{day}</td>
                      {meals.map((mealType) => {
                        const key = `${day}-${mealType}`;
                        return (
                          <td key={mealType} className="p-2">
                            <input
                              type="text"
                              value={editedMeals[key]?.meal ?? ""}
                              onChange={(e) => handleChange(day, mealType, e.target.value)}
                              placeholder="Enter meal..."
                              className="w-full px-3 py-2 rounded-md bg-zinc-700 hover:bg-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-start">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-2 ${
                  saving ? "bg-green-700 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                } text-white font-semibold rounded-md transition`}
              >
                <FaSave /> {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 px-6 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-md transition"
              >
                <FaArrowLeft /> Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditDietPlanPage;
