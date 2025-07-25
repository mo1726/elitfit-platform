import React, { useEffect, useState } from "react";
import api from "../../services/axiosConfig";
import { toast } from "react-toastify";

const formatDateTimeLocal = (dateStr) => dateStr ? dateStr.slice(0, 16) : "";

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    maxParticipants: "",
    trainerId: "",
  });
  const [trainers, setTrainers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchTrainers();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data);
    } catch {
      toast.error("Failed to load classes");
    }
  };

  const fetchTrainers = async () => {
    try {
      const res = await api.get("/trainers");
      setTrainers(res.data);
    } catch {
      toast.error("Failed to load trainers");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  // Validation simple côté client
  if (!formData.trainerId) {
    toast.error("Please select a trainer");
    setSubmitting(false);
    return;
  }

  try {
    if (editingClass) {
      await api.put(`/classes/${editingClass.id}`, formData);
      toast.success("Class updated!");
    } else {
      await api.post("/classes/admin", formData);
      toast.success("Class created!");
    }
    setShowForm(false);
    setEditingClass(null);
    setFormData({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      maxParticipants: "",
      trainerId: "",
    });
    fetchClasses();
  } catch {
    toast.error("Error saving class");
  } finally {
    setSubmitting(false);
  }
};

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setFormData({
      title: cls.title,
      description: cls.description,
      startTime: formatDateTimeLocal(cls.startTime),
      endTime: formatDateTimeLocal(cls.endTime),
      maxParticipants: cls.maxParticipants,
      trainerId: cls.trainerId || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/classes/${id}`);
      toast.success("Class deleted");
      fetchClasses();
    } catch {
      toast.error("Failed to delete class");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen text-white mx-auto shadow-xl ">
      <h2 className="text-4xl font-extrabold text-green-400 mb-8 drop-shadow-lg">
        Class Management
      </h2>

      <button
        onClick={() => setShowForm(!showForm)}
        className={`mb-6 px-6 py-3 rounded-lg font-bold transition
          ${showForm ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-black shadow-lg`}
      >
        {showForm ? "Cancel" : "Add New Class"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-10 bg-gray-800 rounded-xl p-6 shadow-lg space-y-6"
        >
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={submitting}
            className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-green-400 focus:ring-2 focus:ring-green-500"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            disabled={submitting}
            className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-green-400 focus:ring-2 focus:ring-green-500 resize-none"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              disabled={submitting}
              className="p-3 rounded-md bg-gray-700 text-white focus:outline-green-400 focus:ring-2 focus:ring-green-500"
            />
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              disabled={submitting}
              className="p-3 rounded-md bg-gray-700 text-white focus:outline-green-400 focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="number"
              name="maxParticipants"
              placeholder="Max Participants"
              value={formData.maxParticipants}
              onChange={handleChange}
              min="1"
              required
              disabled={submitting}
              className="p-3 rounded-md bg-gray-700 text-white focus:outline-green-400 focus:ring-2 focus:ring-green-500"
            />
            <select
              name="trainerId"
              value={formData.trainerId}
              onChange={handleChange}
              required
              disabled={submitting}
              className="p-3 rounded-md bg-gray-700 text-white focus:outline-green-400 focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Trainer</option>
              {trainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.userName} ({trainer.specialization})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-6 rounded-lg transition-shadow shadow-lg"
          >
            {submitting ? (editingClass ? "Updating..." : "Creating...") : (editingClass ? "Update Class" : "Create Class")}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-700">
        <table className="w-full table-auto border-collapse text-left text-gray-200">
          <thead className="bg-gray-800 text-gray-400 uppercase tracking-wide">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Trainer</th>
              <th className="p-4">Start Time</th>
              <th className="p-4">End Time</th>
              <th className="p-4">Max Participants</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No classes available.
                </td>
              </tr>
            )}
            {classes.map((cls) => (
              <tr
                key={cls.id}
                className="border-t border-gray-700 hover:bg-gray-700 cursor-pointer transition"
              >
                <td className="p-4">{cls.title}</td>
                <td className="p-4">{cls.trainerName || "N/A"}</td>
                <td className="p-4">{new Date(cls.startTime).toLocaleString()}</td>
                <td className="p-4">{new Date(cls.endTime).toLocaleString()}</td>
                <td className="p-4">{cls.maxParticipants}</td>
                <td className="p-4 space-x-3">
                  <button
                    onClick={() => handleEdit(cls)}
                    className="text-yellow-400 hover:text-yellow-300 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cls.id)}
                    className="text-red-500 hover:text-red-400 font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassManagement;
