import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useLoaderData, useSearchParams } from "react-router";
import BookShelfCard from "../components/BookshelfCard";
import { motion } from "framer-motion";
import axios from "axios";

const Bookshelf = () => {
  const initialBooks = useLoaderData();
  const [books, setBooks] = useState(initialBooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    
    const initialCategory = searchParams.get("category");
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [searchParams]);

  const fetchBooks = async (search = "", status = "", category = "") => {
    setIsLoading(true);
    try {
      let url = "https://virtual-bookshelf-server-chi.vercel.app/books";
      const params = new URLSearchParams();
      
      if (search.trim()) {
        params.append("search", search.trim());
      }
      if (status) {
        params.append("status", status);
      }
      if (category) {
        params.append("category", category);
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
    fetchBooks(searchTerm, selectedStatus, selectedCategory);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBooks(searchTerm, selectedStatus, selectedCategory);
    }, 500); 

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedStatus, selectedCategory]);

  return (
    <div className="py-4 sm:py-6 px-2 sm:px-4">
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-red-900 drop-shadow-sm px-2"
      >
        Explore Books Tailored to Your Interests
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col lg:flex-row justify-center items-center gap-3 sm:gap-5 mt-4 sm:mt-6"
      >
        {/* Mobile/Tablet Stacked Layout */}
        <div className="flex flex-col sm:hidden w-full max-w-sm gap-2">
          <input 
            className="input input-bordered w-full text-sm" 
            placeholder="Search by title or author" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            name="reading_status" 
            className="select select-bordered w-full text-sm"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Read">Read</option>
            <option value="Reading">Reading</option>
            <option value="Want-to-Read">Want-to-Read</option>
          </select>
          <select 
            name="book_category" 
            className="select select-bordered w-full text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Fantasy">Fantasy</option>
          </select>
          <button 
            className="btn bg-amber-800 text-white w-full"
            onClick={handleSearch}
          >
            <CiSearch className="text-xl" />
            Search
          </button>
        </div>

        {/* Tablet Join Layout */}
        <div className="hidden sm:flex lg:hidden flex-col gap-2 w-full max-w-2xl">
          <div className="flex gap-2">
            <input 
              className="input input-bordered flex-1" 
              placeholder="Search by title or author" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="btn bg-amber-800 text-white"
              onClick={handleSearch}
            >
              <CiSearch className="text-xl" />
              <span className="hidden md:inline">Search</span>
            </button>
          </div>
          <div className="flex gap-2">
            <select 
              name="reading_status" 
              className="select select-bordered flex-1"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Read">Read</option>
              <option value="Reading">Reading</option>
              <option value="Want-to-Read">Want-to-Read</option>
            </select>
            <select 
              name="book_category" 
              className="select select-bordered flex-1"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Fantasy">Fantasy</option>
            </select>
          </div>
        </div>

        {/* Desktop Join Layout */}
        <div className="hidden lg:flex join">
          <div>
            <div className="w-64 xl:w-72">
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
            className="select select-bordered join-item"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Read">Read</option>
            <option value="Reading">Reading</option>
            <option value="Want-to-Read">Want-to-Read</option>
          </select>
          <select 
            name="book_category" 
            className="select select-bordered join-item"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Fantasy">Fantasy</option>
          </select>
          <div className="indicator">
            <button 
              className="btn join-item bg-amber-800 text-white"
              onClick={handleSearch}
            >
              <CiSearch className="text-xl" />
              Search
            </button>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-[95%] sm:w-[90%] mx-auto mt-8 sm:mt-12"
      >
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-amber-800"></span>
          </div>
        ) : books.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-600 text-base sm:text-lg">No books found matching your criteria.</p>
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