import React from "react";
import { motion } from "framer-motion";
import { FaQuestionCircle, FaUserPlus, FaBook, FaExchangeAlt, FaStar } from "react-icons/fa";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Click the 'Sign Up' button in the top right corner, fill in your details, and verify your email address to get started with ReadRipple.",
      icon: <FaUserPlus className="text-blue-500" />
    },
    {
      question: "How can I add books to my shelf?",
      answer: "Navigate to the 'Discover' page, search for books, and click the 'Add to Shelf' button on any book you want to save to your personal collection.",
      icon: <FaBook className="text-green-500" />
    },
    {
      question: "Can I exchange books with other users?",
      answer: "Yes! Visit the 'Community' section to see available books for exchange. You can request exchanges with other ReadRipple members.",
      icon: <FaExchangeAlt className="text-purple-500" />
    },
    {
      question: "How does the rating system work?",
      answer: "You can rate books from 1 to 5 stars after reading them. Your ratings help personalize recommendations and help other readers discover great books.",
      icon: <FaStar className="text-yellow-500" />
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-amber-900 mb-4 flex items-center justify-center gap-3"
        >
          <FaQuestionCircle className="text-amber-500" />
          Frequently Asked Questions
        </motion.h1>
        <p className="text-lg text-gray-600">
          Find answers to common questions about ReadRipple
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="collapse collapse-plus">
              <input type="checkbox" className="peer" />
              <div className="collapse-title text-xl font-medium flex items-center gap-3">
                {faq.icon}
                {faq.question}
              </div>
              <div className="collapse-content">
                <p className="text-gray-600 pl-10">{faq.answer}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-12 text-center bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Still have questions?
        </h3>
        <p className="text-gray-600 mb-4">
          Contact our support team for more assistance
        </p>
        <button className="btn btn-primary gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Contact Support
        </button>
      </motion.div>
    </motion.div>
  );
};

export default FAQ;