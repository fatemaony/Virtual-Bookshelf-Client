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
        <div className="join">
  <div>
    <div className="w-72">
      <input className="input join-item" placeholder="Search" />
    </div>
  </div>
  <select name="reading_status" className="select select-bordered ">
   <option value="Read">Read</option>
   <option value="Reading">Reading</option>
   <option value="Want-to-Read">Want-to-Read</option>
  </select>
  <div className="indicator">
    <button className="btn join-item bg-amber-800 text-white">Search</button>
  </div>
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
