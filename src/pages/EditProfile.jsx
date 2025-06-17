import React, { use, useState, useEffect } from "react";
import { FaUserEdit, FaClock, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { AuthContext } from "../contexts/Context";
import Swal from "sweetalert2";

const EditProfile = () => {
  const { user, updateUserProfile } = use(AuthContext);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    if (!user?.email) return;
    
    try {
      setFetchingProfile(true);
      const response = await fetch(`https://virtual-bookshelf-server-chi.vercel.app/users/${user.email}`);
      
      if (response.ok) {
        const profileData = await response.json();
        setUserProfile(profileData);
        
        // Use backend data if available, otherwise use Firebase data
        const userData = {
          displayName: profileData.displayName || user.displayName || "",
          photoURL: profileData.photoURL || user.photoURL || ""
        };
        
        setName(userData.displayName);
        setPhoto(userData.photoURL);
        setPreview(userData.photoURL || null);
        setInitialData(userData);
      } else {
        // If user not found in backend, use Firebase data
        const userData = {
          displayName: user.displayName || "",
          photoURL: user.photoURL || ""
        };
        setName(userData.displayName);
        setPhoto(userData.photoURL);
        setPreview(userData.photoURL || null);
        setInitialData(userData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Fallback to Firebase data
      const userData = {
        displayName: user.displayName || "",
        photoURL: user.photoURL || ""
      };
      setName(userData.displayName);
      setPhoto(userData.photoURL);
      setPreview(userData.photoURL || null);
      setInitialData(userData);
    } finally {
      setFetchingProfile(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhotoChange = (e) => {
    const photoURL = e.target.value;
    setPhoto(photoURL);
    setPreview(photoURL);
  };

  // Check if data has actually changed
  const hasChanges = () => {
    return name !== initialData.displayName || photo !== initialData.photoURL;
  };

  const updateProfileInBackend = async (profileData) => {
    try {
      const response = await fetch(`https://virtual-bookshelf-server-chi.vercel.app/users/${user.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile in database');
      }

      return await response.json();
    } catch (error) {
      console.error('Backend update error:', error);
      throw error;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      // Less than a minute ago
      if (diffInSeconds < 60) {
        return "Just now";
      }
      
      // Less than an hour ago
      if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      }
      
      // Less than a day ago
      if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      }
      
      // Less than a week ago
      if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
      }
      
      // More than a week ago - show actual date
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Unknown";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there are any changes
    if (!hasChanges()) {
      Swal.fire({
        title: 'No Changes',
        text: 'No changes were made to your profile.',
        icon: 'info',
        confirmButtonColor: '#7c2d12'
      });
      return;
    }

    setLoading(true);

    try {
      
      const profileData = {};
      if (name !== initialData.displayName) {
        profileData.displayName = name.trim();
      }
      if (photo !== initialData.photoURL) {
        profileData.photoURL = photo.trim();
      }

    
      if (updateUserProfile) {
        await updateUserProfile(name.trim(), photo.trim());
      }

 
      if (Object.keys(profileData).length > 0) {
        await updateProfileInBackend(profileData);
      }

      
      setInitialData({
        displayName: name.trim(),
        photoURL: photo.trim()
      });

    
      await fetchUserProfile();

      Swal.fire({
        title: 'Success!',
        text: 'Profile updated successfully!',
        icon: 'success',
        confirmButtonColor: '#7c2d12',
        timer: 2000,
        timerProgressBar: true
      });

    } catch (error) {
      console.error("Error updating profile:", error);
      
     
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error.message.includes('User not found')) {
        errorMessage = 'User account not found. Please contact support.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#7c2d12'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName(initialData.displayName);
    setPhoto(initialData.photoURL);
    setPreview(initialData.photoURL || null);
  };

  if (fetchingProfile) {
    return (
      <div className="max-w-md mx-auto p-6 shadow-xl rounded-2xl bg-base-100 mt-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="h-12 bg-gray-300 rounded mb-4"></div>
          <div className="h-12 bg-gray-300 rounded mb-4"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

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

    
      {userProfile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 p-4 rounded-lg mb-6 space-y-2"
        >
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaCalendarAlt className="text-green-600" />
            <span className="font-medium">Joined:</span>
            <span>{formatDateTime(userProfile.registeredAt) || 'Unknown'}</span>
          </div>
          
          {userProfile.lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaClock className="text-blue-600" />
              <span className="font-medium">Last updated:</span>
              <span className="text-blue-700 font-medium">
                {formatDateTime(userProfile.lastUpdated)}
              </span>
            </div>
          )}
          
          {userProfile.lastSignInTime && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaClock className="text-purple-600" />
              <span className="font-medium">Last sign in:</span>
              <span>{formatDateTime(userProfile.lastSignInTime)}</span>
            </div>
          )}
        </motion.div>
      )}

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
            maxLength={50}
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

        <div className="flex gap-2 mt-6">
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            type="submit"
            className={`btn bg-red-900 text-white flex-1 ${loading ? 'loading' : ''} ${!hasChanges() ? 'btn-disabled' : ''}`}
            disabled={loading || !hasChanges()}
          >
            {loading ? "Saving..." : "Save Changes"}
          </motion.button>

          {hasChanges() && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              type="button"
              onClick={handleReset}
              className="btn btn-outline"
              disabled={loading}
            >
              Reset
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default EditProfile;