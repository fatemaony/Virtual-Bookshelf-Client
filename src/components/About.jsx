import React from "react";
import { motion } from "framer-motion";
import { FaBookReader, FaLeaf, FaHeart, FaRegSmile } from "react-icons/fa";

const About = () => {
  return (
    <div className="bg-color-base-200 min-h-screen py-10 px-4 lg:px-20">
      <motion.div
        className="container mx-auto bg-white/90 p-8 rounded-3xl shadow-2xl backdrop-blur-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-10">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-rose-800"
            whileHover={{ scale: 1.05 }}
          >
            About Us
          </motion.h1>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Your trusted destination to explore, share, and celebrate the magic of books.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left Section: Icon Cards */}
          <div className="grid grid-cols-2 gap-6">
            <motion.div
              className="bg-pink-100 p-6 rounded-xl shadow-lg text-center"
              whileHover={{ scale: 1.05 }}
            >
              <FaBookReader className="text-3xl text-rose-700 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-rose-800">Book Discovery</h3>
              <p className="text-sm text-gray-600">
                Find reviews, ratings, and recommendations for your next favorite book.
              </p>
            </motion.div>

            <motion.div
              className="bg-pink-100 p-6 rounded-xl shadow-lg text-center"
              whileHover={{ scale: 1.05 }}
            >
              <FaLeaf className="text-3xl text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-green-700">Eco-Friendly Reading</h3>
              <p className="text-sm text-gray-600">
                Promoting digital reading to save paper and protect nature.
              </p>
            </motion.div>

            <motion.div
              className="bg-pink-100 p-6 rounded-xl shadow-lg text-center"
              whileHover={{ scale: 1.05 }}
            >
              <FaHeart className="text-3xl text-red-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-red-600">Community Love</h3>
              <p className="text-sm text-gray-600">
                Engage with a passionate community of readers and reviewers.
              </p>
            </motion.div>

            <motion.div
              className="bg-pink-100 p-6 rounded-xl shadow-lg text-center"
              whileHover={{ scale: 1.05 }}
            >
              <FaRegSmile className="text-3xl text-yellow-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-yellow-700">Joyful Reading</h3>
              <p className="text-sm text-gray-600">
                Experience the joy of reading with our fun and inspiring interface.
              </p>
            </motion.div>
          </div>

          {/* Right Section: Info Text */}
          <motion.div
            className="text-left space-y-4"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-rose-800">
              Why Choose <span className="text-pink-600">ReadRipple</span>?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              At ReadRipple, we believe that books have the power to create ripples of change in
              minds and hearts. Whether you are a casual reader, a passionate book reviewer, or a
              literature lover – ReadRipple gives you a platform to express, discover, and connect.
            </p>
            <p className="text-gray-700">
              We combine simplicity with elegance using modern web technologies to bring you a
              smooth reading journey. Start your ripple today!
            </p>
            <button className="btn bg-rose-700 hover:bg-rose-800 text-white mt-4">
              Join the Community
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
