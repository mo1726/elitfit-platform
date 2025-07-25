import React, { useEffect, useState } from "react";
import api from "../../services/axiosConfig";
import { toast } from "react-toastify";

const TrainerSchedule = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const res = await api.get("/schedule/trainer");
      setBookings(res.data);
    } catch (error) {
      toast.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white p-4">Loading schedule...</div>;

  if (bookings.length === 0)
    return <div className="text-white p-4">No schedule available.</div>;

  return (
    <div className="p-8  mx-auto min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white  shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-green-400">My Schedule</h1>
      <table className="w-full text-left border-collapse border border-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-gray-400 uppercase">
          <tr>
            <th className="p-4 border border-gray-700">Class</th>
            <th className="p-4 border border-gray-700">Member</th>
            <th className="p-4 border border-gray-700">Booked At</th>
            <th className="p-4 border border-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border border-gray-700 hover:bg-gray-700">
              <td className="p-4">{b.classTitle}</td>
              <td className="p-4">{b.userName}</td>
              <td className="p-4">{new Date(b.bookedAt).toLocaleString()}</td>
              <td className="p-4">{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainerSchedule;
