import Lottie from "lottie-react";
import errorPage from "../assets/lottie/Error.json";
import React from "react";
import { Link } from "react-router"; 
const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white text-center">
      <div className="w-full max-w-md">
        <Lottie animationData={errorPage} loop={true} />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mt-6">Oops! Something went wrong.</h1>
      <p className="text-lg md:text-xl mt-2 mb-6 text-gray-300">
        The page you’re looking for doesn’t exist or an unexpected error occurred.
      </p>

      <Link to="/">
        <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-300 shadow-lg hover:scale-105">
          Go Back Home
        </button>
      </Link>
    </div>
  );
};

export default ErrorPage;
