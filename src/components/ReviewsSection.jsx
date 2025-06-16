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
        const response = await fetch(`https://virtual-bookshelf-server-chi.vercel.app/reviews?book_id=${bookId}`);
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
        const response = await fetch(`https://virtual-bookshelf-server-chi.vercel.app/reviews/${editingId}`, {
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
        const response = await fetch('https://virtual-bookshelf-server-chi.vercel.app/reviews', {
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
      const response = await fetch(`https://virtual-bookshelf-server-chi.vercel.app/reviews/${id}`, {
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
    <div className="px-2 sm:px-4 py-4 sm:py-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-red-900 mb-4 sm:mb-6"
      >
        Rating & Reviews
      </motion.h1>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <span className="text-xl sm:text-2xl font-bold">
              {(
                reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length
              ).toFixed(1)}
            </span>
            <div className="rating rating-sm sm:rating-md">
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
            <span className="text-sm sm:text-lg">({reviews.length} reviews)</span>
          </div>
        )}

        {user ? (
          <button
            className="btn btn-sm sm:btn-md bg-red-900 text-white gap-1 sm:gap-2 hover:bg-red-800 text-xs sm:text-sm"
            onClick={() => userReview ? handleEdit(userReview) : handleNewReview()}
          >
            <MdRateReview className="text-base sm:text-xl" />
            <span className="hidden sm:inline">{userReview ? "Edit Your Review" : "Write a Review"}</span>
            <span className="sm:hidden">{userReview ? "Edit" : "Review"}</span>
          </button>
        ) : (
          <button
            className="btn btn-sm sm:btn-md bg-red-900 text-white gap-1 sm:gap-2 hover:bg-red-800 text-xs sm:text-sm"
            onClick={() => alert("Please sign in to write a review")}
          >
            <MdRateReview className="text-base sm:text-xl" />
            <span className="hidden sm:inline">Sign in to review</span>
            <span className="sm:hidden">Sign in</span>
          </button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mx-auto"
      >
        {reviews.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
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
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="card bg-base-100 shadow-md border">
                  <div className="card-body p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <div className="font-medium text-sm sm:text-base truncate">
                        {review.user_email}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[...Array(review.rating || 0)].map((_, i) => (
                            <FaStar key={i} className="text-amber-500 text-sm" />
                          ))}
                          {[...Array(5 - (review.rating || 0))].map((_, i) => (
                            <FaStar key={i + (review.rating || 0)} className="text-gray-300 text-sm" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm sm:text-base text-gray-700 mb-3 leading-relaxed">
                      {review.review_text}
                    </div>
                    
                    {user && review.user_email === user.email && (
                      <div className="flex gap-2 pt-2 border-t">
                        <button
                          onClick={() => handleEdit(review)}
                          className="btn btn-ghost btn-xs sm:btn-sm text-blue-600 hover:bg-blue-100 flex-1 sm:flex-none"
                          title="Edit review"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(review._id)}
                          className="btn btn-ghost btn-xs sm:btn-sm text-red-600 hover:bg-red-100 flex-1 sm:flex-none"
                          title="Delete review"
                        >
                          <FaTrash className="mr-1" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-base sm:text-lg text-gray-500">
            No reviews yet. Be the first to review this book!
          </div>
        )}
      </motion.div>

      {/* Review Modal */}
      <dialog id="review_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl mx-auto relative">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-gray-600 hover:text-red-600"
            onClick={handleCloseModal}
            title="Close"
          >
            ✕
          </button>

          <h3 className="font-bold text-lg mb-4 text-red-800 pr-8">
            {editingId ? "Edit Your Review" : "Write Your Review"}
          </h3>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-medium">Your Review</span>
            </label>
            <textarea
              placeholder="Share your thoughts about this book..."
              className="textarea textarea-bordered w-full text-sm sm:text-base"
              value={newReview.review_text}
              onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
              rows={4}
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-medium">Rating</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className="flex gap-1 sm:gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <FaStar
                    key={num}
                    className={`cursor-pointer text-xl sm:text-2xl transition-colors ${
                      newReview.rating >= num ? "text-amber-500" : "text-gray-400"
                    }`}
                    onClick={() => setNewReview({ ...newReview, rating: num })}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {newReview.rating > 0 ? `${newReview.rating} star${newReview.rating > 1 ? 's' : ''}` : 'No rating'}
              </span>
            </div>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="modal-action flex-col sm:flex-row gap-2">
            <button
              type="button"
              className="btn btn-outline w-full sm:w-auto order-2 sm:order-1"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-error text-white w-full sm:w-auto order-1 sm:order-2"
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