import React from "react";
import { FaBookOpen, FaGlasses, FaHatWizard } from "react-icons/fa";
import { motion } from "framer-motion";

const categories = [
  {
    name: "Fiction",
    icon: <FaBookOpen className="text-4xl text-rose-600" />,
    description: "Explore imaginative and narrative storytelling.",
  },
  {
    name: "Non-Fiction",
    icon: <FaGlasses className="text-4xl text-sky-600" />,
    description: "Discover real stories, biographies, and knowledge.",
  },
  {
    name: "Fantasy",
    icon: <FaHatWizard className="text-4xl text-purple-600" />,
    description: "Dive into magical worlds and epic adventures.",
  },
];

const BooksCategory = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.h1
        className="text-4xl font-bold text-center text-red-800 mb-12"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        📚 Books Category
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {categories.map((category, idx) => (
          <motion.div
            key={idx}
            className="bg-base-100 border shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl hover:scale-105 transition duration-300"
            whileHover={{ y: -8 }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
          >
            <div className="flex justify-center mb-4">{category.icon}</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h2>
            <p className="text-sm text-gray-600">{category.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BooksCategory;
