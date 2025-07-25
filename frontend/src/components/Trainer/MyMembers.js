import React, { useEffect, useState } from "react";
import api from "../../services/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getPlanByMemberId } from "../../services/dietService";

const PAGE_SIZE = 6;

const MyMembers = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    applySearchFilter();
  }, [searchTerm, members]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/trainers/members");
      setMembers(res.data);
      setFilteredMembers(res.data);
    } catch (error) {
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  const applySearchFilter = () => {
    if (!searchTerm.trim()) {
      setFilteredMembers(members);
      setCurrentPage(1);
      return;
    }
    const filtered = members.filter((m) =>
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.membershipPlanName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(filtered);
    setCurrentPage(1);
  };

  const handleDietRedirect = async (memberId) => {
  try {
    const res = await getPlanByMemberId(memberId);
    console.log("Diet plan check response for member:", memberId, res?.data);

    if (res?.data?.id) {
      navigate(`/edit-diet/${res.data.id}`);
    } else {
      navigate(`/create-diet/${memberId}`);
    }
  } catch (err) {
    console.error("Error checking diet plan", err);
    toast.error("Couldn't load diet plan.");
    navigate(`/create-diet/${memberId}`);
  }
};


  const totalPages = Math.ceil(filteredMembers.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentPageMembers = filteredMembers.slice(startIndex, startIndex + PAGE_SIZE);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white text-2xl font-semibold">
        Loading members...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black px-8 py-12 text-white mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-5xl font-extrabold text-green-400 tracking-widest drop-shadow-lg">
          My Members
        </h1>
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-700 rounded-full px-6 py-3 shadow-lg font-semibold text-lg select-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-3-3.87M12 12a4 4 0 110-8 4 4 0 010 8zM8 7v6a4 4 0 003 3.87" />
          </svg>
          <span>{members.length} {members.length === 1 ? "Member" : "Members"}</span>
        </div>
      </header>

      <div className="mb-8 max-w-md mx-auto sm:mx-0">
        <input
          type="text"
          placeholder="Search by name, email, or plan..."
          className="w-full p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredMembers.length === 0 ? (
        <p className="text-gray-400 text-center text-xl mt-24">No members matched your search.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPageMembers.map((member) => (
              <div
                key={member.id}
                className="bg-gray-850 bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg transition-transform transform"
              >
                <div className="flex items-center space-x-4 mb-5">
                  <div className="flex-shrink-0 rounded-full bg-gradient-to-tr from-green-400 to-blue-600 p-2">
                    <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-3xl font-bold text-white select-none">
                      {member.name
                        ? member.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                        : "NA"}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{member.name || "No Name"}</h2>
                    <p className="text-green-400 font-medium">{member.email}</p>
                  </div>
                </div>

                <div className="space-y-3 text-gray-300 mb-4">
                  <div><span className="font-semibold text-white">Plan:</span> {member.membershipPlanName || "None"}</div>
                  <div><span className="font-semibold text-white">Status:</span> <span className={member.active ? "text-green-400" : "text-red-500"}>{member.active ? "Active" : "Inactive"}</span></div>
                  <div><span className="font-semibold text-white">Start Date:</span> {member.startDate || "N/A"}</div>
                  <div><span className="font-semibold text-white">End Date:</span> {member.endDate || "N/A"}</div>
                  <div><span className="font-semibold text-white">User ID:</span> {member.userId}</div>
                </div>

                <button
                  onClick={() => handleDietRedirect(member.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mt-2 transition"
                >
                  🍽️ Manage Diet Plan
                </button>
              </div>
            ))}
          </div>

          {filteredMembers.length > PAGE_SIZE && (
            <div className="flex justify-center mt-12 gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-5 py-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition"
              >
                Previous
              </button>
              <span className="text-white font-semibold flex items-center">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-5 py-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyMembers;
