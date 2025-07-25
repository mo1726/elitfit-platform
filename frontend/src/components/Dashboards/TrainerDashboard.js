// src/components/Trainer/TrainerDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import RoleNavbar from '../Layout/RoleNavbar';
import {
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaChartLine,
  FaUserCog,
} from 'react-icons/fa';

const TrainerDashboard = () => (
  <>
    <RoleNavbar />
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-950 to-black text-white px-6 py-12">
      <h2 className="text-4xl font-extrabold text-green-400 mb-12 text-center drop-shadow-lg">
        Trainer Dashboard
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        <Link to="/my-members" className="group">
          <div className="bg-gray-800 hover:bg-green-600 transition duration-300 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center space-y-4 cursor-pointer transform hover:-translate-y-1">
            <FaUsers className="text-5xl text-green-400 group-hover:text-white transition" />
            <h3 className="text-2xl font-semibold text-center group-hover:text-white transition">
              👥 My Members
            </h3>
            <p className="text-gray-400 text-center group-hover:text-green-200 transition">
              Manage your members and communication.
            </p>
          </div>
        </Link>

        <Link to="/my-classes" className="group">
          <div className="bg-gray-800 hover:bg-green-600 transition duration-300 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center space-y-4 cursor-pointer transform hover:-translate-y-1">
            <FaCalendarAlt className="text-5xl text-green-400 group-hover:text-white transition" />
            <h3 className="text-2xl font-semibold text-center group-hover:text-white transition">
              📅 My Classes
            </h3>
            <p className="text-gray-400 text-center group-hover:text-green-200 transition">
              Create and manage your class schedule.
            </p>
          </div>
        </Link>

        <Link to="/my-schedule" className="group">
          <div className="bg-gray-800 hover:bg-green-600 transition duration-300 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center space-y-4 cursor-pointer transform hover:-translate-y-1">
            <FaClock className="text-5xl text-green-400 group-hover:text-white transition" />
            <h3 className="text-2xl font-semibold text-center group-hover:text-white transition">
              ⏰ My Schedule
            </h3>
            <p className="text-gray-400 text-center group-hover:text-green-200 transition">
              Track your sessions and availability.
            </p>
          </div>
        </Link>

        <Link to="/performance" className="group">
          <div className="bg-gray-800 hover:bg-green-600 transition duration-300 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center space-y-4 cursor-pointer transform hover:-translate-y-1">
            <FaChartLine className="text-5xl text-green-400 group-hover:text-white transition" />
            <h3 className="text-2xl font-semibold text-center group-hover:text-white transition">
              📊 Performance
            </h3>
            <p className="text-gray-400 text-center group-hover:text-green-200 transition">
              View stats like attendance and feedback.
            </p>
          </div>
        </Link>

        <Link to="/profile" className="group">
          <div className="bg-gray-800 hover:bg-green-600 transition duration-300 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center space-y-4 cursor-pointer transform hover:-translate-y-1">
            <FaUserCog className="text-5xl text-green-400 group-hover:text-white transition" />
            <h3 className="text-2xl font-semibold text-center group-hover:text-white transition">
              ⚙️ Settings & Profile
            </h3>
            <p className="text-gray-400 text-center group-hover:text-green-200 transition">
              Update your info and preferences.
            </p>
          </div>
        </Link>
      </div>
    </div>
  </>
);

export default TrainerDashboard;
