import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../../assets/logo.png";
import { HiMenuAlt3, HiOutlineX } from "react-icons/hi";

const RoleNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let role = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.role) {
        role = decoded.role;
      } else if (Array.isArray(decoded.roles)) {
        role = decoded.roles[0];
      }
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  const getRoleLabel = () => {
    if (!role) return null;
    const normalized = role.toUpperCase();
    if (normalized.includes("ADMIN")) return "Admin";
    if (normalized.includes("TRAINER")) return "Trainer";
    if (normalized.includes("MEMBER")) return "Member";
    return null;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white shadow-md px-6 py-4 flex items-center justify-between relative z-50">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-90 transition-opacity duration-300"
          >
            <img
              src={logo}
              alt="Elitfit Logo"
              className="h-20 w-20 rounded-lg"
              style={{ filter: "invert(1)" }}
            />
          </Link>
          {getRoleLabel() && (
            <span className="ml-2 px-3 py-1 text-xs font-semibold bg-green-700/30 text-green-300 rounded-full border border-green-400 select-none">
              {getRoleLabel()}
            </span>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Avatar Dropdown (Desktop) */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="focus:outline-none hover:scale-110 transition-transform duration-300 rounded-full ring-2 ring-green-400 ring-offset-2 ring-offset-zinc-900"
              aria-label="User menu"
            >
              <img
                src="https://i.pravatar.cc/40?img=21"
                alt="avatar"
                className="w-11 h-11 rounded-full border-2 border-green-400 shadow-lg"
                draggable={false}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-zinc-900 text-white border border-green-600 rounded-2xl shadow-2xl backdrop-blur-lg animate-fadeIn z-50 overflow-hidden">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-green-700/40 transition-colors duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  👤 Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 text-left px-5 py-3 text-sm hover:bg-red-700/40 text-red-500 transition-colors duration-200"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden relative z-[10001]">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded-md hover:bg-green-700/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              {mobileOpen ? (
                <HiOutlineX size={30} className="text-green-400" />
              ) : (
                <HiMenuAlt3 size={30} className="text-green-400" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)} // Close on outside click
        >
          <div
            className="fixed top-0 right-0 w-64 h-full bg-zinc-900 shadow-lg p-6 z-[10000] flex flex-col"
            onClick={(e) => e.stopPropagation()} // Keep open on drawer click
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-bold select-none">Menu</h2>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="p-2 rounded-md hover:bg-zinc-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <HiOutlineX size={24} className="text-white" />
              </button>
            </div>
            <ul className="space-y-4 text-green-400 flex flex-col flex-grow">
              <li>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 rounded hover:bg-green-700/50 transition-colors duration-200"
                >
                  👤 Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded text-red-400 hover:bg-red-700/40 transition-colors duration-200"
                >
                  🚪 Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tailwind animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style>
    </>
  );
};

export default RoleNavbar;
