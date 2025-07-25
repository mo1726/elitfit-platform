import React, { useEffect, useState } from 'react';
import membershipService from '../../services/membershipService';
import { getMemberByUserId, upgradeMember } from '../../services/memberService';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const UpgradeMembership = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [member, setMember] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      toast.error('User ID missing in URL');
      navigate('/admin/users');
      return;
    }

    membershipService.getAllPlans()
      .then(res => setPlans(res.data))
      .catch(() => toast.error('Failed to load plans'));

    getMemberByUserId(userId)
      .then(res => {
        setMember(res.data);
        setSelectedPlanId(res.data.planId || null);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load member info');
        setLoading(false);
      });
  }, [userId, navigate]);

  const handleUpgrade = async (e) => {
    e.preventDefault();
    if (!selectedPlanId) {
      toast.error('Please select a plan');
      return;
    }

    try {
      const startDate = new Date().toISOString().split('T')[0];
      const selectedPlan = plans.find(plan => plan.id === selectedPlanId);
      const endDate = new Date(Date.now() + (selectedPlan.durationInDays * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

      const updatedMember = {
        id: member?.id,
        userId: parseInt(userId),
        planId: selectedPlanId,
        active: true,
        startDate,
        endDate,
      };

      const response = await upgradeMember(updatedMember);

      toast.success('Membership upgraded successfully!');
      setMember(response.data);
      navigate('/admin/users');
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error('Error during upgrade');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
        <div className="text-white text-xl font-semibold animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-black flex flex-col items-center p-6">
      <ToastContainer position="top-right" theme="dark" autoClose={3000} />

      <div className="bg-gray-900 bg-opacity-80 rounded-xl shadow-xl max-w-4xl w-full p-8">
        <h1 className="text-4xl font-extrabold text-gradient mb-6 text-center text-green-400">
          Upgrade Membership
        </h1>

        <p className="text-center text-lg mb-8 text-gray-300">
          Upgrade membership for user <span className="font-semibold text-green-400">{userId}</span>
        </p>

        <div className="mb-8 text-center">
          <span className="text-gray-400 text-lg">Current Plan: </span>
          <span className={`font-semibold ${member?.planId ? 'text-green-400' : 'text-red-500'}`}>
            {member?.membershipPlanName || 'None'}
          </span>
        </div>

        <form
          onSubmit={handleUpgrade}
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-3"
          aria-label="Upgrade membership form"
        >
          {plans.length === 0 && (
            <p className="col-span-full text-center text-gray-500 italic">No plans available right now.</p>
          )}

          {plans.map((plan) => (
            <label
              key={plan.id}
              className={`cursor-pointer rounded-lg border-2 p-5 flex flex-col justify-between
                transition-shadow duration-300
                ${
                  selectedPlanId === plan.id
                    ? 'border-green-500 bg-gradient-to-r from-green-900 via-green-800 to-green-900 shadow-lg'
                    : 'border-gray-700 hover:border-green-400 hover:bg-gray-800'
                }
              `}
            >
              <input
                type="radio"
                name="plan"
                value={plan.id}
                checked={selectedPlanId === plan.id}
                onChange={() => setSelectedPlanId(plan.id)}
                className="hidden"
              />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">{plan.name}</h3>
                <p className="text-gray-300 mb-4 min-h-[60px]">{plan.description}</p>
              </div>
              <p className="text-2xl font-bold text-green-400">${plan.price}</p>
              <p className="text-sm text-gray-400">{plan.durationInDays} days</p>
            </label>
          ))}

          <button
            type="submit"
            disabled={selectedPlanId === member?.planId || !selectedPlanId}
            className={`col-span-full py-4 rounded-lg font-extrabold text-black
              ${
                selectedPlanId === member?.planId || !selectedPlanId
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              }
              transition
            `}
          >
            {selectedPlanId === member?.planId ? 'Current Plan' : 'Upgrade Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpgradeMembership;
