import { useState, useCallback, use } from 'react';
import { AuthContext } from '../contexts/Context';
import Swal from 'sweetalert2';

const useBookUpvote = () => {
  const { user } = use(AuthContext);
  const [isUpvoting, setIsUpvoting] = useState(false);

  const upvoteBook = useCallback(async (bookId, book, onSuccess) => {
 
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

   if (book.addedBy === user.email) {
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
      const response = await fetch(`https://virtual-bookshelf-server-chi.vercel.app/books/${bookId}/upvote`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.displayName || 'Anonymous User'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upvote book');
      }

      const updatedBook = await response.json();
      
      if (onSuccess) {
        onSuccess(updatedBook);
      }

      
      Swal.fire({
        title: 'Book Upvoted! ❤️',
        text: `You've shown love for "${book.book_title}"!`,
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        customClass: {
          popup: 'animate__animated animate__fadeInDown'
        }
      });

    } catch (error) {
      console.error('Error upvoting book:', error);
      
      Swal.fire({
        title: 'Upvote Failed!',
        text: error.message || 'Something went wrong while upvoting. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setIsUpvoting(false);
    }
  }, [user]);

  const getUpvoteCount = useCallback((book) => {
    return book.upvotes?.length || 0;
  }, []);

  const hasUserUpvoted = useCallback((book) => {
    if (!user || !book.upvotes) return false;
    return book.upvotes.some(upvote => upvote.userEmail === user.email);
  }, [user]);

  const canUserUpvote = useCallback((book) => {
  if (!user) return false;
  if (book.addedBy === user.email) return false;
  return true;
}, [user]);

  const getUpvoteButtonText = useCallback((book) => {
    if (!user) return 'Sign in to upvote';
    if (book.addedBy === user.email) return 'Your book';
    return hasUserUpvoted(book) ? 'Upvoted' : 'Upvote';
  }, [user, hasUserUpvoted]);

  const getUpvoteButtonClass = useCallback((book) => {
    const baseClass = 'btn btn-sm transition-all duration-200 ';
    
    if (!user) {
      return baseClass + 'btn-outline btn-neutral opacity-70';
    }
    
    if (book.addedBy === user.email) {
      return baseClass + 'btn-disabled opacity-50';
    }
    
    if (hasUserUpvoted(book)) {
      return baseClass + 'btn-error text-white bg-red-600 hover:bg-red-700 border-red-600';
    }
    
    return baseClass + 'btn-outline btn-error hover:btn-error hover:text-white border-red-600 text-red-600';
  }, [user, hasUserUpvoted]);

  return {
    upvoteBook,
    getUpvoteCount,
    hasUserUpvoted,
    canUserUpvote,
    getUpvoteButtonText,
    getUpvoteButtonClass,
    isUpvoting,
    isAuthenticated: !!user
  };
};

export default useBookUpvote;