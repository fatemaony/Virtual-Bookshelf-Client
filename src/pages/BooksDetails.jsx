import React, { use, useState } from "react";
import { useLoaderData } from "react-router";
import { FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import useBookUpvote from "../components/UseBookUpvote";
import ReviwsSection from "../components/ReviewsSection";
import { AuthContext } from "../contexts/Context";
import { toast } from "react-toastify";

const BookDetails = () => {
  const initialBookData = useLoaderData();
  const { user } = use(AuthContext);
  const [bookdata, setBookdata] = useState(initialBookData);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const {
    _id,
    book_title,
    cover_photo,
    book_author,
    total_page,
    book_category,
    reading_status,
    book_overview,
    upvote,
    user_email
  } = bookdata;

  const {
    upvoteBook,
    getUpvoteCount,
    hasUserUpvoted,
    isUpvoting
  } = useBookUpvote();

  const isOwner = user?.email === user_email;

  const handleUpvote = async () => {
    try {
      await upvoteBook(_id, bookdata, (updatedBook) => {
        setBookdata(prev => ({
          ...prev,
          upvote: updatedBook.upvote,
          upvotes: updatedBook.upvotes
        }));
        toast.success("Book upvoted successfully!");
      });
    } catch (error) {
      toast.error("Failed to upvote book");
      console.error("Upvote error:", error);
    }
  };

  const handleStatusChange = async (e) => {
    if (!isOwner) {
      toast.warning("Only the book owner can update reading status");
      return;
    }

    const newStatus = e.target.value;
    const validTransitions = {
      "Want-to-Read": "Reading",
      "Reading": "Read"
    };

    if (validTransitions[reading_status] !== newStatus &&
        reading_status !== newStatus) {
      toast.warning(`Invalid status transition from ${reading_status} to ${newStatus}`);
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`http://localhost:3000/books/${_id}/reading-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          reading_status: newStatus,
          user_email: user.email
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status");
      }

      const updatedBook = await response.json();
      setBookdata(prev => ({
        ...prev,
        reading_status: updatedBook.reading_status
      }));
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Status update error:", error);
      toast.error(error.message || "Failed to update reading status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const displayUpvoteCount = bookdata.upvotes ? getUpvoteCount(bookdata) : upvote;

  const statusOptions = [
    { value: "Want-to-Read", label: "Want to Read" },
    { value: "Reading", label: "Reading" },
    { value: "Read", label: "Read" }
  ];

  return (
    <div className="bg-base-100 min-h-screen py-10 px-4 lg:px-20">
      <div className="container mx-auto">
        <motion.div
          className="flex flex-col lg:flex-row items-center gap-10 bg-white/80 backdrop-blur-md p-6 lg:p-10 rounded-2xl shadow-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
       
          <motion.div
            className="flex flex-col items-center w-full lg:w-auto"
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={cover_photo || "/default-book-cover.jpg"}
              alt={book_title}
              className="w-52 h-72 rounded-lg shadow-lg object-cover"
              onError={(e) => {
                e.target.src = "/default-book-cover.jpg";
              }}
            />

            {isOwner ? (
              <select
                name="reading_status"
                className="select mt-5 select-bordered max-w-full bg-amber-700 text-white font-semibold"
                value={reading_status}
                onChange={handleStatusChange}
                disabled={isUpdatingStatus || reading_status === "Read"}
              >
                {statusOptions.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={reading_status === "Read" && option.value !== "Read"}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="mt-5 px-4 py-2 bg-amber-700 text-white font-semibold rounded-lg">
                {reading_status}
              </div>
            )}

            {isUpdatingStatus && (
              <span className="loading loading-spinner loading-sm mt-2"></span>
            )}

          
            <div className="mt-8  w-full max-w-sm">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="steps steps-vertical lg:steps-horizontal  w-full"
              >
                <div className={`step ${["Want-to-Read", "Reading", "Read"].includes(reading_status) ? "step-primary" : ""}`}>
                  <span className="text-sm text-black font-semibold">Want to Read</span>
                </div>
                <div className={`step ${["Reading", "Read"].includes(reading_status) ? "step-primary" : ""}`}>
                  <span className="text-sm text-black font-semibold">Reading</span>
                </div>
                <div className={`step ${reading_status === "Read" ? "step-primary" : ""}`}>
                  <span className="text-sm text-black font-semibold">Read</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Book Info Section */}
          <motion.div
            className="text-left space-y-4 w-full max-w-xl"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-amber-900">
              {book_title}
            </h1>

            <p className="text-xl font-medium text-amber-600 hover:underline cursor-pointer">
              {book_author}
            </p>

            <div className="flex text-black flex-wrap gap-4">
              <p className="badge badge-outline">
                <span className="font-semibold ">Category:</span> {book_category}
              </p>
              <p className="badge badge-outline">
                <span className="font-semibold">Pages:</span> {total_page}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpvote}
              disabled={isUpvoting}
              className={`flex items-center gap-2 btn btn-sm transition ${
                hasUserUpvoted(bookdata)
                  ? 'bg-red-300 text-red-700 border-red-700'
                  : 'bg-pink-100 text-red-900 border-red-300 hover:bg-red-200'
              }`}
            >
              {isUpvoting ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  <FaHeart className="text-red-700" />
                </>
              ) : (
                <>
                  {displayUpvoteCount} <FaHeart className="text-red-500" />
                </>
              )}
            </motion.button>

            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-amber-800">Overview</h3>
              <p className="text-gray-700 leading-relaxed">
                {book_overview || "No overview available for this book."}
              </p>
            </div>

            <button className="btn bg-primary hover:bg-primary-focus text-primary-content">
              Read More
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <div className="container mx-auto py-10">
        <ReviwsSection bookId={_id} />
      </div>
    </div>
  );
};

export default BookDetails;
