import { useState, useCallback } from 'react';

/**
 * Custom hook for managing toast notifications
 * @returns {Object} Toast controls and state
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  /**
   * Show a toast notification
   * @param {string} message - Toast message
   * @param {Object} options - Toast options
   * @param {string} options.type - Toast type: 'success', 'error', 'info', 'warning'
   * @param {number} options.duration - Auto-dismiss duration in ms (0 = no auto-dismiss)
   */
  const showToast = useCallback((message, options = {}) => {
    const { type = 'info', duration = 3000 } = options;
    const id = Date.now() + Math.random();

    setToasts(prev => [...prev, { id, message, type, duration }]);

    // Return cleanup function
    return () => {
      removeToast(id);
    };
  }, []);

  /**
   * Remove a toast by ID
   */
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  /**
   * Show success toast
   */
  const showSuccess = useCallback((message, duration = 3000) => {
    return showToast(message, { type: 'success', duration });
  }, [showToast]);

  /**
   * Show error toast
   */
  const showError = useCallback((message, duration = 5000) => {
    return showToast(message, { type: 'error', duration });
  }, [showToast]);

  /**
   * Show warning toast
   */
  const showWarning = useCallback((message, duration = 4000) => {
    return showToast(message, { type: 'warning', duration });
  }, [showToast]);

  /**
   * Show info toast
   */
  const showInfo = useCallback((message, duration = 3000) => {
    return showToast(message, { type: 'info', duration });
  }, [showToast]);

  /**
   * Clear all toasts
   */
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearAll
  };
};

