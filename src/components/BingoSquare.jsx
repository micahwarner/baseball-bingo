import React from 'react';
import { getEventEmoji } from '../utils/bingoEvents';

const BingoSquare = ({ cell, row, col, onToggle, isWinning, animationSyncKey, settings = {} }) => {
    const { event, marked, isFree } = cell;
    const showEmojis = settings.showEmojis !== false; // Default to true
    const reducedMotion = settings.reducedMotion || false;
    const showWinAnimations = settings.showWinAnimations !== false; // Default to true
    const highContrast = settings.highContrast || false;
    const fontSize = settings.fontSize || 'normal';

    const fontSizeClasses = {
        small: 'text-xs sm:text-xs md:text-sm',
        normal: 'text-xs sm:text-sm md:text-base',
        large: 'text-sm sm:text-base md:text-lg'
    };

    const animationSpeed = settings.animationSpeed || 'normal';
    const animationClass = reducedMotion ? '' : {
        slow: 'animate-bounce-slow-slow',
        normal: 'animate-bounce-slow',
        fast: 'animate-bounce-slow-fast'
    }[animationSpeed] || 'animate-bounce-slow';

    const transitionDuration = reducedMotion ? 0 : ({
        slow: 450,
        normal: 300,
        fast: 150
    }[animationSpeed] || 300);

    const handleClick = () => {
        if (!isFree) {
            onToggle(row, col);
        }
    };

    const borderWidth = highContrast ? 'border-4' : 'border-2';
    const markedBorder = highContrast && marked ? 'border-yellow-400' : '';
    const unmarkedBorder = highContrast && !marked ? 'border-gray-500 dark:border-gray-400' : '';

    return (
        <button
            onClick={handleClick}
            className={`
        relative aspect-square p-2 rounded-lg ${borderWidth}
        ${reducedMotion ? '' : 'transition-all transform'}
        flex flex-col items-center justify-center
        ${fontSizeClasses[fontSize]}
        font-semibold
        ${marked
                    ? `bg-baseball-blue dark:bg-gradient-to-br dark:from-blue-700 dark:to-blue-800 text-white border-baseball-blue dark:border-blue-500 ${reducedMotion ? '' : 'scale-95'} ${markedBorder} ${highContrast ? 'marked-square' : ''}`
                    : `bg-white dark:bg-slate-700/80 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-slate-600 ${reducedMotion ? '' : 'hover:border-baseball-red dark:hover:border-red-500 hover:scale-105'} ${unmarkedBorder}`
                }
        ${isFree ? 'bg-grass-green dark:bg-gradient-to-br dark:from-green-700 dark:to-green-800 text-white cursor-default' : 'cursor-pointer'}
        ${reducedMotion ? '' : 'active:scale-90'}
        ${isWinning && showWinAnimations && !reducedMotion ? `${animationClass} ring-4 ring-yellow-400` : isWinning ? 'ring-4 ring-yellow-400' : ''}
      `}
            style={reducedMotion ? {} : {
                transitionDuration: `${transitionDuration}ms`
            }}
            disabled={isFree}
            aria-label={`${event}${marked ? ' - Marked' : ''}${isFree ? ' - Free Space' : ''}`}
        >
            {/* Emoji */}
            {showEmojis && (
                <span className={`${fontSize === 'small' ? 'text-xl sm:text-2xl' : fontSize === 'large' ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'} mb-1`}>
                    {getEventEmoji(event)}
                </span>
            )}

            {/* Event name */}
            <span className="text-center leading-tight">
                {event}
            </span>

            {/* Checkmark overlay */}
            {marked && !isFree && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                        className="w-16 h-16 text-yellow-300 opacity-90"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            )}
        </button>
    );
};

export default BingoSquare;