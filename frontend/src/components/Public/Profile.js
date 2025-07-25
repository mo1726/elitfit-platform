import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { updateUser } from '../../services/userService'; // ✅ fix: use service function
import api from '../../services/axiosConfig';
import ChangePasswordModal from '../Member/ChangePasswordModal';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [trainerInfo, setTrainerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/member/profile');
      setProfile(res.data);
      setForm({ name: res.data.name || '', email: res.data.email || '' });

      if (res.data.role?.toLowerCase().includes('trainer')) {
        fetchTrainerInfo(res.data.userId);
      }
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainerInfo = async (userId) => {
    try {
      const res = await api.get(`/trainers/user/${userId}`);
      setTrainerInfo(res.data);
    } catch {
      toast.error('Failed to load trainer info');
    }
  };

  const toggleEditMode = () => {
    if (editMode) {
      setForm({ name: profile.name, email: profile.email });
    }
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!form.name || !form.email) {
      toast.error('Name and email are required');
      return;
    }

    try {
      await updateUser(profile.userId, form); // ✅ uses correct service
      toast.success('Profile updated successfully');
      setProfile((prev) => ({ ...prev, ...form }));
      setEditMode(false);
    } catch {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white text-xl font-semibold">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white text-xl font-semibold">
        No profile data available.
      </div>
    );
  }

  const initials = profile.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black p-6 text-white flex justify-center items-start">
        <div className="w-full max-w-4xl bg-zinc-900/90 rounded-2xl shadow-2xl p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-green-400 mb-10 text-center uppercase tracking-wide">
            My Profile
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
            <div className="w-24 h-24 rounded-full bg-green-600 text-white flex items-center justify-center text-4xl font-bold shadow-inner">
              {initials}
            </div>
            <div className="flex flex-col flex-grow w-full sm:max-w-md">
              {editMode ? (
                <>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white text-xl mb-3 focus:ring-2 ring-green-400 transition"
                    placeholder="Name"
                  />
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-green-300 text-base focus:ring-2 ring-green-400"
                    placeholder="Email"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <p className="text-green-400 text-lg">{profile.email}</p>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            {[{ label: 'User ID', value: profile.userId },
              { label: 'Membership Plan', value: profile.membershipPlanName || 'None' },
              { label: 'Start Date', value: profile.startDate || 'N/A' },
              { label: 'End Date', value: profile.endDate || 'N/A' }].map((item, i) => (
                <div key={i}>
                  <h4 className="text-green-400 font-medium mb-1">{item.label}</h4>
                  <div className="bg-zinc-800 rounded-lg px-4 py-3 text-white border border-zinc-700">
                    {item.value}
                  </div>
                </div>
              ))}
            <div>
              <h4 className="text-green-400 font-medium mb-1">Active</h4>
              <div
                className={`px-4 py-3 rounded-lg font-bold border text-center ${
                  profile.active ? 'bg-green-600 border-green-500' : 'bg-red-600 border-red-500'
                }`}
              >
                {profile.active ? 'Yes' : 'No'}
              </div>
            </div>
          </div>

          {trainerInfo && (
            <div className="mt-10 border-t border-zinc-700 pt-6">
              <h3 className="text-xl font-bold text-green-400 mb-4">Trainer Info</h3>
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <p className="text-sm">
                  <span className="text-green-300 font-semibold">Specialization: </span>
                  {trainerInfo.specialization || 'N/A'}
                </p>
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-black font-bold px-6 py-3 rounded-lg transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={toggleEditMode}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold px-6 py-3 rounded-lg transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleEditMode}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-lg transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setIsChangePassModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-black font-bold px-6 py-3 rounded-lg transition"
                >
                  Change Password
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isChangePassModalOpen}
        onClose={() => setIsChangePassModalOpen(false)}
      />
    </>
  );
};

export default Profile;
