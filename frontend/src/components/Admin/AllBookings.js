import React, { useEffect, useState, useMemo } from "react";
import { getAllBookings, deleteBooking } from "../../services/bookingService";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();
      setBookings(res.data);
    } catch {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBooking(id);
        setBookings((prev) => prev.filter((b) => b.id !== id));
        toast.success("Booking deleted");
      } catch {
        toast.error("Failed to delete booking");
      }
    }
  };

  // Filter bookings by classTitle or userName (case-insensitive)
  const filteredBookings = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return bookings;
    return bookings.filter(
      (b) =>
        (b.classTitle && b.classTitle.toLowerCase().includes(term)) ||
        (b.userName && b.userName.toLowerCase().includes(term))
    );
  }, [bookings, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE);

  // Slice bookings for current page
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredBookings.slice(start, start + PAGE_SIZE);
  }, [filteredBookings, currentPage]);

  // Reset to first page if filtering reduces pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white text-xl">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen text-white mx-auto shadow-xl ">
      <h2 className="text-3xl font-extrabold text-green-400 mb-6 drop-shadow-lg">
        All Bookings
      </h2>

      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Search by class or user name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md bg-gray-800 text-white placeholder-gray-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          aria-label="Search bookings"
        />
      </div>

      {paginatedBookings.length === 0 ? (
        <p className="text-gray-400 text-center">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-700">
          <table className="w-full table-auto border-collapse text-left text-gray-200">
            <thead className="bg-gray-800 text-gray-400 uppercase tracking-wide">
              <tr>
                <th className="p-4">Class</th>
                <th className="p-4">User Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-gray-700 hover:bg-gray-700 cursor-default transition"
                >
                  <td className="p-4">{b.classTitle || "N/A"}</td>
                  <td className="p-4">{b.userName || "N/A"}</td>
                  <td className="p-4 capitalize">{b.status || "N/A"}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                      title="Delete Booking"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex justify-center mt-8 space-x-2 select-none"
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-gray-700 cursor-not-allowed text-gray-400"
                : "bg-green-600 hover:bg-green-700 text-white"
            } transition`}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                aria-current={currentPage === page ? "page" : undefined}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-green-400 text-black font-bold shadow-lg"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                } transition`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-700 cursor-not-allowed text-gray-400"
                : "bg-green-600 hover:bg-green-700 text-white"
            } transition`}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
};

export default AllBookings;
