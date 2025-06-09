import { div } from "motion/react-client";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useLoaderData } from "react-router";
import BookShelfCard from "../components/BookshelfCard";
import { motion } from "framer-motion";

const Bookshelf = () => {
  const initialBooks = useLoaderData();
  const [books, setBooks] = useState(initialBooks);

  return (
    <div className="py-6 px-4">
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-extrabold text-center text-red-900 drop-shadow-sm"
      >
        Explore Books Tailored to Your Interests
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="justify-center flex lg:flex-row flex-col items-center gap-5 mt-6"
      >
        <div className="inline-flex items-center bg-amber-50 p-2 rounded-xl border-2 border-amber-800 shadow-sm hover:shadow-md transition">
          <input
            type="search"
            placeholder="Search Books"
            className="bg-transparent outline-none px-3 text-base w-64 placeholder:text-amber-900"
          />
          <CiSearch className="text-2xl text-amber-800 cursor-pointer hover:text-red-700 transition" />
        </div>
       

       <div>
        <select name="reading_status" className="select select-bordered border-2 rounded-xl border-amber-800 text-base w-48 lg:w-60 shadow-sm hover:shadow-md transition">
        <option value="Read">Read</option>
        <option value="Reading">Reading</option>
        <option value="Want-to-Read">Want-to-Read</option>
        </select>
      </div>
        
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-[90%] mx-auto mt-12"
      >
        {books.map((book) => (
          <BookShelfCard
            key={book._id}
            books={books}
            setBooks={setBooks}
            book={book}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Bookshelf;
