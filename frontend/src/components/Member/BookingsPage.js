import React, { useEffect, useState } from 'react';
import api from '../../services/axiosConfig';
import { submitFeedback } from '../../services/feedbackService';
import { toast } from 'react-toastify';
import { FaTrash, FaEdit, FaSearch, FaChalkboardTeacher, FaDumbbell, FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import FeedbackModal from '../../components/Member/FeedbackModal'; // Make sure this path is correct

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editId, setEditId] = useState(null);
  const [editedStatus, setEditedStatus] = useState('BOOKED');
  const [showConfirmId, setShowConfirmId] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const itemsPerPage = 5;

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/member');
      setBookings(res.data);
    } catch {
      toast.error("Couldn't fetch bookings");
    }
  };

  const deleteBooking = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      toast.success('Booking deleted');
      fetchBookings();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = async (id) => {
    try {
      await api.put(`/bookings/${id}`, { status: editedStatus });
      toast.success('Booking updated');
      setEditId(null);
      fetchBookings();
    } catch {
      toast.error('Update failed');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.classTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? b.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-8 text-white bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-400">Your Bookings</h1>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by class title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded bg-zinc-800 border border-gray-600 text-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full px-4 py-2 rounded bg-zinc-800 border border-gray-600 text-white"
        >
          <option value="">Filter by status</option>
          <option value="BOOKED">BOOKED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {/* Booking list */}
      <ul className="space-y-4">
        <AnimatePresence>
          {paginatedBookings.map((b) => (
            <motion.li
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-zinc-800 p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center shadow-md"
            >
              <div className="mb-2 md:mb-0 flex flex-col gap-1">
                <p className="font-bold text-lg text-green-300 flex items-center gap-2">
                  <FaDumbbell /> {b.classTitle}
                </p>
                <p className="text-sm text-gray-400">{new Date(b.bookedAt).toLocaleString()}</p>
                <p className="text-sm text-yellow-300 flex items-center gap-1">
                  <FaChalkboardTeacher /> Status: {b.status}
                </p>
                {b.feedback_score && (
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-sm ${
                          b.feedback_score >= star ? 'text-yellow-400' : 'text-gray-600'
                        }`}
                      />
                    ))}
                    <span className="text-gray-400 text-sm ml-2 italic">{b.feedback_text || ''}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
                {editId === b.id ? (
                  <>
                    <select
                      value={editedStatus}
                      onChange={(e) => setEditedStatus(e.target.value)}
                      className="px-2 py-1 rounded bg-zinc-700 text-white border border-gray-500"
                    >
                      <option value="BOOKED">BOOKED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                    <button
                      onClick={() => handleEdit(b.id)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : showConfirmId === b.id ? (
                  <>
                    <button
                      onClick={() => {
                        deleteBooking(b.id);
                        setShowConfirmId(null);
                      }}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setShowConfirmId(null)}
                      className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditId(b.id);
                        setEditedStatus(b.status);
                      }}
                      className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => setShowConfirmId(b.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                    {!b.feedback_score && (
                      <button
                        onClick={() => {
                          setSelectedBookingId(b.id);
                          setShowFeedbackModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                      >
                        ⭐ Leave Feedback
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-3 py-1 rounded ${
              currentPage === num ? 'bg-green-600 text-white' : 'bg-zinc-700 text-gray-300'
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        open={showFeedbackModal}
        bookingId={selectedBookingId}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={async (feedbackData) => {
          try {
            await submitFeedback(feedbackData);
            toast.success('Feedback submitted!');
            fetchBookings();
          } catch {
            toast.error('Failed to submit feedback');
          }
        }}
      />
    </div>
  );
};

export default BookingsPage;
