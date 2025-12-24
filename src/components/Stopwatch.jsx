import React from 'react';
import { useStopwatch } from '../hooks/useStopwatch';

/**
 * Stopwatch component to display game time
 * @param {Object} props
 * @param {boolean} props.isRunning - Whether the stopwatch is running
 * @param {number} props.startTime - Timestamp when the stopwatch started (milliseconds)
 * @param {boolean} props.isPaused - Whether the stopwatch is paused (eg after a win)
 */
const Stopwatch = ({ isRunning, startTime, isPaused = false }) => {
  const { formattedTime } = useStopwatch(isRunning && !isPaused, startTime);

  return (
    <div className="flex items-center gap-2 bg-white bg-opacity-20 dark:bg-opacity-30 px-3 py-1.5 rounded-full">
      <span className="text-lg">⏱️</span>
      <span
        className={`font-mono font-semibold text-sm sm:text-base ${isPaused ? 'text-yellow-300' : 'text-white'
          }`}
        aria-label={`Game time: ${formattedTime}`}
      >
        {formattedTime}
      </span>
      {isPaused && (
        <span className="text-xs text-yellow-300" title="Timer paused">
          ⏸
        </span>
      )}
    </div>
  );
};

export default Stopwatch;

