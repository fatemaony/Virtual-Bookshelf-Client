import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import { AuthContext } from "../contexts/Context";

const ReviewsSection = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const { user } = useContext(AuthContext);
  const [newReview, setNewReview] = useState({ 
    name: user?.displayName || "", 
    rating: 0, 
    comment: "" 
  });
  const [editingId, setEditingId] = useState(null);

  // Load reviews from localStorage (or API in a real app)
  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem(`bookReviews_${bookId}`)) || [];
    setReviews(savedReviews);
  }, [bookId]);

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`bookReviews_${bookId}`, JSON.stringify(reviews));
  }, [reviews, bookId]);

  const handleSubmit = () => {
    if (!newReview.name || !newReview.rating || !newReview.comment) return;
    
    if (editingId) {
      // Update existing review
      setReviews(prev => 
        prev.map(review => 
          review.id === editingId ? { ...newReview, id: editingId } : review
        )
      );
      setEditingId(null);
    } else {
      // Add new review
      // Check if user already has a review for this book
      const existingReviewIndex = reviews.findIndex(r => r.userId === user?.uid);
      if (existingReviewIndex >= 0) {
        // Replace existing review
        const updatedReviews = [...reviews];
        updatedReviews[existingReviewIndex] = { 
          ...newReview, 
          id: reviews[existingReviewIndex].id,
          userId: user?.uid 
        };
        setReviews(updatedReviews);
      } else {
        // Add new review
        setReviews(prev => [
          ...prev, 
          { 
            ...newReview, 
            id: Date.now(), 
            userId: user?.uid 
          }
        ]);
      }
    }
    
    setNewReview({ name: user?.displayName || "", rating: 0, comment: "" });
    document.getElementById("review_modal").close();
  };

  const handleEdit = (review) => {
    setNewReview({
      name: review.name,
      rating: review.rating,
      comment: review.comment
    });
    setEditingId(review.id);
    document.getElementById("review_modal").showModal();
  };

  const handleDelete = (id) => {
    setReviews(prev => prev.filter(review => review.id !== id));
  };

  const userReview = reviews.find(review => review.userId === user?.uid);

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
                reviews.reduce((sum, review) => sum + review.rating, 0) / 
                reviews.length
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
                      reviews.reduce((sum, review) => sum + review.rating, 0) / 
                      reviews.length
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
            className="btn bg-red-900 text-white gap-2"
            onClick={() => {
              if (userReview) {
                handleEdit(userReview);
              } else {
                setNewReview({ 
                  name: user.displayName || "", 
                  rating: 0, 
                  comment: "" 
                });
                setEditingId(null);
                document.getElementById("review_modal").showModal();
              }
            }}
          >
            <MdRateReview className="text-xl" /> 
            {userReview ? "Edit Your Review" : "Write a Review"}
          </button>
        ) : (
          <button 
            className="btn bg-red-900 text-white gap-2"
            onClick={() => document.getElementById("auth_modal").showModal()}
          >
            <MdRateReview className="text-xl" /> 
            Sign in to review
          </button>
        )}
      </div>

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
                <th>Name</th>
                <th>Rating</th>
                <th>Comment</th>
                {user && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.name}</td>
                  <td className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <FaStar key={i} className="text-amber-500" />
                    ))}
                  </td>
                  <td>{review.comment}</td>
                  {user && (
                    <td>
                      {review.userId === user.uid && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(review)}
                            className="btn btn-ghost btn-sm text-blue-600"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleDelete(review.id)}
                            className="btn btn-ghost btn-sm text-red-600"
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
            No reviews yet. Be the first to review!
          </div>
        )}
      </motion.div>

      {/* Review Modal */}
      <dialog id="review_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4 text-red-800">
            {editingId ? "Edit Your Review" : "Write Your Review"}
          </h3>

          <textarea
            placeholder="Write your comment"
            className="textarea textarea-bordered w-full mb-3"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            rows={4}
          />

          <div className="flex gap-2 mb-4 items-center">
            <span className="font-medium">Rating:</span>
            {[1, 2, 3, 4, 5].map((num) => (
              <FaStar
                key={num}
                className={`cursor-pointer text-2xl ${
                  newReview.rating >= num ? "text-amber-500" : "text-gray-400"
                }`}
                onClick={() => setNewReview({ ...newReview, rating: num })}
              />
            ))}
          </div>

          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button 
                className="btn btn-outline btn-neutral"
                onClick={() => {
                  setNewReview({ name: "", rating: 0, comment: "" });
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSubmit} 
                className="btn btn-error text-white"
                disabled={!newReview.rating || !newReview.comment}
              >
                {editingId ? "Update" : "Submit"}
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default ReviewsSection;