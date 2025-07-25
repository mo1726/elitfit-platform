import React, { useEffect, useState } from 'react';
import { getMemberMe, updateMemberTrainer } from '../../services/memberService';
import api from '../../services/axiosConfig';
import { toast } from 'react-toastify';
import { FaUserMd } from 'react-icons/fa';
import { motion } from 'framer-motion';

const TrainerPage = () => {
  const [member, setMember] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [memberRes, trainerRes] = await Promise.all([
          getMemberMe(),
          api.get('/trainers')
        ]);
        setMember(memberRes.data);
        setTrainers(trainerRes.data);
        setSelectedTrainer(memberRes.data.trainerId || '');
      } catch {
        toast.error("Error fetching data");
      }
    };
    fetchData();
  }, []);

  const updateTrainer = async () => {
    if (!selectedTrainer) return toast.warning("Please select a trainer");
    setSubmitting(true);
    try {
      await updateMemberTrainer(member.userId, Number(selectedTrainer));
      toast.success("Trainer updated!");
    } catch {
      toast.error("Failed to update trainer");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-8 text-white bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-6 text-green-400">Choose Your Trainer</h1>
      <div className="bg-zinc-800 p-6 rounded-lg shadow-md">
        <label className="block mb-2 text-sm font-semibold">Select Trainer:</label>
        <select
          className="bg-zinc-700 p-3 rounded w-full mb-4 border border-gray-600 text-white"
          value={selectedTrainer}
          onChange={(e) => setSelectedTrainer(e.target.value)}
        >
          <option value="">-- Choose Trainer --</option>
          {trainers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} — {t.specialization}
            </option>
          ))}
        </select>

        <button
          onClick={updateTrainer}
          disabled={submitting}
          className={`px-6 py-2 rounded transition-all duration-300 text-white font-medium ${submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {submitting ? 'Submitting...' : 'Save Selection'}
        </button>
      </div>
    </motion.div>
  );
};

export default TrainerPage;
