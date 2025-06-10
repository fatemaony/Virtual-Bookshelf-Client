import React from "react";
import { FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import { useLoaderData } from "react-router";

const UpdateBookForm = ({ handleUpdateBook }) => {
  const book = useLoaderData();

  return (
    <motion.div 
      className="hero bg-gradient-to-br from-orange-50 to-white min-h-screen py-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="card bg-white shadow-xl rounded-2xl w-full max-w-5xl mx-auto p-6">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center text-[#a94906] flex items-center justify-center gap-2">
            <FaEdit /> Update Book Info
          </h1>

          <form onSubmit={handleUpdateBook} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Left Side */}
            <div className="space-y-4">
              <div>
                <label className="label font-semibold">Book Title:</label>
                <input type="text" name="book_title" defaultValue={book.book_title} className="input input-bordered w-full" required />
              </div>

              <div>
                <label className="label font-semibold">Cover Photo URL:</label>
                <input type="url" name="cover_photo" defaultValue={book.cover_photo} className="input input-bordered w-full" required />
              </div>

              <div>
                <label className="label font-semibold">Total Pages:</label>
                <input type="number" name="total_page" defaultValue={book.total_page} className="input input-bordered w-full" required />
              </div>

              <div>
                <label className="label font-semibold">Author:</label>
                <input type="text" name="book_author" defaultValue={book.book_author} className="input input-bordered w-full" required />
              </div>

              <div>
                <label className="label font-semibold">Book Category:</label>
                <select name="book_category" defaultValue={book.book_category} className="select select-bordered w-full">
                  <option>Fiction</option>
                  <option>Non-Fiction</option>
                  <option>Fantasy</option>
                </select>
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-4">
              <div>
                <label className="label font-semibold">User Email:</label>
                <input type="email" name="user_email" defaultValue={book.user_email} readOnly className="input input-bordered w-full bg-gray-100" />
              </div>

              <div>
                <label className="label font-semibold">User Name:</label>
                <input type="text" name="user_name" defaultValue={book.user_name} readOnly className="input input-bordered w-full bg-gray-100" />
              </div>

              <div>
                <label className="label font-semibold">Reading Status:</label>
                <select name="reading_status" defaultValue={book.reading_status} className="select select-bordered w-full">
                  <option>Read</option>
                  <option>Reading</option>
                  <option>Want-to-Read</option>
                </select>
              </div>

              <div>
                <label className="label font-semibold">Book Overview:</label>
                <textarea name="book_overview" defaultValue={book.book_overview} className="textarea textarea-bordered w-full" rows="4" required></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2 mt-4">
              <motion.button 
                type="submit"
                className="btn bg-[#a94906] hover:bg-[#7f2f00] text-white w-full rounded-xl transition-all duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Update Book
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default UpdateBookForm;
