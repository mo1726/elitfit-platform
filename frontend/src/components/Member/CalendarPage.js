import React, { useEffect, useState } from "react";
import { getUpcomingClasses } from "../../services/classService";
import RoleNavbar from "../Layout/RoleNavbar";
import { toast } from "react-toastify";

const CalendarPage = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getUpcomingClasses();
        setClasses(res.data);
      } catch (err) {
        toast.error("Failed to load upcoming classes.");
      }
    };
    fetchClasses();
  }, []);

  return (
    <>
      <RoleNavbar />
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white p-6">
        <h1 className="text-3xl font-extrabold text-green-400 mb-8">
          📆 Upcoming Fitness Classes
        </h1>

        {classes.length === 0 ? (
          <p className="text-gray-400">No upcoming classes found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((c) => (
              <div
                key={c.id}
                className="bg-zinc-900 border border-green-500 rounded-xl p-5 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-green-300">{c.title}</h2>
                </div>

                <p className="text-sm text-gray-400 mb-3">{c.description}</p>

                <div className="space-y-1 text-sm">
                  <p>
                    🕒 <span className="text-gray-300">Start:</span>{" "}
                    <span className="text-white">
                      {new Date(c.startTime).toLocaleString()}
                    </span>
                  </p>
                  <p>
                    🛑 <span className="text-gray-300">End:</span>{" "}
                    <span className="text-white">
                      {new Date(c.endTime).toLocaleString()}
                    </span>
                  </p>
                  <p>
                    🧑‍🏫 <span className="text-gray-300">Trainer:</span>{" "}
                    <span className="text-green-400">{c.trainerName}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CalendarPage;
