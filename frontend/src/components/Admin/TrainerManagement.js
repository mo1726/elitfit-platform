import React, { useEffect, useState } from 'react';
import {
  getAllTrainers,
  createTrainer,
  deleteTrainer,
  update,
} from '../../services/trainerService';
import { getAllUsers } from '../../services/userService';
import { toast } from 'react-toastify';
import ConfirmDeleteModal from './ConfirmDeleteModal'; // adjust path as needed

const TrainerManagement = () => {
  const [trainers, setTrainers] = useState([]);
  const [specialization, setSpecialization] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [trainerRes, userRes] = await Promise.all([getAllTrainers(), getAllUsers()]);
      setTrainers(trainerRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error('Error loading trainers or users:', err.response || err);
      toast.error('Error loading data');
    }
  };

  const handleSubmit = async () => {
    if (!specialization || !selectedUserId) {
      toast.warning("Please select a user and enter specialization");
      return;
    }

    try {
      if (editingTrainer) {
        await update(editingTrainer.id, { specialization, userId: selectedUserId });
        toast.success('Trainer updated');
      } else {
        await createTrainer({ specialization, userId: selectedUserId });
        toast.success('Trainer added');
      }

      setSpecialization('');
      setSelectedUserId('');
      setEditingTrainer(null);
      setShowForm(false);
      setCurrentPage(1);
      fetchData();
    } catch (err) {
      console.error('Error saving trainer:', err.response || err);
      toast.error('Error saving trainer');
    }
  };

  const handleEdit = (trainer) => {
    setSpecialization(trainer.specialization);
    setSelectedUserId(trainer.userId);
    setEditingTrainer(trainer);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingTrainer(null);
    setShowForm(false);
    setSpecialization('');
    setSelectedUserId('');
  };

  // Open modal for delete confirmation
  const openDeleteModal = (trainer) => {
    setTrainerToDelete(trainer);
    setDeleteModalOpen(true);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (!trainerToDelete) return;
    try {
      await deleteTrainer(trainerToDelete.id);
      toast.success("Trainer deleted");
      fetchData();
    } catch (err) {
      console.error('Error deleting trainer:', err.response || err);
      toast.error("Error deleting trainer");
    } finally {
      setDeleteModalOpen(false);
      setTrainerToDelete(null);
    }
  };

  // Cancel delete action
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setTrainerToDelete(null);
  };

  // Filter trainers by search term (search by specialization, userName, or userId)
  const filteredTrainers = trainers.filter(trainer =>
    (trainer.specialization || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (trainer.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (trainer.userId?.toString().includes(searchTerm))
  );

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrainers = filteredTrainers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTrainers.length / itemsPerPage);

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">🏋️ Trainer Management</h2>

      {!showForm && (
        <div className="text-center mb-6">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingTrainer(null);
              setSpecialization('');
              setSelectedUserId('');
            }}
            className="bg-green-600 hover:bg-green-500 text-black font-bold px-6 py-3 rounded shadow"
          >
            ➕ Add Trainer
          </button>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-zinc-900 p-6 rounded-xl shadow-lg max-w-lg w-full mx-4 relative">
            <h3 className="text-xl text-green-300 mb-4">
              {editingTrainer ? 'Edit Trainer' : 'Create New Trainer'}
            </h3>
            <input
              type="text"
              placeholder="Specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="p-3 rounded bg-zinc-800 text-white focus:outline-none w-full mb-4"
            />
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="p-3 rounded bg-zinc-800 text-white focus:outline-none w-full mb-4"
            >
              <option value="">Select User by ID</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.id} - {user.name}
                </option>
              ))}
            </select>
            <div className="flex justify-between">
              <button
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-6 rounded transition"
              >
                {editingTrainer ? 'Update' : 'Save Trainer'}
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white py-3 px-6 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search by specialization, user name or user ID"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="p-3 w-full md:w-1/3 rounded bg-zinc-800 text-white focus:outline-none"
        />
      </div>

      {/* Trainers Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse bg-zinc-900 rounded-lg overflow-hidden">
          <thead>
            <tr className="text-green-300 bg-zinc-800">
              <th className="p-4">#</th>
              <th className="p-4">Specialization</th>
              <th className="p-4">User ID</th>
              <th className="p-4">User Name</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTrainers.length > 0 ? (
              currentTrainers.map((trainer, index) => (
                <tr key={trainer.id} className="border-t border-zinc-700 hover:bg-zinc-800">
                  <td className="p-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="p-4">{trainer.specialization}</td>
                  <td className="p-4">{trainer.userId}</td>
                  <td className="p-4">{trainer.userName}</td>
                  <td className="p-4 space-x-2">
                    <button
                      onClick={() => handleEdit(trainer)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(trainer)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan="5">
                  No trainers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Buttons */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-700 hover:bg-green-400 text-white px-3 py-1 rounded-l disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-1 ${
                pageNum === currentPage
                  ? 'bg-green-500 text-black'
                  : 'bg-gray-700 text-white hover:bg-green-400'
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-gray-700 hover:bg-green-400 text-white px-3 py-1 rounded-r disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message={`Are you sure you want to delete trainer "${trainerToDelete?.userName}"?`}
      />
    </div>
  );
};

export default TrainerManagement;
