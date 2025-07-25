import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RoleNavbar from '../Layout/RoleNavbar';
import api from '../../services/axiosConfig';
import * as XLSX from 'xlsx';
import { FaUsers, FaUserTie, FaChalkboardTeacher, FaCalendarAlt, FaDownload } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, trainers, classes, bookings] = await Promise.all([
          api.get('/users/all'),
          api.get('/trainers'),
          api.get('/classes'),
          api.get('/bookings'),
        ]);
        const statData = [
          { title: 'Users', value: users.data.length, icon: <FaUsers /> },
          { title: 'Trainers', value: trainers.data.length, icon: <FaUserTie /> },
          { title: 'Classes', value: classes.data.length, icon: <FaChalkboardTeacher /> },
          { title: 'Bookings', value: bookings.data.length, icon: <FaCalendarAlt /> },
        ];
        setStats(statData);
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };
    fetchStats();
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(stats.map(({ icon, ...rest }) => rest));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stats");
    XLSX.writeFile(wb, "Admin_Stats.xlsx");
  };

  const navCards = [
    { path: '/admin/users', label: '👥 User Management' },
    { path: '/admin/trainers', label: '🏋️ Trainer Management' },
    { path: '/admin/classes', label: '📚 Class Management' },
    { path: '/admin/members', label: '🧾 Member Subscriptions' },
    { path: '/admin/bookings', label: '📅 All Bookings' },
    { path: '/admin-plans', label: '📋 Plan Manager' },
  ];

  return (
    <>
      <RoleNavbar />
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-green-400 tracking-wide">
            Admin Dashboard
          </h1>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 mt-4 md:mt-0 bg-green-500 text-black font-semibold px-4 py-2 rounded hover:bg-green-600 transition"
          >
            <FaDownload /> Export Excel
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {stats.map(({ title, value, icon }) => (
            <div
              key={title}
              className="bg-zinc-800 p-6 rounded-xl text-center shadow-lg transform hover:scale-105 transition"
            >
              <div className="text-green-400 text-4xl mb-2">{icon}</div>
              <h3 className="text-md text-gray-300">{title}</h3>
              <p className="text-3xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {navCards.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className="rounded-xl bg-zinc-900 p-6 shadow hover:bg-green-500 hover:text-black text-center text-lg font-semibold transition"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
