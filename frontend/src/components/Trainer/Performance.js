import React, { useEffect, useState } from "react";
import api from "../../services/axiosConfig";
import { toast } from "react-toastify";

const Performance = () => {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    setLoading(true);
    try {
      // Assuming you have an endpoint to get stats by trainer user ID
      const res = await api.get("/performance/trainer");
      setPerformance(res.data);
    } catch (error) {
      toast.error("Failed to load performance data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white p-6">Loading performance...</div>;

  if (!performance) return <div className="text-white p-6">No performance data available.</div>;

  return (
    <div className="p-8 mx-auto min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg ">
      <h1 className="text-4xl font-bold mb-6 text-green-400">My Performance</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Bookings</h2>
          <p className="text-3xl">{performance.totalBookings}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Cancelled Sessions</h2>
          <p className="text-3xl">{performance.cancelledSessions}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Average Feedback Score</h2>
          <p className="text-3xl">{performance.averageFeedbackScore.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Performance;
