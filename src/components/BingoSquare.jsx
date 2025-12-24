import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { getEventEmoji } from '../utils/bingoEvents';

const BingoSquare = forwardRef(({ cell, row, col, onToggle, isWinning, animationSyncKey, settings = {} }, ref) => {
    const { event, marked, isFree } = cell;
    const showEmojis = settings.showEmojis !== false; // Default to true
    const reducedMotion = settings.reducedMotion || false;
    const showWinAnimations = settings.showWinAnimations !== false; // Default to true
    const highContrast = settings.highContrast || false;
    const fontSize = settings.fontSize || 'normal';

    const fontSizeClasses = {
        small: 'text-[9px] sm:text-[10px] md:text-xs',
        normal: 'text-[10px] sm:text-xs md:text-sm',
        large: 'text-xs sm:text-sm md:text-base'
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

    // CSS-based font size classes using clamp
    const textSizeClasses = {
        small: 'bingo-square-text-small',
        normal: 'bingo-square-text-normal',
        large: 'bingo-square-text-large'
    };

    const squareRef = useRef(null);
    const textRef = useRef(null);
    const emojiRef = useRef(null);

    // Expose measurement method to parent
    useImperativeHandle(ref, () => ({
        measureHeight: () => {
            if (!squareRef.current || !textRef.current) return null;

            const square = squareRef.current;
            const textElement = textRef.current;
            const emojiElement = emojiRef.current;

            // Get the actual content height needed
            const emojiHeight = emojiElement && showEmojis ? emojiElement.offsetHeight + parseFloat(getComputedStyle(emojiElement).marginBottom) : 0;
            const textHeight = textElement.scrollHeight;
            const padding = parseFloat(getComputedStyle(square).paddingTop) * 2;

            // Return the minimum height needed for this square
            return emojiHeight + textHeight + padding;
        }
    }));

    return (
        <button
            ref={squareRef}
            onClick={handleClick}
            className={`
        relative w-full p-1 sm:p-2 rounded-lg ${borderWidth}
        ${reducedMotion ? '' : 'transition-all transform'}
        flex flex-col items-center justify-center overflow-hidden
        font-semibold min-w-0 h-full
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
            {showEmojis && (
                <span ref={emojiRef} className={`bingo-square-emoji ${fontSize === 'small' ? 'text-lg sm:text-xl md:text-2xl' : fontSize === 'large' ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-xl sm:text-2xl md:text-3xl'} mb-0.5 sm:mb-1 flex-shrink-0`}>
                    {getEventEmoji(event)}
                </span>
            )}

            <span ref={textRef} className={`bingo-square-text ${textSizeClasses[fontSize]} text-center leading-tight px-0.5 sm:px-1 w-full min-w-0`}>
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
});

BingoSquare.displayName = 'BingoSquare';

export default BingoSquare;