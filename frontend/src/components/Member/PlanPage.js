import React, { useEffect, useState } from 'react';
import { getMemberMe } from '../../services/memberService';
import { toast } from 'react-toastify';
import { FaArrowUp, FaRegCalendarAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const PlanPage = () => {
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await getMemberMe();
        setPlan(res.data);
      } catch {
        toast.error('Failed to load plan info');
      }
    };
    fetchPlan();
  }, []);

  if (!plan) return <p className="text-white px-6 py-10">Loading your plan...</p>;

  return (
    <div className="p-8 text-white min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-green-400">My Membership Plan</h1>

      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg space-y-4">
        <p className="text-lg">
          <strong>Plan Name:</strong>{' '}
          <span className="text-green-300">{plan.membershipPlanName || '—'}</span>
        </p>
        <p className="flex items-center gap-2 text-sm text-gray-300">
          <FaRegCalendarAlt /> Start Date:{' '}
          {plan.startDate ? new Date(plan.startDate).toLocaleDateString() : '—'}
        </p>
        <p className="flex items-center gap-2 text-sm text-gray-300">
          <FaRegCalendarAlt /> End Date:{' '}
          {plan.endDate ? new Date(plan.endDate).toLocaleDateString() : '—'}
        </p>
        <p className="flex items-center gap-2 text-sm">
          {plan.active ? (
            <span className="text-green-500 flex items-center gap-2">
              <FaCheckCircle /> Active
            </span>
          ) : (
            <span className="text-red-500 flex items-center gap-2">
              <FaTimesCircle /> Inactive
            </span>
          )}
        </p>

        {/* WhatsApp Upgrade Button */}
        <a
          href="https://wa.me/212681792400?text=Hello%2C%20I%20want%20to%20upgrade%20my%20membership%20plan"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-green-600 hover:bg-green-700 transition"
        >
          <FaArrowUp />
          Upgrade via WhatsApp
        </a>
      </div>
    </div>
  );
};

export default PlanPage;
