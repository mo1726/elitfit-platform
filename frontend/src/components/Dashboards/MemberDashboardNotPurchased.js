import React from 'react';
import { useNavigate } from 'react-router-dom';
import RoleNavbar from '../Layout/RoleNavbar';

const MemberDashboardNotPurchased = () => {
  const navigate = useNavigate();

  return (
    <>
      <RoleNavbar />
      <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 flex items-center justify-center px-4">
        <div className="bg-zinc-800 p-8 rounded-2xl shadow-lg max-w-lg w-full text-center text-white">
          <h1 className="text-3xl font-bold text-red-500 mb-4">No Active Membership</h1>
          <p className="text-gray-300 mb-6">
            You haven’t subscribed to any plan yet. Please choose a membership plan to access dashboard features, track your progress, and join classes.
          </p>

          <button
            onClick={() => navigate('/membership-plans')}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded transition"
          >
           💳 View Membership Plans
          </button>

          <p className="text-sm text-gray-400 mt-6">
            Need help? Contact support or ask a trainer.
          </p>
        </div>
      </div>
    </>
  );
};

export default MemberDashboardNotPurchased;
