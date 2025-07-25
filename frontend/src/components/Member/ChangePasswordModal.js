import React, { useState } from "react";
import { changePassword } from "../../services/userService";
import { toast } from "react-toastify";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await changePassword({ newPassword, confirmPassword });
      toast.success("Password changed successfully");
      handleClose();
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded shadow-lg w-80 space-y-4"
      >
        <h2 className="text-green-400 text-xl font-bold">Change Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />
        <div className="flex justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordModal;
