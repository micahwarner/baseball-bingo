import React from 'react';
import Toast from './Toast';

/**
 * Container component for displaying multiple toast notifications
 * @param {Object} props
 * @param {Array} props.toasts - Array of toast objects
 * @param {Function} props.onRemove - Callback to remove a toast
 * @param {number} props.defaultDuration - Default duration for toasts
 */
const ToastContainer = ({ toasts, onRemove, defaultDuration = 3000 }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration !== undefined ? toast.duration : defaultDuration}
            show={true}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

