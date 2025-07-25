import React, { useEffect, useState } from 'react';
import membershipService from '../../services/membershipService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPlansManager = () => {
  const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [form, setForm] = useState({ name: '', description: '', price: '', durationInDays: '' });
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await membershipService.getAllPlans();
      setPlans(res.data);
    } catch (err) {
      toast.error('Failed to fetch plans');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'durationInDays' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await membershipService.updatePlan(editingId, form);
        toast.success('✅ Plan updated!');
      } else {
        await membershipService.createPlan(form);
        toast.success('✅ Plan created!');
      }
      resetForm();
      fetchPlans();
    } catch (err) {
      toast.error('❌ Error saving plan');
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await membershipService.getPlanById(id);
      setForm(res.data);
      setEditMode(true);
      setEditingId(id);
      setActiveTab('form');
    } catch (err) {
      toast.error('❌ Failed to load plan');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await membershipService.deletePlan(id);
      toast.success('🗑️ Plan deleted');
      fetchPlans();
    } catch (err) {
      toast.error('❌ Failed to delete plan');
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', durationInDays: '' });
    setEditMode(false);
    setEditingId(null);
    setActiveTab('list');
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">🧾 Manage Membership Plans</h2>

      {/* Tabs */}
      <div className="flex gap-4 justify-center mb-8">
        <button
          onClick={() => {
            resetForm();
            setActiveTab('form');
          }}
          className={`px-6 py-2 rounded text-sm font-semibold transition ${
            activeTab === 'form' ? 'bg-green-500 text-black' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {editMode ? '✏️ Edit Plan' : '➕ Add New Plan'}
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`px-6 py-2 rounded text-sm font-semibold transition ${
            activeTab === 'list' ? 'bg-green-500 text-black' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          📋 View Plans
        </button>
      </div>

      {/* Form */}
      {activeTab === 'form' && (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Plan Name"
            required
            className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700"
          />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price (MAD)"
            required
            className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700"
          />
          <input
            type="number"
            name="durationInDays"
            value={form.durationInDays}
            onChange={handleChange}
            placeholder="Duration (days)"
            required
            className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2 rounded"
          >
            {editMode ? '💾 Save Changes' : '🚀 Create Plan'}
          </button>
        </form>
      )}

      {/* List */}
      {activeTab === 'list' && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-gray-800 p-5 rounded flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-green-300">{plan.name}</h3>
                <p className="text-gray-300">{plan.description}</p>
                <p className="text-green-400 font-medium mt-1">{plan.price} MAD / {plan.durationInDays} days</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(plan.id)}
                  className="bg-yellow-400 text-black font-bold px-4 py-1 rounded hover:bg-yellow-300"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="bg-red-600 text-white font-bold px-4 py-1 rounded hover:bg-red-500"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPlansManager;
