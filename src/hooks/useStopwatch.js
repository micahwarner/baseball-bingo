import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for stopwatch functionality
 * @param {boolean} isRunning - Whether the stopwatch should be running
 * @param {number} startTime - Timestamp when the stopwatch started (milliseconds)
 * @returns {Object} Stopwatch state and controls
 */
export const useStopwatch = (isRunning, startTime) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);
  const lastUpdateRef = useRef(startTime || Date.now());

  const updateElapsedTime = useCallback(() => {
    if (startTime && startTime > 0) {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000); // Convert to seconds
      setElapsedTime(elapsed);
      lastUpdateRef.current = now;
    } else {
      setElapsedTime(0);
    }
  }, [startTime]);

  useEffect(() => {
    if (isRunning && startTime && startTime > 0) {
      updateElapsedTime();
      
      intervalRef.current = setInterval(() => {
        updateElapsedTime();
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (startTime && startTime > 0 && !isRunning) {
        updateElapsedTime();
      } else {
        setElapsedTime(0);
      }
    }
  }, [isRunning, startTime, updateElapsedTime]);

  const formatTime = useCallback((seconds) => {
    if (!seconds && seconds !== 0) return '00:00';
    
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, []);

  return {
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    formatTime
  };
};

