import { div } from "motion/react-client";
import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useLoaderData } from "react-router";
import BookShelfCard from "../components/BookshelfCard";
import { motion } from "framer-motion";
import axios from "axios";

const Bookshelf = () => {
  const initialBooks = useLoaderData();
  const [books, setBooks] = useState(initialBooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchBooks = async (search = "", status = "") => {
    setIsLoading(true);
    try {
      let url = "http://localhost:3000/books";
      const params = new URLSearchParams();
      
      if (search.trim()) {
        params.append("search", search.trim());
      }
      if (status) {
        params.append("status", status);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchBooks(searchTerm, selectedStatus);
  };

 
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBooks(searchTerm, selectedStatus);
    }, 500); 

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedStatus]);

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
              <input 
                className="input join-item" 
                placeholder="Search by title or author" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select 
            name="reading_status" 
            className="select select-bordered"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Books</option>
            <option value="Read">Read</option>
            <option value="Reading">Reading</option>
            <option value="Want-to-Read">Want-to-Read</option>
          </select>
          <div className="indicator">
            <button 
              className="btn join-item bg-amber-800 text-white"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-[90%] mx-auto mt-12"
      >
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-amber-800"></span>
          </div>
        ) : books.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-600 text-lg">No books found matching your criteria.</p>
          </div>
        ) : (
          books.map((book) => (
            <BookShelfCard
              key={book._id}
              books={books}
              setBooks={setBooks}
              book={book}
            />
          ))
        )}
      </motion.div>
    </div>
  );
};

export default Bookshelf;