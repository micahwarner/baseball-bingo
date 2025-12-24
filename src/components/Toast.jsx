import React, { useEffect, useState } from 'react';

/**
 * Toast notification component
 * @param {Object} props
 * @param {string} props.message - Toast message
 * @param {string} props.type - Toast type: 'success', 'error', 'info', 'warning'
 * @param {number} props.duration - Auto-dismiss duration in ms (0 = no auto-dismiss)
 * @param {Function} props.onClose - Callback when toast is closed
 * @param {boolean} props.show - Whether to show the toast
 */
const Toast = ({ message, type = 'info', duration = 3000, onClose, show = true }) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setIsVisible(show);
    if (!show) {
      setIsLeaving(true);
    }
  }, [show]);

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300); // Match transition duration
  };

  if (!isVisible && !isLeaving) return null;

  const typeStyles = {
    success: 'bg-green-500 text-white border-green-600',
    error: 'bg-red-500 text-white border-red-600',
    warning: 'bg-yellow-500 text-white border-yellow-600',
    info: 'bg-blue-500 text-white border-blue-600'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50 min-w-[300px] max-w-md
        ${typeStyles[type] || typeStyles.info}
        rounded-lg shadow-lg border-2 p-4
        flex items-center justify-between gap-4
        transform transition-all duration-300 ease-in-out
        ${isLeaving ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}
      `}
      role="alert"
      aria-live="assertive"
      style={{
        boxShadow: type === 'warning'
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          : undefined
      }}
    >
      <div className="flex items-center gap-3 flex-1">
        <span className="text-2xl font-bold flex-shrink-0">{icons[type] || icons.info}</span>
        <p className="font-semibold flex-1">{message}</p>
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-white hover:bg-white/20 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;

