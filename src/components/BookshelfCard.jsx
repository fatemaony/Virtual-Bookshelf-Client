import React from "react";
import { FaHeart, FaBookOpen } from "react-icons/fa";
import { Link } from "react-router"; // Corrected import
import { motion } from "framer-motion";
import useBookUpvote from "../components/UseBookUpvote";

const BookShelfCard = ({ book, books, setBooks }) => {
  const {
    _id,
    book_category,
    book_author,
    cover_photo,
    book_title,
    reading_status,
  } = book;

  const {
    upvoteBook,
    getUpvoteCount,
    hasUserUpvoted,
    isUpvoting,
    canUserUpvote
  } = useBookUpvote();


  const handleUpvote = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!canUserUpvote(book)) return;

    await upvoteBook(_id, book, (updatedBook) => {
      if (setBooks && books) {
        setBooks(books.map(b =>
          b._id === _id ? updatedBook : b
        ));
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="card bg-color-neutral hover:shadow-xl rounded-2xl overflow-hidden border border-amber-200 hover:border-red-400 transition duration-300"
    >
      <figure className="px-8 pt-8">
        <img
          src={cover_photo}
          alt={book_title}
          className="rounded-xl h-64 w-52 object-cover shadow-lg"
          onError={(e) => {
            e.target.src = "/default-book-cover.jpg";
          }}
        />
      </figure>

      <div className="flex justify-between items-center p-4 px-6">
        <span className="badge badge-warning text-white px-3 py-1 font-semibold shadow-md">
          {book_author}
        </span>
        <button
          onClick={handleUpvote}
          disabled={isUpvoting || !canUserUpvote(book)}
          className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full transition ${hasUserUpvoted(book)
              ? 'bg-red-600 text-white hover:bg-red-700'
              : canUserUpvote(book)
                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
        >
          {isUpvoting ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <>
              {getUpvoteCount(book)} <FaHeart className={`${hasUserUpvoted(book) ? 'text-white' : 'text-red-600'}`} />
            </>
          )}
        </button>
      </div>

      <div className="px-6 pb-6">
        <h2 className="text-lg font-bold text-red-900 line-clamp-2">
          {book_title}
        </h2>
        <p className="text-gray-500 text-sm mb-1">
          <span className="font-semibold text-black">Category : </span>
          {book_category}
        </p>
        <p className="text-gray-500 text-sm mb-1">
          <span className="font-semibold text-black">Status : </span>
          {reading_status}
        </p>

        <div className="text-end mt-4">
          <Link to={`/bookshelf/${_id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-sm bg-red-900 text-white hover:bg-red-700 transition rounded-full px-4 py-2 flex items-center gap-2"
            >
              <FaBookOpen /> Read More
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BookShelfCard;