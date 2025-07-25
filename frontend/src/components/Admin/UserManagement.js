import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser, getUserById, updateUser } from '../../services/userService';
import api from '../../services/axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: '' });
  const [plans, setPlans] = useState([]);
  const [selectedUserToActivate, setSelectedUserToActivate] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showActivateForm, setShowActivateForm] = useState(false);
  const [memberStatuses, setMemberStatuses] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchPlans();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
      await checkMemberStatuses(res.data);
    } catch {
      toast.error('❌ Failed to load users');
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await api.get('/membership-plans');
      setPlans(res.data);
    } catch {
      toast.error('❌ Failed to load plans');
    }
  };

  const checkMemberStatuses = async (usersList) => {
    let statuses = {};
    const list = usersList || users;
    for (let user of list) {
      if (user.role === 'MEMBER') {
        try {
          const res = await api.get(`/member/isActive/${user.id}`);
          statuses[user.id] = res.data;
        } catch {
          statuses[user.id] = false;
        }
      }
    }
    setMemberStatuses(statuses);
  };

  useEffect(() => {
    let result = users;
    if (search) {
      result = result.filter((u) =>
        `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (role) {
      result = result.filter((u) => u.role === role);
    }
    setFiltered(result);
  }, [search, role, users]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
        toast.success('🗑️ User deleted successfully');
      } catch {
        toast.error('❌ Failed to delete user');
      }
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await getUserById(id);
      setEditingUser(id);
      setForm(res.data);
    } catch {
      toast.error('❌ Failed to load user data');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser, form);
      toast.success('✅ User updated!');
      setEditingUser(null);
      setForm({ name: '', email: '', role: '' });
      fetchUsers();
    } catch {
      toast.error('❌ Failed to update user');
    }
  };

  const calculateEndDate = (durationDays) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setDate(end.getDate() + durationDays);
    return end.toISOString().split('T')[0];
  };

  const handlePlanChange = (planId) => {
    setSelectedPlanId(planId);
    const selectedPlan = plans.find(p => p.id.toString() === planId);
    if (selectedPlan) {
      const newEndDate = calculateEndDate(selectedPlan.durationInDays);
      setEndDate(newEndDate);
    } else {
      setEndDate('');
    }
  };

  const openActivateForm = (user) => {
    setSelectedUserToActivate(user);
    setSelectedPlanId('');
    setEndDate('');
    setShowActivateForm(true);
  };

  const closeActivateForm = () => {
    setSelectedUserToActivate(null);
    setSelectedPlanId('');
    setEndDate('');
    setShowActivateForm(false);
  };

  const handleActivate = async () => {
    if (!selectedPlanId) {
      toast.error('Please select a plan');
      return;
    }
    try {
      await api.post('/member/subscribe', {
        userId: selectedUserToActivate.id,
        planId: selectedPlanId,
        startDate: new Date().toISOString().split('T')[0],
        trainerId: null,
      });

      await api.put(`/member/activate/${selectedUserToActivate.id}`, { endDate });

      toast.success('Subscription activated successfully');
      closeActivateForm();
      await fetchUsers();
    } catch {
      toast.error('Failed to activate subscription');
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white p-6">
      <ToastContainer position="top-right" theme="dark" />
      <h1 className="text-3xl font-bold text-green-400 mb-6 text-center">
        👥 User Management
      </h1>
      <div className="mb-4">
  <button
    onClick={() => navigate(-1)} // or replace with a path like navigate("/admin/dashboard")
    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
  >
    🔙 Back
  </button>
</div>


      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <input
          type="text"
          placeholder="🔎 Search name or email"
          className="bg-gray-800 px-4 py-2 rounded w-full md:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="bg-gray-800 px-4 py-2 rounded w-full md:w-1/4"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="TRAINER">TRAINER</option>
          <option value="MEMBER">MEMBER</option>
        </select>
      </div>

      {/* ✅ Modal: Activate Subscription */}
      {showActivateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-zinc-900 p-6 rounded max-w-md w-full mx-4 space-y-4">
            <h3 className="text-xl font-semibold text-green-300">
              Activate Subscription for: {selectedUserToActivate?.name || selectedUserToActivate?.email}
            </h3>

            <select
              value={selectedPlanId}
              onChange={(e) => handlePlanChange(e.target.value)}
              className="w-full p-2 rounded bg-zinc-700 text-white"
            >
              <option value="">Select Plan</option>
              {plans.map((plan) => (
                <option
                  key={plan.id}
                  value={plan.id}
                  disabled={selectedUserToActivate?.membershipPlanId === plan.id}
                >
                  {plan.name} - ${plan.price} - {plan.durationInDays} days
                </option>
              ))}
            </select>

            <label className="block">
              <span className="text-green-300 font-semibold">End Date:</span>
              <input
                type="date"
                value={endDate}
                readOnly
                className="w-full p-2 rounded bg-zinc-700 text-white cursor-not-allowed mt-1"
              />
            </label>

            <div className="flex gap-4 justify-end">
              <button
                onClick={handleActivate}
                className="bg-green-500 px-4 py-2 rounded text-black hover:bg-green-600"
              >
                ✅ Activate
              </button>
              <button
                onClick={closeActivateForm}
                className="bg-red-500 px-4 py-2 rounded text-black hover:bg-red-600"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🧑‍💻 User List */}
      <ul className="space-y-4">
        {filtered.map((user) => {
          const isActive = memberStatuses[user.id] || false;
          const canActivate = user.role === 'MEMBER' && !isActive;
          const canUpgrade = user.role === 'MEMBER' && isActive;

          return (
            <li
              key={user.id}
              className="bg-zinc-800 p-4 rounded shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div>
                <p><span className="text-green-300 font-semibold">ID:</span> {user.id}</p>
                <p><span className="text-green-300 font-semibold">Name:</span> {user.name}</p>
                <p><span className="text-green-300 font-semibold">Email:</span> {user.email}</p>
                <p><span className="text-green-300 font-semibold">Role:</span> {user.role}</p>
                {user.role === 'MEMBER' && (
                  <p>
                    <span className="text-green-300 font-semibold">Membership Status:</span>{' '}
                    {isActive ? (
                      <span className="text-green-400 font-bold">Active</span>
                    ) : (
                      <span className="text-red-500 font-bold">Not Active</span>
                    )}
                  </p>
                )}
              </div>

              <div className="mt-2 sm:mt-0 flex gap-3">
                <button
                  onClick={() => handleEdit(user.id)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1 rounded"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
                >
                  🗑️ Delete
                </button>

                {canActivate && (
                  <button
                    onClick={() => openActivateForm(user)}
                    className="bg-green-500 px-3 py-1 rounded text-black hover:bg-green-600"
                  >
                    Activate Plan
                  </button>
                )}

                {canUpgrade && (
                  <button
                    onClick={() => navigate(`/upgrade-membership/${user.id}`)}
                    className="bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-700"
                  >
                    Upgrade Plan
                  </button>
                )}

                {isActive && (
  <button
    onClick={async () => {
      if (window.confirm('Are you sure you want to cancel the active plan?')) {
        try {
          await api.put(`/member/deactivate/${user.id}`);
          toast.success('Plan canceled successfully');
          await fetchUsers();
        } catch {
          toast.error('Failed to cancel the plan');
        }
      }
    }}
    className="bg-red-400 px-3 py-1 rounded text-black hover:bg-red-500"
  >
    Cancel Plan
  </button>
)}

              </div>
            </li>
          );
        })}
      </ul>

      {/* ✏️ Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <form
            onSubmit={handleUpdate}
            className="bg-zinc-900 p-6 rounded max-w-xl w-full mx-4 space-y-4 relative"
          >
            <h2 className="text-xl text-green-300 font-semibold mb-4">🛠️ Edit User</h2>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
            <select
              name="role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            >
              <option value="">Select Role</option>
              <option value="ADMIN">ADMIN</option>
              <option value="TRAINER">TRAINER</option>
              <option value="MEMBER">MEMBER</option>
            </select>
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-green-500 text-black px-4 py-2 rounded font-bold"
              >
                💾 Save
              </button>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
