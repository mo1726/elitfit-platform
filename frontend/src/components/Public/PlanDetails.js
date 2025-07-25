import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import membershipService from '../../services/membershipService';

const PlanDetails = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    membershipService.getPlanById(id)
      .then(res => setPlan(res.data))
      .catch(err => {
        console.error('Error loading plan:', err);
        navigate('/membership-plans');
      });
  }, [id]);

  if (!plan) {
    return <p className="text-center text-white py-20">Loading plan details...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-20 px-6">
      <div className="max-w-3xl mx-auto bg-gray-900 p-8 rounded-xl border border-gray-800">
        <img
          src={`/assets/${plan.imageUrl || 'default.png'}`}
          alt={plan.name}
          className="w-full h-60 object-cover rounded-md mb-6"
        />
        <h2 className="text-3xl font-bold text-green-400 mb-2">{plan.name}</h2>
        <p className="text-gray-400 mb-4">{plan.description}</p>
        <p className="text-gray-400 mb-2">⏳ Duration: {plan.durationInDays} days</p>
        <p className="text-green-500 text-xl font-semibold mb-6">{plan.price} MAD</p>

        <a
          href={`https://wa.me/212681792400?text=Hello!%20I%20want%20to%20activate%20the%20${encodeURIComponent(plan.name)}%20plan%20manually.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full text-center bg-green-500 text-black font-bold py-3 rounded hover:bg-green-400 transition"
        >
          💬 Contact via WhatsApp to Activate
        </a>
      </div>
    </div>
  );
};

export default PlanDetails;
