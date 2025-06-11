import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import { AuthContext } from "../contexts/Context";

const ReviewsSection = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const { user } = useContext(AuthContext);
  const [newReview, setNewReview] = useState({ rating: 0, review_text: "" });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!bookId) return;
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/reviews?book_id=${bookId}`);
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [bookId]);

  const handleSubmit = async () => {
    if (!newReview.rating || !newReview.review_text) {
      setError("Please provide both rating and review text");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      if (editingId) {
        const response = await fetch(`http://localhost:3000/reviews/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            review_text: newReview.review_text,
            rating: newReview.rating
          })
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update review');
        }
        const updatedReview = await response.json();
        setReviews(prev => prev.map(review => review._id === editingId ? updatedReview : review));
        setEditingId(null);
      } else {
        const response = await fetch('http://localhost:3000/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            book_id: bookId,
            user_email: user.email,
            review_text: newReview.review_text,
            rating: newReview.rating
          })
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create review');
        }
        const createdReview = await response.json();
        setReviews(prev => [...prev, createdReview]);
      }
      setNewReview({ rating: 0, review_text: "" });
      document.getElementById("review_modal").close();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (review) => {
    setNewReview({
      rating: review.rating,
      review_text: review.review_text
    });
    setEditingId(review._id);
    setError(null);
    document.getElementById("review_modal").showModal();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete review');
      }
      setReviews(prev => prev.filter(review => review._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewReview = () => {
    setNewReview({ rating: 0, review_text: "" });
    setEditingId(null);
    setError(null);
    document.getElementById("review_modal").showModal();
  };

  const handleCloseModal = () => {
    setNewReview({ rating: 0, review_text: "" });
    setEditingId(null);
    setError(null);
    document.getElementById("review_modal").close();
  };

  const userReview = reviews.find(review => review.user_email === user?.email);

  if (isLoading && reviews.length === 0) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-bold text-center text-red-900 mb-6"
      >
        Rating & Reviews
      </motion.h1>

      <div className="flex justify-center items-center gap-4 mb-8">
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              {(
                reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length
              ).toFixed(1)}
            </span>
            <div className="rating rating-md">
              {[1, 2, 3, 4, 5].map((num) => (
                <input
                  key={num}
                  type="radio"
                  className="mask mask-star-2 bg-amber-500"
                  checked={
                    Math.round(
                      reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length
                    ) === num
                  }
                  readOnly
                />
              ))}
            </div>
            <span className="text-lg">({reviews.length} reviews)</span>
          </div>
        )}

        {user ? (
          <button
            className="btn bg-red-900 text-white gap-2 hover:bg-red-800"
            onClick={() => userReview ? handleEdit(userReview) : handleNewReview()}
          >
            <MdRateReview className="text-xl" />
            {userReview ? "Edit Your Review" : "Write a Review"}
          </button>
        ) : (
          <button
            className="btn bg-red-900 text-white gap-2 hover:bg-red-800"
            onClick={() => alert("Please sign in to write a review")}
          >
            <MdRateReview className="text-xl" />
            Sign in to review
          </button>
        )}
      </div>

      {error && !document.getElementById("review_modal").open && (
        <div className="alert alert-error mb-4 max-w-4xl mx-auto">
          <span>{error}</span>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="overflow-x-auto w-full max-w-4xl mx-auto"
      >
        {reviews.length > 0 ? (
          <table className="table table-zebra">
            <thead>
              <tr className="text-lg text-red-800">
                <th>User</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Date</th>
                {user && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td className="font-medium">{review.user_email}</td>
                  <td>
                    <div className="flex gap-1">
                      {[...Array(review.rating || 0)].map((_, i) => (
                        <FaStar key={i} className="text-amber-500" />
                      ))}
                      {[...Array(5 - (review.rating || 0))].map((_, i) => (
                        <FaStar key={i + (review.rating || 0)} className="text-gray-300" />
                      ))}
                    </div>
                  </td>
                  <td className="max-w-xs">
                    <div className="truncate" title={review.review_text}>
                      {review.review_text}
                    </div>
                  </td>
                  <td>{new Date(review.created_at).toLocaleDateString()}</td>
                  {user && (
                    <td>
                      {review.user_email === user.email && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(review)}
                            className="btn btn-ghost btn-sm text-blue-600 hover:bg-blue-100"
                            title="Edit review"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
                            className="btn btn-ghost btn-sm text-red-600 hover:bg-red-100"
                            title="Delete review"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-lg text-gray-500">
            No reviews yet. Be the first to review this book!
          </div>
        )}
      </motion.div>

      {/* Review Modal */}
      <dialog id="review_modal" className="modal">
        <div className="modal-box max-w-2xl relative">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-gray-600 hover:text-red-600"
            onClick={handleCloseModal}
            title="Close"
          >
            ✕
          </button>

          <h3 className="font-bold text-lg mb-4 text-red-800">
            {editingId ? "Edit Your Review" : "Write Your Review"}
          </h3>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-medium">Your Review</span>
            </label>
            <textarea
              placeholder="Share your thoughts about this book..."
              className="textarea textarea-bordered w-full"
              value={newReview.review_text}
              onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
              rows={4}
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-medium">Rating</span>
            </label>
            <div className="flex gap-2 items-center">
              {[1, 2, 3, 4, 5].map((num) => (
                <FaStar
                  key={num}
                  className={`cursor-pointer text-2xl transition-colors ${
                    newReview.rating >= num ? "text-amber-500" : "text-gray-400"
                  }`}
                  onClick={() => setNewReview({ ...newReview, rating: num })}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {newReview.rating > 0 ? `${newReview.rating} star${newReview.rating > 1 ? 's' : ''}` : 'No rating'}
              </span>
            </div>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-error text-white"
              disabled={!newReview.rating || !newReview.review_text.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Processing...
                </>
              ) : editingId ? "Update Review" : "Submit Review"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ReviewsSection;
