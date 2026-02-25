import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  deleteFeedbackAdmin,
  editFeedbackAdmin,
  getAllFeedbacksAdmin,
} from "../api/auth-api";
import Footer1 from "../components/Footer1";

const GetAllFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    feedback: "",
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await getAllFeedbacksAdmin();
      setFeedbacks(res);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch feedbacks", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This feedback will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteFeedbackAdmin(id);

      setFeedbacks((prev) => prev.filter((fb) => fb._id !== id));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Feedback deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", "Failed to delete feedback", "error");
    }
  };

  const openEditModal = (fb) => {
    setSelectedFeedback(fb);
    setEditData({
      name: fb.name,
      email: fb.email,
      feedback: fb.feedback,
    });
  };

  const handleUpdate = async () => {
    if (!editData.name || !editData.email || !editData.feedback) {
      Swal.fire("Warning", "All fields are required!", "warning");
      return;
    }

    try {
      await editFeedbackAdmin(selectedFeedback._id, editData);

      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb._id === selectedFeedback._id
            ? { ...fb, ...editData }
            : fb
        )
      );

      setSelectedFeedback(null);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Feedback updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", "Failed to update feedback", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading)
    return <p className="text-center mt-10">Loading...</p>;

return (
  <div className="min-h-screen flex flex-col">

    {/* Main Content */}
    <div className="flex-grow p-4 w-full">

      <h2 className="text-xl font-semibold mb-4 text-center">
        All User Feedbacks
      </h2>

      {feedbacks.length === 0 ? (
        <p className="text-center">No feedbacks found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 whitespace-nowrap">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Feedback</th>
                <th className="border px-4 py-2">Created At</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((fb, idx) => (
                <tr key={fb._id}>
                  <td className="border px-3 py-2">{idx + 1}</td>
                  <td className="border px-3 py-2">{fb.name}</td>
                  <td className="border px-3 py-2">{fb.email}</td>
                  <td className="border px-3 py-2">{fb.feedback}</td>
                  <td className="border px-3 py-2">
                    {new Date(fb.createdAt).toLocaleString()}
                  </td>
                  <td className="border px-3 py-2 space-x-2">
                    <button
                      onClick={() => openEditModal(fb)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(fb._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm"
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

      {/* Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Edit Feedback
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Feedback
                </label>
                <textarea
                  name="feedback"
                  value={editData.feedback}
                  onChange={handleChange}
                  rows="6"
                  className="w-full border p-3 rounded-lg resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedFeedback(null)}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-5 py-2 bg-green-600 text-white rounded-lg"
              >
                Update Feedback
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

    {/* Footer Always Bottom */}
    <Footer1 />

  </div>
);
};

export default GetAllFeedbacks;