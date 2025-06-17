import React, { useState, useContext } from "react";
import { FiEdit, FiLogOut, FiBook, FiUser, FiGlobe, FiAward } from "react-icons/fi";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { AuthContext } from "../contexts/Context";
import { Link, useLoaderData } from "react-router";

ChartJS.register(ArcElement, Tooltip, Legend);

const Profile = () => {
  const myBooks = useLoaderData();
  const {book_title, book_category, reading_status}= myBooks
  const { user, signOutUser } = useContext(AuthContext);

  const userEmail = user?.email;

  const [currentBooks] = useState(myBooks);
  const bookListing = currentBooks.filter(
    (book) => book.addedBy === userEmail || book.user_email === userEmail
  );
  
  const fictionCategory = bookListing.filter(book => book.book_category === "Fiction");
  const nonFictionCategory = bookListing.filter(book => book.book_category === "Non-Fiction");
  const fantasyCategory = bookListing.filter(book => book.book_category === "Fantasy");
  const readingBooks = bookListing.find(book => book.reading_status === "Reading");

  const handleSignOut = () => {
    signOutUser()
      .then(result => {
        console.log("sign out successfully");
      })
      .catch(error => {
        console.log(error);
      });
  };

  const chartData = {
    labels: ["Fiction", "Non-Fiction", "Fantasy"],
    datasets: [
      {
        data: [
          fictionCategory.length, 
          nonFictionCategory.length, 
          fantasyCategory.length
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-color-base-200 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className=" bg-white/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-red-800 h-32 relative">
            <div className="absolute -bottom-16 left-6">
              <div className="relative group">
                <img
                  src={user?.photoURL || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
                />
                <button
                  className="absolute bottom-0 right-0 bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  data-tooltip-id="edit-tooltip"
                  data-tooltip-content="Edit Profile"
                >
                  <Link to="/editprofile"><FiEdit size={16} /></Link>
                </button>
                <ReactTooltip id="edit-tooltip" place="top" effect="solid" />
              </div>
            </div>
          </div>
          <div className="pt-20 px-6  pb-6">
            <div className="flex  justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user?.displayName || "User"}</h1>
                <p className="text-gray-600">{user?.email || "No email"}</p>
              </div>
              <div className="flex lg:flex-row flex-col gap-2">
                {/* <button className="flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors">
                  <FiEdit size={18} />
                  <Link to="/editprofile"><span>Edit Profile</span></Link>
                </button> */}
                <button 
                  onClick={handleSignOut} 
                 className="flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <FiLogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1  lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <FiUser className="mr-2 text-red-700" />
                About Me
              </h2>
              <p className="text-gray-700">
                Book enthusiast and lifelong learner.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start">
                  <FiGlobe className="text-red-700 mt-1 mr-2" />
                  <div>
                    <h3 className="font-medium text-gray-600">Country</h3>
                    <p className="text-gray-800">Bangladesh</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FiBook className="text-red-700 mt-1 mr-2" />
                  <div>
                    <h3 className="font-medium text-gray-600">Languages</h3>
                    <p className="text-gray-800">English, Bengali</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FiAward className="text-red-700 mt-1 mr-2" />
                  <div>
                    <h3 className="font-medium text-gray-600">Status</h3>
                    <p className="text-gray-800">Student</p>
                  </div>
                </div>
              </div>
            </div>

          
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <FiBook className="mr-2 text-red-700" />
                Bookshelf Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-red-800">{bookListing.length}</p>
                  <p className="text-gray-600">Total Books</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-red-800">3</p>
                  <p className="text-gray-600">Categories</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-red-800">1</p>
                  <p className="text-gray-600">Years Member</p>
                </div>
              </div>
              <div className="h-64">
                <Pie
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

         
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between px-4 py-3 bg-red-50 text-red-800 rounded-lg hover:bg-red-100 transition-colors">
                  <Link to="/addbooks"><span>Add New Book</span></Link>
                  <FiBook />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-red-50 text-red-800 rounded-lg hover:bg-red-100 transition-colors">
                  <Link to="/mybooks"><span>View Reading List</span></Link>
                  <FiBook />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-red-50 text-red-800 rounded-lg hover:bg-red-100 transition-colors">
                  <span>Reading Challenge</span>
                  <FiAward />
                </button>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                    <FiBook className="text-red-700" />
                  </div>
                  <div>
                    <p className="text-gray-800">
                      Added <span className="font-medium">Dune</span> to your bookshelf
                    </p>
                    <p className="text-sm text-gray-500">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                    <FiBook className="text-red-700" />
                  </div>
                  <div>
                    <p className="text-gray-800">
                       Started reading <span className="font-medium">
                       {readingBooks?.book_title ? readingBooks.book_title : "There are no books"}</span>
                    </p>

                    <p className="text-sm text-gray-500">1 week ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                    <FiAward className="text-red-700" />
                  </div>
                  <div>
                    <p className="text-gray-800">
                      Completed your monthly reading goal!
                    </p>
                    <p className="text-sm text-gray-500">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;