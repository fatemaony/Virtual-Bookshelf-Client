import React, { useState, useContext, use } from 'react';
import { motion } from 'framer-motion';
import { FaBookOpen, FaCheck, FaEye, FaLock } from 'react-icons/fa';
import { AuthContext } from '../contexts/Context';


const ReadingTracker = ({ bookId, currentStatus, bookOwner, onStatusUpdate }) => {
  const { user }= use(AuthContext) // Fixed: changed from use() to useContext()
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  // Check if current user is the owner of the book
  const isOwner = user?.email === bookOwner;

  const statusConfig = {
    'Want-to-Read': {
      icon: FaEye,
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      nextStatus: 'Reading',
      label: 'Want to Read'
    },
    'Reading': {
      icon: FaBookOpen,
      color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      nextStatus: 'Read',
      label: 'Currently Reading'
    },
    'Read': {
      icon: FaCheck,
      color: 'bg-green-100 text-green-700 border-green-300',
      nextStatus: null,
      label: 'Completed'
    }
  };

  const handleStatusUpdate = async () => {
    if (!isOwner || !statusConfig[status].nextStatus) return;

    setIsUpdating(true);
    const newStatus = statusConfig[status].nextStatus;

    try {
      // Update UI immediately for better UX
      setStatus(newStatus);
      onStatusUpdate(newStatus);

      // Sync with backend
      const response = await fetch(`http://localhost:3000/books/${bookId}/reading-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reading_status: newStatus,
          userEmail: user.email
        })
      });

      if (!response.ok) {
        // Revert on error
        setStatus(status);
        onStatusUpdate(status);
        throw new Error('Failed to update reading status');
      }

      const result = await response.json();
      console.log('Reading status updated successfully:', result);

    } catch (error) {
      console.error('Error updating reading status:', error);
      // Revert changes on error
      setStatus(status);
      onStatusUpdate(status);
      
      // Show error message to user
      alert('Failed to update reading status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const currentConfig = statusConfig[status];
  const IconComponent = currentConfig.icon;

  return (
    <div className="mt-5 w-full max-w-sm">
      <div className="text-center mb-3">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Reading Status</h3>
        
        {/* Current Status Display */}
        <motion.div
          className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 ${currentConfig.color} font-semibold`}
          whileHover={{ scale: 1.02 }}
        >
          <IconComponent className="text-lg" />
          <span>{currentConfig.label}</span>
        </motion.div>
      </div>

      {/* Update Button - Only show if user is owner and can progress */}
      {isOwner && currentConfig.nextStatus && (
        <motion.button
          onClick={handleStatusUpdate}
          disabled={isUpdating}
          className={`w-full mt-3 btn btn-sm transition-all duration-200 ${
            isUpdating 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-amber-600 text-white hover:bg-amber-700'
          }`}
          whileHover={{ scale: isUpdating ? 1 : 1.05 }}
          whileTap={{ scale: isUpdating ? 1 : 0.95 }}
        >
          {isUpdating ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Updating...
            </>
          ) : (
            <>
              Mark as "{statusConfig[currentConfig.nextStatus].label}"
              <motion.div
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.div>
            </>
          )}
        </motion.button>
      )}

      {/* Progress Indicator */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Progress</span>
          <span className="text-xs text-gray-500">
            {status === 'Want-to-Read' ? '0%' : status === 'Reading' ? '50%' : '100%'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full transition-all duration-500 ${
              status === 'Want-to-Read' 
                ? 'bg-blue-500 w-0' 
                : status === 'Reading' 
                ? 'bg-yellow-500 w-1/2' 
                : 'bg-green-500 w-full'
            }`}
            initial={{ width: 0 }}
            animate={{ 
              width: status === 'Want-to-Read' ? '0%' : status === 'Reading' ? '50%' : '100%' 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Owner restriction message */}
      {!isOwner && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
          <FaLock />
          <span>Only the book owner can update reading status</span>
        </div>
      )}

      {/* Completion message */}
      {status === 'Read' && (
        <motion.div
          className="mt-3 text-center text-sm text-green-600 font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          🎉 Congratulations on finishing this book!
        </motion.div>
      )}
    </div>
  );
};

export default ReadingTracker;