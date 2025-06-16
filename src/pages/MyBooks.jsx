import React, { use, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { AuthContext } from "../contexts/Context";
import { Link } from "react-router";
import Swal from "sweetalert2";

const MyBooks = () => {
  const myBooks = useLoaderData();
  const { user } = use(AuthContext);
  const navigate = useNavigate();
  const userEmail = user?.email;

  const [currentBooks, setCurrentBooks] = useState(myBooks);
  const [isDeleting, setIsDeleting] = useState(null);

  const bookListing = currentBooks.filter(
    (book) => book.user_email === userEmail
  );

  const handleDelete = async (id) => {

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });
    
    if (!result.isConfirmed) {
      return;
    }

    setIsDeleting(id);

    try {
      
      const response = await fetch(`https://virtual-bookshelf-server-chi.vercel.app/books/${id}`,{
        method:"DELETE",
        headers:{
          'content-type':'application/json'
        }
      });

      const deletedResult = await response.json();
      if (response.ok && deletedResult.success) {
        setCurrentBooks(prevBooks=> prevBooks.filter(book=> book._id !==id))
        Swal.fire({
          title: 'Deleted!',
          text: 'Your listing has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#3085d6'
        });
      }else{
        Swal.fire({
          title: 'Error!',
          text: deletedResult.message || 'Failed to delete listing. Please try again.',
          icon: 'error',
          confirmButtonColor: '#3085d6'  
        });
      } 

    } catch (error) {
      console.error("Error deleting listing:", error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while deleting the listing. Please try again.',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    } finally{
      setIsDeleting(null);
    }
    
  };

  return (
    <div className="p-6  overflow-x-auto">
      <h1 className="text-3xl font-bold text-center text-red-800 mb-6">📚 My Book Collection</h1>
      <table className="min-w-full bg-white/80 backdrop-blur-md shadow rounded-lg overflow-hidden">
        <thead className="bg-red-800 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Cover</th>
            <th className="py-3 px-4 text-left">Title & Author</th>
            <th className="py-3 px-4 text-left">Category</th>
           
            <th className="py-3 px-4 text-left">Status</th>
            
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookListing.length > 0 ? (
            bookListing.map((book) => (
              <tr key={book._id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4">
                  <img
                    src={book.cover_photo}
                    alt={book.book_title}
                    className="w-16 h-20 object-cover rounded shadow"
                  />
                </td>
                <td className="py-3 px-4 ">
                  <h1 className="font-bold text-black  text-xl">{book.book_title}</h1>
                  <p className="text-gray-600">{book.book_author}</p>
                </td>
                
                <td className="py-3 px-4 text-sm text-gray-600">{book.book_category}</td>
               
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    book.reading_status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : book.reading_status === "Reading"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {book.reading_status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-2">
                    <Link
                      to={`/updatebook/${book._id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Update
                    </Link>

                    <Link to={`/bookshelf/${book._id}`}><button className="btn bg-amber-800 text-white">details</button></Link>
                    <button
                      onClick={() => handleDelete(book._id)}
                      disabled={isDeleting === book._id}
                      className={`px-3 py-1 rounded text-white transition-colors ${
                        isDeleting === book._id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {isDeleting === book._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-10 text-gray-500 text-lg">
                You haven't added any books yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyBooks;
