import React, { use } from "react";
import { FaBookBookmark } from "react-icons/fa6";
import { AuthContext } from "../contexts/Context";
import Swal from "sweetalert2";

const AddBooks = () => {
  const {user,getFirebaseToken,}= use(AuthContext)
  
  const handleAddBook=async(e)=>{
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const newBook = Object.fromEntries(formData.entries());
    console.log(newBook)

    //send to the server 
    const token = await getFirebaseToken();
     
    fetch('https://virtual-bookshelf-server-chi.vercel.app/books',{
      method:"POST",
      headers:{
        'content-type':'application/json',
         authorization: `Bearer ${token}`,
        
      },
      body:JSON.stringify(newBook)
    })
    .then(res =>res.json())
    .then(data =>{
      if (data?.insertedId) {
        console.log(data)
        Swal.fire({
        position: "center",
        icon: "success",
        title: "Book Added successfully",
        showConfirmButton: false,
        timer: 1500
       });
        
      }
    })
     form.reset();
   
  }
  return (
    <div className="hero bg-base-200 min-h-screen py-10">
      <div className="card bg-base-100 w-full max-w-5xl shadow-2xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold flex items-center justify-center text-[#a94906] gap-1 text-center mb-6"><FaBookBookmark /> Add Your Book 
       </h1>
          <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <div>
                <label className="label">Book Title:</label>
                <input type="text" name="book_title" className="input input-bordered w-full" required />
              </div>

              <div>
                <label className="label">Cover Photo:</label>
                <input type="URL" name="cover_photo" className="input input-bordered w-full" />
              </div>

              <div>
                <label className="label">Total Pages:</label>
                <input type="number" name="total_page" className="input input-bordered w-full" />
              </div>

              <div>
                <label className="label">Author:</label>
                <input type="text" name="book_author" className="input input-bordered w-full" required />
              </div>

              <div>
                <label className="label">Book Category:</label>
                <select name="book_category" className="select select-bordered w-full">
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Fantasy">Fantasy</option>
                </select>
              </div>
            </div>

            
            <div className="space-y-4">
              <div>
                <label className="label">User Email :</label>
                <input
                  type="email"
                  name="user_email"
                  value={user?.email}
                  readOnly
                  className="input input-bordered w-full bg-base-200"
                />
              </div>

              <div>
                <label className="label">User Name :</label>
                <input
                  type="text"
                  name="user_name"
                  value={user?.displayName}
                  readOnly
                  className="input input-bordered w-full bg-base-200"
                />
              </div>

              <div>
                <label className="label">Reading Status:</label>
                <select name="reading_status" className="select select-bordered w-full">
                  <option value="Read">Read</option>
                  <option value="Reading">Reading</option>
                  <option value="Want-to-Read">Want-to-Read</option>
                </select>
              </div>

              <div>
                <label className="label">Upvote :</label>
                <input
                  type="number"
                  name="upvote"
                  value="0"
                  readOnly
                  className="input input-bordered w-full bg-base-200"
                />
              </div>

              <div>
                <label className="label">Book Overview:</label>
                <textarea name="book_overview" className="textarea textarea-bordered w-full" rows="4"></textarea>
              </div>
            </div>

            
            <div className="col-span-1 md:col-span-2 mt-4">
              <button type="submit" className="btn bg-[#a94906] text-white w-full">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBooks;
