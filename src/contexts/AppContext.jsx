import React, { createContext, useContext, useState, useEffect } from 'react';
import { categoryService } from '../services/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // Initialize default categories if none exist
      try {
        await categoryService.initialize();
        const response = await categoryService.getAll();
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (initError) {
        console.error('Error initializing categories:', initError);
      }
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const value = {
    categories,
    loading,
    refreshKey,
    refresh,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
