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
    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 bg-white bg-opacity-20 dark:bg-opacity-30 dark:hover:bg-opacity-40 hover:bg-opacity-30 rounded-lg transition-colors p-1 sm:p-1.5 md:p-2 flex-shrink-0">
      <span className="text-base sm:text-lg md:text-xl">⏱️</span>
      <span
        className={`font-mono font-semibold text-xs sm:text-sm md:text-base ${isPaused ? 'text-yellow-300' : 'text-white'
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

