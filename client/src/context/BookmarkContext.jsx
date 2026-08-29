import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext.jsx';

export const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch bookmarks when token changes
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!token || (user && user.role === 'Administrator')) {
        setBookmarks([]);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get('/api/bookmarks');
        if (res.data.success) {
          setBookmarks(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch bookmarks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [token, user]);

  const isBookmarked = (schemeId) => {
    return bookmarks.some(s => s.id === schemeId);
  };

  const toggleBookmark = async (schemeId) => {
    if (!token) {
      throw new Error('Please log in to bookmark schemes.');
    }
    
    const isSaved = isBookmarked(schemeId);
    try {
      if (isSaved) {
        // Remove bookmark
        const res = await axios.delete(`/api/bookmarks/${schemeId}`);
        if (res.data.success) {
          setBookmarks(prev => prev.filter(s => s.id !== schemeId));
          return false; // Not bookmarked now
        }
      } else {
        // Add bookmark
        const res = await axios.post('/api/bookmarks', { schemeId });
        if (res.data.success) {
          // Re-fetch bookmarks to get full scheme object
          const detailRes = await axios.get('/api/bookmarks');
          if (detailRes.data.success) {
            setBookmarks(detailRes.data.data);
          }
          return true; // Bookmarked now
        }
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      throw new Error(err.response?.data?.message || 'Failed to update bookmark');
    }
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, loading, isBookmarked, toggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export default BookmarkContext;
