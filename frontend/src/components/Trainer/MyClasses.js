import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { getTrainerClasses, createClass, updateClass, deleteClass } from "../../services/classService";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

Modal.setAppElement("#root"); // IMPORTANT for accessibility; adjust '#root' if needed

const formatDateTimeLocal = (dateString) => dateString ? dateString.slice(0,16) : "";

const MyClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    maxParticipants: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await getTrainerClasses();
      setClasses(res.data);
    } catch {
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  const openModalForCreate = () => {
    setEditingClass(null);
    setFormData({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      maxParticipants: "",
    });
    setModalIsOpen(true);
  };

  const openModalForEdit = (cls) => {
    setEditingClass(cls);
    setFormData({
      title: cls.title,
      description: cls.description,
      startTime: formatDateTimeLocal(cls.startTime),
      endTime: formatDateTimeLocal(cls.endTime),
      maxParticipants: cls.maxParticipants.toString(),
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    if (!submitting) {
      setModalIsOpen(false);
      setEditingClass(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, startTime, endTime, maxParticipants } = formData;
    if (!title || !description || !startTime || !endTime || !maxParticipants) {
      toast.warning("Please fill all fields");
      return;
    }
    setSubmitting(true);
    try {
      if (editingClass) {
        await updateClass(editingClass.id, formData);
        toast.success("Class updated successfully");
      } else {
        await createClass(formData);
        toast.success("Class created successfully");
      }
      closeModal();
      fetchClasses();
    } catch {
      toast.error("Error saving class");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await deleteClass(id);
        toast.success("Class deleted successfully");
        fetchClasses();
      } catch {
        toast.error("Failed to delete class");
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white text-xl font-semibold">
      Loading classes...
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white  mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-5xl font-extrabold text-green-400 tracking-wide drop-shadow-lg">
          My Classes
        </h1>
        <button
          onClick={openModalForCreate}
          className="flex items-center gap-3 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-500 rounded-full px-6 py-3 shadow-lg font-semibold text-lg transition"
          aria-label="Add New Class"
        >
          <FaPlus size={20} /> Add New Class
        </button>
      </header>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-700">
        <table className="w-full text-left table-auto border-collapse text-gray-300">
          <thead className="bg-gray-800 uppercase tracking-wider text-gray-400">
            <tr>
              <th className="p-4 border-b border-gray-700">Title</th>
              <th className="p-4 border-b border-gray-700">Description</th>
              <th className="p-4 border-b border-gray-700">Start Time</th>
              <th className="p-4 border-b border-gray-700">End Time</th>
              <th className="p-4 border-b border-gray-700">Max Participants</th>
              <th className="p-4 border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500 font-semibold">
                  No classes found.
                </td>
              </tr>
            ) : (
              classes.map((cls, idx) => (
                <tr
                  key={cls.id}
                  className={`border-b border-gray-700 cursor-default hover:bg-gray-700 transition ${idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}`}
                >
                  <td className="p-4">{cls.title}</td>
                  <td className="p-4 line-clamp-2 max-w-xs">{cls.description}</td>
                  <td className="p-4">{new Date(cls.startTime).toLocaleString()}</td>
                  <td className="p-4">{new Date(cls.endTime).toLocaleString()}</td>
                  <td className="p-4">{cls.maxParticipants}</td>
                  <td className="p-4 flex gap-4">
                    <button
                      onClick={() => openModalForEdit(cls)}
                      className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold transition"
                      aria-label={`Edit class ${cls.title}`}
                    >
                      <FaEdit size={18} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cls.id)}
                      className="flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold transition"
                      aria-label={`Delete class ${cls.title}`}
                    >
                      <FaTrash size={18} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="max-w-xl mx-auto bg-gray-900 rounded-3xl p-8 outline-none shadow-lg relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
        shouldCloseOnOverlayClick={!submitting}
        shouldCloseOnEsc={!submitting}
      >
        <h2 className="text-3xl font-bold text-green-400 mb-6">
          {editingClass ? "Edit Class" : "Add New Class"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="title"
            placeholder="Class Title"
            value={formData.title}
            onChange={handleChange}
            disabled={submitting}
            required
            autoFocus
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-green-400 focus:ring-2 focus:ring-green-500 transition"
          />
          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            disabled={submitting}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-green-400 focus:ring-2 focus:ring-green-500 transition resize-none"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              disabled={submitting}
              required
              className="p-3 rounded-lg bg-gray-800 text-white focus:outline-green-400 focus:ring-2 focus:ring-green-500 transition"
            />
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              disabled={submitting}
              required
              className="p-3 rounded-lg bg-gray-800 text-white focus:outline-green-400 focus:ring-2 focus:ring-green-500 transition"
            />
          </div>
          <input
            type="number"
            name="maxParticipants"
            placeholder="Max Participants"
            min={1}
            value={formData.maxParticipants}
            onChange={handleChange}
            disabled={submitting}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-green-400 focus:ring-2 focus:ring-green-500 transition"
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={closeModal}
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 font-semibold text-black transition"
            >
              {submitting ? "Saving..." : editingClass ? "Update Class" : "Create Class"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyClasses;
