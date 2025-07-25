import React, { useEffect, useState } from "react";
import { getTrainers } from "../../services/memberService";
import { createBooking } from "../../services/bookingService";
import { getClassesByTrainerUserId } from "../../services/classService";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { FaChalkboardTeacher, FaCalendarAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BookClassPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedTrainerUserId, setSelectedTrainerUserId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const res = await getTrainers();
      setTrainers(res.data);
    } catch (error) {
      console.error("Error fetching trainers:", error);
      toast.error("❌ Failed to load trainers.");
    }
  };

  const handleTrainerChange = async (e) => {
    const trainerUserId = e.target.value;
    setSelectedTrainerUserId(trainerUserId);
    setSelectedClassId("");

    try {
      const res = await getClassesByTrainerUserId(trainerUserId);
      setClasses(res.data);
      if (res.data.length === 0) toast.info("ℹ️ No classes found for this trainer.");
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("❌ Failed to load classes.");
    }
  };

  const handleBooking = async () => {
    if (!selectedClassId) {
      toast.warning("⚠️ Please select a class to book.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      await createBooking({ classId: selectedClassId, userId });
      toast.success("✅ Class booked successfully!");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setSelectedTrainerUserId("");
        setSelectedClassId("");
        setClasses([]);
      }, 2500);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("❌ Failed to book class.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6 flex items-center justify-center">
      <div className="bg-zinc-950 rounded-2xl shadow-lg w-full max-w-xl p-8 border border-zinc-800 relative overflow-hidden">

        <h1 className="text-3xl font-extrabold text-green-400 text-center mb-8 tracking-wide">
          Book a Fitness Class
        </h1>

        {/* Trainer */}
        <label className="text-gray-300 text-sm font-medium mb-1 block flex items-center gap-2">
          <FaChalkboardTeacher className="text-green-400" /> Choose a Trainer
        </label>
        <select
          value={selectedTrainerUserId}
          onChange={handleTrainerChange}
          className="w-full mb-6 p-3 rounded-lg bg-zinc-800 text-white border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">-- Select Trainer --</option>
          {trainers.map((trainer) => (
            <option key={trainer.id} value={trainer.userId}>
              {trainer.name} • {trainer.specialization}
            </option>
          ))}
        </select>

        {/* Class */}
        <label className="text-gray-300 text-sm font-medium mb-1 block flex items-center gap-2">
          <FaCalendarAlt className="text-yellow-400" /> Choose a Class
        </label>
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="w-full mb-8 p-3 rounded-lg bg-zinc-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">-- Select Class --</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.title} • {new Date(cls.startTime).toLocaleString()}
            </option>
          ))}
        </select>

        {/* Book Button */}
        <button
          onClick={handleBooking}
          className="w-full bg-green-600 hover:bg-green-700 transition-all duration-200 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg"
        >
          Confirm Booking
        </button>

        {/* ✅ Animated Confirmation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg font-semibold z-50"
            >
              ✅ Booking Confirmed!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookClassPage;
