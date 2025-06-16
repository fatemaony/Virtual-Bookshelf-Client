import { useState, useCallback, useContext } from 'react';
import { AuthContext } from '../contexts/Context';
import Swal from 'sweetalert2';

const useBookUpvote = () => {
  const { user } = useContext(AuthContext);
  const [isUpvoting, setIsUpvoting] = useState(false);

  const upvoteBook = useCallback(async (_Id, book, onSuccess) => {
    if (!user) {
      Swal.fire({
        title: 'Authentication Required!',
        text: 'Please sign in to upvote books.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sign In',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#950d0b',
        cancelButtonColor: '#6b7280'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/signin';
        }
      });
      return;
    }

    if (book.user_email === user.email) {
      Swal.fire({
        title: 'Cannot Upvote Own Book!',
        text: 'You cannot upvote a book that you added yourself.',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#950d0b'
      });
      return;
    }

    setIsUpvoting(true);

    try {
      const token = await user.getIdToken(); 
      const response = await fetch(`https://virtual-bookshelf-server-chi.vercel.app/books/${_Id}/upvote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userName: user.displayName || 'Anonymous User'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upvote book');
      }

     
      if (onSuccess && data.book) {
        onSuccess(data.book);
      }

      Swal.fire({
        title: 'Book Upvoted! ❤️',
        text: `You've shown love for "${book.book_title}"!`,
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

      return data.book;

    } catch (error) {
      console.error('Error upvoting book:', error);
      
      Swal.fire({
        title: 'Upvote Failed!',
        text: error.message || 'Something went wrong while upvoting. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626'
      });
      throw error;
    } finally {
      setIsUpvoting(false);
    }
  }, [user]);

  const getUpvoteCount = useCallback((bookOrUpvotes) => {
  
    if (typeof bookOrUpvotes === 'number') {
      return bookOrUpvotes;
    }
    
   
    if (bookOrUpvotes && typeof bookOrUpvotes === 'object') {
     
      if (bookOrUpvotes.upvote !== undefined) {
        return Number(bookOrUpvotes.upvote) || 0;
      }
     
      if (Array.isArray(bookOrUpvotes.upvotes)) {
        return bookOrUpvotes.upvotes.length;
      }
      
      if (Array.isArray(bookOrUpvotes)) {
        return bookOrUpvotes.length;
      }
    }
    
    return 0;
  }, []);

  return {
    upvoteBook,
    getUpvoteCount,
    isUpvoting
  };
};

export default useBookUpvote;