import React from "react";
import { useLoaderData } from "react-router";
import { FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";

const BookDetails = () => {
  const bookdata = useLoaderData();
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
  } = bookdata;

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-pink-100 min-h-screen py-10 px-4 lg:px-20">
      <motion.div
        className="flex flex-col lg:flex-row items-center gap-10 bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        
        <motion.div
          className="flex flex-col items-center"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src={cover_photo}
            alt={book_title}
            className="w-52 h-72 rounded-lg shadow-lg object-cover"
          />
          <select
            name="reading_status"
            className="select mt-5 select-bordered w-full bg-amber-700 text-white font-semibold"
            defaultValue={reading_status}
          >
            <option value="Read">Read</option>
            <option value="Reading">Reading</option>
            <option value="Want-to-Read">Want-to-Read</option>
          </select>
        </motion.div>

        
        <motion.div
          className="text-left space-y-4 max-w-xl"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-amber-900">
            {book_title}
          </h1>
          <p className="text-xl font-medium text-amber-600 hover:underline">
            {book_author}
          </p>
          <p>
            <span className="font-semibold">Category:</span> {book_category}
          </p>
          <p>
            <span className="font-semibold">Pages:</span> {total_page}
          </p>

         
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="flex items-center gap-2 btn btn-sm bg-pink-100 text-red-900 border-red-300 hover:bg-red-200"
          >
            {upvote} <FaHeart className="text-red-700" />
          </motion.button>

          
          <p className="text-gray-700 leading-relaxed">{book_overview}</p>

          <button className="btn bg-red-900 text-white">Read More</button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BookDetails;
