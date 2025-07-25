import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import membershipService from '../../services/membershipService';


const MembershipPlans1 = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Get user role from token
  let role = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role || decoded.roles?.[0] || null;
    } catch (err) {
      console.error('Invalid token:', err);
    }
  }

  // Fetch plans on mount
  useEffect(() => {
    membershipService
      .getAllPlans()
      .then(res => setPlans(res.data))
      .catch(err => console.error('Error fetching plans:', err));
  }, []);

  // Handle subscribe button logic
 const handleSubscribe = (planId) => {
  if (!token) {
    navigate('/login');
  } else {
    switch (role) {
      case 'ROLE_MEMBER':
        navigate(`/plan/${planId}`);
        break;
      case 'ROLE_ADMIN':
        alert('Admins do not require membership.');
        break;
      case 'ROLE_TRAINER':
        alert('Trainers cannot subscribe to membership plans.');
        break;
      default:
        alert('Invalid role or access denied.');
    }
  }
};


  return (
    <section className="py-20 px-6 bg-gray-950 text-white min-h-screen">
      <h2 className="text-4xl font-bold text-center text-green-400 mb-12">
        Choose Your Membership
      </h2>

      {plans.length === 0 ? (
        <p className="text-center text-gray-400">No plans available right now.</p>
      ) : (
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {plans.map(plan => (
            <div
              key={plan.id}
              className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-md hover:shadow-green-500/20 transition"
            >
              <img
                src={`/assets/${plan.imageUrl || 'default.png'}`}
                alt={plan.name}
                className="w-full h-44 object-cover rounded-md mb-5"
              />
              <h3 className="text-2xl font-bold text-green-300 mb-1">{plan.name}</h3>
              <p className="text-gray-400 mb-2">{plan.description}</p>
              <p className="text-sm text-gray-500 mb-2">⏳ Duration: {plan.durationInDays} days</p>
              <p className="text-green-500 font-semibold text-xl mb-5">{plan.price} MAD</p>
              <button
                onClick={() => handleSubscribe(plan.id)}
                className="w-full bg-green-500 text-black py-2 rounded font-bold hover:bg-green-400 transition"
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MembershipPlans1;
