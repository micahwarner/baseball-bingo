import React, { useState } from 'react';
import {
    copyToClipboard,
    shareToTwitter,
    shareToFacebook,
    generateCardUrl,
    getShareText
} from '../utils/shareUtils';

const ShareModal = ({ show, onClose, card, winState, onShareCard, onShareWin }) => {
    const [copied, setCopied] = useState(false);
    const [sharing, setSharing] = useState(false);

    if (!show) return null;

    const cardUrl = generateCardUrl(card);
    const shareText = getShareText(winState || {});

    const handleCopyUrl = async () => {
        const success = await copyToClipboard(cardUrl);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShareCard = async () => {
        setSharing(true);
        try {
            await onShareCard();
        } finally {
            setSharing(false);
        }
    };

    const handleShareWin = async () => {
        setSharing(true);
        try {
            await onShareWin();
        } finally {
            setSharing(false);
        }
    };

    const handleTwitterShare = () => {
        shareToTwitter(shareText, cardUrl);
    };

    const handleFacebookShare = () => {
        shareToFacebook(shareText, cardUrl);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 dark:bg-opacity-80">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-950 max-w-md w-full p-6 transform transition-all duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Share Your Card
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold transition-colors"
                        aria-label="Close share modal"
                    >
                        ×
                    </button>
                </div>

                {/* Share Options */}
                <div className="space-y-4">
                    {/* Image Sharing */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Share as Image
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={handleShareCard}
                                disabled={sharing}
                                className="flex-1 bg-baseball-blue dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {sharing ? '⏳' : '📷'} Share Card
                            </button>
                            {winState?.hasBingo && (
                                <button
                                    onClick={handleShareWin}
                                    disabled={sharing}
                                    className="flex-1 bg-green-600 dark:bg-green-600 hover:bg-green-700 dark:hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    {sharing ? '⏳' : '🏆'} Share Win
                                </button>
                            )}
                        </div>
                    </div>

                    {/* URL Sharing */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Share Link
                        </h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={cardUrl}
                                readOnly
                                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 text-sm"
                            />
                            <button
                                onClick={handleCopyUrl}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition-colors"
                            >
                                {copied ? '✓ Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    {/* Social Sharing */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Share on Social Media
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={handleTwitterShare}
                                className="flex-1 bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <span>🐦</span> Twitter
                            </button>
                            <button
                                onClick={handleFacebookShare}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <span>📘</span> Facebook
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
