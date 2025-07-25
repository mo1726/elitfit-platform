import React, { useEffect, useState } from "react";
import api from "../../services/axiosConfig";
import { toast } from "react-toastify";

const MemberSubscriptions = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/member/active");
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Filter members with endDate within the next 7 days (including today)
      const filtered = res.data.filter((member) => {
        if (!member.endDate) return false;
        const endDate = new Date(member.endDate);
        endDate.setHours(0, 0, 0, 0);

        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
      });

      setMembers(filtered);
    } catch (err) {
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white text-xl font-semibold">
        Loading members...
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-r from-gray-900 via-black to-gray-900 min-h-screen  mx-auto  shadow-lg">
      <h2 className="text-4xl font-extrabold text-green-500 mb-8 drop-shadow-lg">
        Members Nearing Expiry <span className="text-yellow-400">(7 days left)</span>
      </h2>

      {members.length === 0 ? (
        <p className="text-gray-400 text-center text-lg mt-12">
          No members with subscriptions expiring in the next 7 days.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-700 shadow-md">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                {["User ID", "Start Date", "End Date", "Days Left", "Active"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-gray-900 divide-y divide-gray-700">
              {members.map((m) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const endDate = new Date(m.endDate);
                endDate.setHours(0, 0, 0, 0);
                const diffDays = Math.ceil(
                  (endDate - today) / (1000 * 60 * 60 * 24)
                );

                return (
                  <tr
                    key={m.id}
                    className="hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{m.userId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{m.startDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{m.endDate}</td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap font-semibold ${
                        diffDays <= 3 ? "text-red-400" : "text-yellow-400"
                      }`}
                    >
                      {diffDays >= 0 ? `${diffDays} Left` : "Expired"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {m.active ? (
                        <span className="bg-green-600 text-green-100 px-3 py-1 rounded-full text-sm font-semibold">
                          Yes
                        </span>
                      ) : (
                        <span className="bg-red-600 text-red-100 px-3 py-1 rounded-full text-sm font-semibold">
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MemberSubscriptions;
