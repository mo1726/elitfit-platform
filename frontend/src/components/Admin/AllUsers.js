import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../../services/userService';
import { toast } from 'react-toastify';

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers()
      .then(res => setUsers(res.data))
      .catch(() => toast.error('Failed to fetch users'));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user?')) {
      try {
        await deleteUser(id);
        setUsers(prev => prev.filter(u => u.id !== id));
        toast.success('User deleted');
      } catch {
        toast.error('Failed to delete user');
      }
    }
  };

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h2 className="text-2xl font-bold text-green-400 mb-4">All Users</h2>
      <ul className="space-y-4">
        {users.map(u => (
          <li key={u.id} className="bg-gray-800 p-4 rounded">
            <p><strong>Name:</strong> {u.name}</p>
            <p><strong>Email:</strong> {u.email}</p>
            <p><strong>Role:</strong> {u.role}</p>
            <button onClick={() => handleDelete(u.id)} className="text-red-400 mt-2">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllUsers;