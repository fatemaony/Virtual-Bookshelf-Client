import React, { use, useState, useEffect } from "react";
import { FaUserEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import { AuthContext } from "../contexts/Context";
import Swal from "sweetalert2";

const EditProfile = () => {
  const { user, updateUserProfile } = use(AuthContext);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setPhoto(user.photoURL || "");
      setPreview(user.photoURL || null);
    }
  }, [user]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhotoChange = (e) => {
    const photoURL = e.target.value;
    setPhoto(photoURL);
    setPreview(photoURL);
  };

  const updateProfileInBackend = async (profileData) => {
    try {
      const response = await fetch(`https://virtual-bookshelf-server-chi.vercel.app/users/${user.email}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile in database');
      }

      return await response.json();
    } catch (error) {
      console.error('Backend update error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
  
      const profileData = {
        displayName: name,
        photoURL: photo,
        email: user.email 
      };

     
      if (updateUserProfile) {
        await updateUserProfile(name, photo);
      }
      await updateProfileInBackend(profileData);

      Swal.fire({
        title: 'Success!',
        text: 'Profile updated successfully!',
        icon: 'success',
        confirmButtonColor: '#7c2d12'
      });

    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update profile. Please try again.',
        icon: 'error',
        confirmButtonColor: '#7c2d12'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-6 shadow-xl rounded-2xl bg-base-100 mt-10"
    >
      <div className="flex items-center gap-2 mb-5">
        <FaUserEdit className="text-2xl text-red-900" />
        <h2 className="text-2xl font-bold text-red-900">Edit Profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text font-semibold">Name</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter your name"
            className="input input-bordered w-full"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-semibold">Photo URL</span>
          </label>
          <input
            type="url"
            value={photo}
            onChange={handlePhotoChange}
            placeholder="Enter photo URL"
            className="input input-bordered w-full"
            disabled={loading}
          />
          {preview && (
            <motion.img
              src={preview}
              alt="Preview"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-4 h-32 w-32 object-cover rounded-full mx-auto shadow-md"
              onError={() => setPreview(null)}
            />
          )}
        </div>

        <motion.button
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
          type="submit"
          className={`btn bg-red-900 text-white w-full mt-4 ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default EditProfile;