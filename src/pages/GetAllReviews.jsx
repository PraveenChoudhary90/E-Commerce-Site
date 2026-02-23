import React, { useEffect, useState } from "react";
import PageLoader from "../components/ui/PageLoader";
import Swal from "sweetalert2";
import {
  deleteReviewAdmin,
  editReviewAdmin,
  getAllReviewsAdmin,
} from "../api/auth-api";

const GetAllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState("all");

  const [selectedReview, setSelectedReview] = useState(null);
  const [editData, setEditData] = useState({ rating: "", comment: "" });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await getAllReviewsAdmin();
      if (res.success) setReviews(res.reviews);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId, reviewId) => {
    const confirm = await Swal.fire({
      title: "Delete Review?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await deleteReviewAdmin(productId, reviewId);
      if (res.success) {
        setReviews((prev) =>
          prev.filter((rev) => rev.reviewId !== reviewId)
        );
        Swal.fire("Deleted!", "Review deleted successfully", "success");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to delete review", "error");
    }
  };

  const openEditModal = (review) => {
    setSelectedReview(review);
    setEditData({
      rating: review.rating,
      comment: review.comment,
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await editReviewAdmin(
        selectedReview.productId,
        selectedReview.reviewId,
        editData
      );

      if (res.success) {
        setReviews((prev) =>
          prev.map((rev) =>
            rev.reviewId === selectedReview.reviewId
              ? { ...rev, ...editData }
              : rev
          )
        );
        setSelectedReview(null);
        Swal.fire("Updated!", "Review updated successfully", "success");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update review", "error");
    }
  };

  if (loading) return <PageLoader />;

  const filteredReviews =
    filterRating === "all"
      ? reviews
      : reviews.filter((r) => r.rating === Number(filterRating));

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">All Product Reviews</h1>

      {/* Rating Filter */}
      <div className="flex gap-4 mb-4">
        <select
          className="p-2 border border-gray-300 rounded"
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Reviews Table */}
      {filteredReviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-center">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">User</th>
                <th className="border px-4 py-2">Rating</th>
                <th className="border px-4 py-2">Comment</th>
                <th className="border px-4 py-2">Avatar</th>
                <th className="border px-4 py-2">Created At</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((rev, idx) => (
                <tr key={rev.reviewId}>
                  <td className="border px-2 py-1">{idx + 1}</td>
                  <td className="border px-2 py-1">{rev.productName}</td>
                  <td className="border px-2 py-1">{rev.username}</td>
                  <td className="border px-2 py-1">{rev.rating} ⭐</td>
                  <td className="border px-2 py-1">{rev.comment}</td>
                  <td className="border px-2 py-1">
                    {rev.avatar ? (
                      <img
                        src={rev.avatar}
                        alt={rev.username}
                        className="w-10 h-10 rounded object-cover mx-auto"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="border px-2 py-1">
                    {new Date(rev.createdAt).toLocaleString()}
                  </td>
                  <td className="border px-2 py-1 space-x-2">
                    <button
                      onClick={() => openEditModal(rev)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(rev.productId, rev.reviewId)
                      }
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

      {/* Edit Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Review</h2>

            <input
              type="number"
              min="1"
              max="5"
              value={editData.rating}
              onChange={(e) =>
                setEditData({ ...editData, rating: e.target.value })
              }
              className="w-full border p-2 rounded mb-3"
            />

            <textarea
              value={editData.comment}
              onChange={(e) =>
                setEditData({ ...editData, comment: e.target.value })
              }
              className="w-full border p-2 rounded mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllReviews;