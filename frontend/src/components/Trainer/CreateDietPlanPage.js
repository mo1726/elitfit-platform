// ✅ CreateDietPlanPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTrainerMembers,
  createDietPlan,
  createEntry,
  getPlanByMemberId,
} from "../../services/dietService";
import { toast } from "react-toastify";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const meals = ["breakfast", "lunch", "dinner", "snack"];

const CreateDietPlanPage = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [entries, setEntries] = useState({});

  useEffect(() => {
    const fetchMember = async () => {
      if (!memberId || isNaN(parseInt(memberId))) {
        return;
      }

      try {
        const res = await getTrainerMembers();
        const found = res.data.find((m) => m.id === parseInt(memberId));
        if (!found) return toast.error("Member not found.");
        setMember(found);

        const planRes = await getPlanByMemberId(memberId);
        if (planRes.data && planRes.data.id) {
          navigate(`/edit-diet/${planRes.data.id}`);
        }
      } catch (err) {
        toast.error("Error loading member or plan");
      }
    };

    fetchMember();
  }, [memberId, navigate]);

  const handleEntryChange = (day, mealType, value) => {
    setEntries((prev) => ({ ...prev, [`${day}-${mealType}`]: value }));
  };

  const validateForm = () => {
    if (!title || !startDate || !endDate) {
      toast.error("Please complete all fields.");
      return false;
    }
    for (const day of daysOfWeek) {
      for (const meal of meals) {
        const key = `${day}-${meal}`;
        if (!entries[key] || entries[key].trim() === "") {
          toast.error(`Missing ${meal} on ${day}`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const res = await createDietPlan({
        title,
        startDate,
        endDate,
        member: { id: member.id },
        trainer: { id: member.trainerId },
      });
      const planId = res.data.id;
      await Promise.all(
        daysOfWeek.flatMap((day) =>
          meals.map((mealType) =>
            createEntry({
              planId,
              day,
              time: mealType,
              meal: entries[`${day}-${mealType}`],
            })
          )
        )
      );
      toast.success("Diet plan created successfully!");
      navigate(`/edit-diet/${planId}`);
    } catch (err) {
      toast.error("Failed to save diet plan.");
    }
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold text-green-400 mb-4">Create Diet Plan</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input type="text" placeholder="Plan Title" value={title} onChange={(e) => setTitle(e.target.value)} className="p-2 rounded bg-zinc-800 border" />
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 rounded bg-zinc-800 border" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 rounded bg-zinc-800 border" />
      </div>

      <table className="w-full border border-zinc-700">
        <thead className="bg-zinc-900 text-green-300 text-sm">
          <tr>
            <th className="p-2">Day</th>
            {meals.map((meal) => (
              <th key={meal} className="p-2 capitalize">{meal}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map((day) => (
            <tr key={day} className="border-t border-zinc-700">
              <td className="p-2 font-bold text-yellow-400">{day}</td>
              {meals.map((mealType) => (
                <td key={mealType}>
                  <input
                    type="text"
                    placeholder="Meal"
                    value={entries[`${day}-${mealType}`] || ""}
                    onChange={(e) => handleEntryChange(day, mealType, e.target.value)}
                    className="w-full p-1 rounded bg-zinc-700 text-sm"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow"
        >
          ✅ Save Diet Plan
        </button>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white font-medium rounded"
        >
          🔙 Go Back
        </button>
      </div>
    </div>
  );
};

export default CreateDietPlanPage;