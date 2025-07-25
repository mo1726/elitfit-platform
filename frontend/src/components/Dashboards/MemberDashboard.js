import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleNavbar from "../Layout/RoleNavbar";
import { getMemberMe } from "../../services/memberService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const MemberDashboard = () => {
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const { data } = await getMemberMe();
        setMemberId(data.id); // assumes the response has member ID
      } catch (err) {
        console.error("Failed to fetch member info", err);
        toast.error("Could not load member data");
      }
    };
    fetchMember();
  }, []);

  const cards = [
    {
      title: "My Plan",
      icon: "📋",
      description: "Your membership and duration.",
      path: "/member/plan",
    },
    {
      title: "My Trainer",
      icon: "🧑‍🏫",
      description: "Your assigned trainer info.",
      path: "/member/trainer",
    },
    {
      title: "Book Class",
      icon: "📅",
      description: "Reserve your next session.",
      path: "/member/book-class",
    },
    {
      title: "Bookings",
      icon: "📖",
      description: "Manage your class reservations.",
      path: "/member/bookings",
    },
    {
      title: "Calendar",
      icon: "🗓️",
      description: "Upcoming class view.",
      path: "/member/bookings-upcoming-hour",
    },
  
    {
      title: "Diet Plan",
      icon: "🥗",
      description: "View your nutrition guide.",
      path: memberId ? `/member/diet-plans/${memberId}` : "#",
    },
  ];

  return (
    <>
      <RoleNavbar />
      <div className="min-h-screen bg-black text-white p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-400 text-center mb-6">
          🎯 Member Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-zinc-800 rounded-xl p-5 shadow-md hover:shadow-lg cursor-pointer transition-all"
              onClick={() => {
                if (card.path === "#") {
                  toast.info("Loading...");
                  return;
                }
                navigate(card.path);
              }}
            >
              <div className="text-3xl sm:text-4xl mb-3">{card.icon}</div>
              <h2 className="text-lg font-semibold mb-1">{card.title}</h2>
              <p className="text-sm text-gray-400">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MemberDashboard;
