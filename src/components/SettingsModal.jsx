import React, { useState, useRef } from 'react';

const SettingsModal = ({ show, onClose, settings, onUpdateSetting, onResetSettings, onExportSettings, onImportSettings, onExportStats, onClearStats, hasStats }) => {
    const fileInputRef = useRef(null);
    const [importError, setImportError] = useState(null);

    if (!show) return null;

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileImport = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImportError(null);
        const success = await onImportSettings(file);
        if (success) {
            // Reset file input
            event.target.value = '';
        } else {
            setImportError('Failed to import settings. Please check the file format.');
        }
    };

    const handleClearStats = () => {
        if (window.confirm('Are you sure you want to clear all statistics? This cannot be undone.')) {
            onClearStats();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 dark:bg-opacity-80">
            <div className="bg-white dark:bg-slate-800/95 dark:border dark:border-blue-800/40 rounded-2xl shadow-2xl dark:shadow-blue-950/50 max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300">
                {/* Header */}
                <div className="sticky top-0 bg-baseball-blue dark:bg-gradient-to-r dark:from-blue-900 dark:to-indigo-900 text-white p-6 rounded-t-2xl flex items-center justify-between z-10">
                    <h2 className="text-3xl font-bold">⚙️ Settings</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-300 text-2xl font-bold transition-colors"
                        aria-label="Close settings"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Sound Settings */}
                    <section className="bg-gray-50 dark:bg-slate-700/40 dark:border dark:border-blue-800/20 rounded-lg p-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                            🔊 Sound Settings
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-gray-700 dark:text-gray-300 font-medium">
                                    Enable Sound Effects
                                </label>
                                <button
                                    onClick={() => onUpdateSetting('soundEnabled', !settings.soundEnabled)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.soundEnabled ? 'bg-baseball-red' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {settings.soundEnabled && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-gray-700 dark:text-gray-300 font-medium">
                                            Volume
                                        </label>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {Math.round(settings.soundVolume * 100)}%
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={settings.soundVolume}
                                        onChange={(e) => onUpdateSetting('soundVolume', parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-baseball-red"
                                    />
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Display Settings */}
                    <section className="bg-gray-50 dark:bg-slate-700/40 dark:border dark:border-blue-800/20 rounded-lg p-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                            🎨 Display Settings
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-gray-700 dark:text-gray-300 font-medium">
                                    Theme
                                </label>
                                <select
                                    value={settings.theme}
                                    onChange={(e) => {
                                        onUpdateSetting('theme', e.target.value);
                                    }}
                                    className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-gray-700 dark:text-gray-300 font-medium">
                                    Show Emojis
                                </label>
                                <button
                                    onClick={() => onUpdateSetting('showEmojis', !settings.showEmojis)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showEmojis ? 'bg-baseball-red' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showEmojis ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-gray-700 dark:text-gray-300 font-medium">
                                    Font Size
                                </label>
                                <select
                                    value={settings.fontSize}
                                    onChange={(e) => onUpdateSetting('fontSize', e.target.value)}
                                    className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
                                >
                                    <option value="small">Small</option>
                                    <option value="normal">Normal</option>
                                    <option value="large">Large</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-gray-700 dark:text-gray-300 font-medium">
                                    Animation Speed
                                </label>
                                <select
                                    value={settings.animationSpeed}
                                    onChange={(e) => onUpdateSetting('animationSpeed', e.target.value)}
                                    className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
                                >
                                    <option value="slow">Slow</option>
                                    <option value="normal">Normal</option>
                                    <option value="fast">Fast</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Game Settings */}
                    <section className="bg-gray-50 dark:bg-slate-700/40 dark:border dark:border-blue-800/20 rounded-lg p-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                            🎮 Game Settings
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-gray-700 dark:text-gray-300 font-medium block">
                                        Win Animations
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Show animations when you win
                                    </p>
                                </div>
                                <button
                                    onClick={() => onUpdateSetting('showWinAnimations', !settings.showWinAnimations)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showWinAnimations ? 'bg-baseball-red' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showWinAnimations ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-gray-700 dark:text-gray-300 font-medium block">
                                        Confetti on Win
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Show confetti animation when you win
                                    </p>
                                </div>
                                <button
                                    onClick={() => onUpdateSetting('showConfetti', !settings.showConfetti)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showConfetti ? 'bg-baseball-red' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showConfetti ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Accessibility Settings */}
                    <section className="bg-gray-50 dark:bg-slate-700/40 dark:border dark:border-blue-800/20 rounded-lg p-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                            ♿ Accessibility
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-gray-700 dark:text-gray-300 font-medium block">
                                        Reduced Motion
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Reduce animations and transitions
                                    </p>
                                </div>
                                <button
                                    onClick={() => onUpdateSetting('reducedMotion', !settings.reducedMotion)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.reducedMotion ? 'bg-baseball-red' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-gray-700 dark:text-gray-300 font-medium block">
                                        High Contrast
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Increase contrast for better visibility
                                    </p>
                                </div>
                                <button
                                    onClick={() => onUpdateSetting('highContrast', !settings.highContrast)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.highContrast ? 'bg-baseball-red' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Statistics Settings */}
                    <section className="bg-gray-50 dark:bg-slate-700/40 dark:border dark:border-blue-800/20 rounded-lg p-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                            📊 Statistics
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-gray-700 dark:text-gray-300 font-medium block">
                                        Track Statistics
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Enable statistics tracking
                                    </p>
                                </div>
                                <button
                                    onClick={() => onUpdateSetting('trackStatistics', !settings.trackStatistics)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.trackStatistics ? 'bg-baseball-red' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.trackStatistics ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {hasStats && (
                                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                    <button
                                        onClick={onExportStats}
                                        className="flex-1 px-4 py-2 bg-baseball-blue dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        📥 Export Stats
                                    </button>
                                    <button
                                        onClick={handleClearStats}
                                        className="flex-1 px-4 py-2 bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        🗑️ Clear Stats
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Data Management */}
                    <section className="bg-gray-50 dark:bg-slate-700/40 dark:border dark:border-blue-800/20 rounded-lg p-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                            💾 Data Management
                        </h3>
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <button
                                    onClick={onExportSettings}
                                    className="flex-1 px-4 py-2 bg-green-600 dark:bg-green-600 hover:bg-green-700 dark:hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    📥 Export Settings
                                </button>
                                <button
                                    onClick={handleImportClick}
                                    className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    📤 Import Settings
                                </button>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleFileImport}
                                className="hidden"
                            />
                            {importError && (
                                <p className="text-sm text-red-600 dark:text-red-400">{importError}</p>
                            )}
                            <button
                                onClick={onResetSettings}
                                className="w-full px-4 py-2 bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                🔄 Reset All Settings
                            </button>
                        </div>
                    </section>

                    {/* Notifications */}
                    <section className="bg-gray-50 dark:bg-slate-700/40 dark:border dark:border-blue-800/20 rounded-lg p-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                            🔔 Notifications
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-gray-700 dark:text-gray-300 font-medium">
                                    Show Toast Notifications
                                </label>
                                <button
                                    onClick={() => onUpdateSetting('showToasts', !settings.showToasts)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showToasts ? 'bg-baseball-red' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showToasts ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {settings.showToasts && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-gray-700 dark:text-gray-300 font-medium">
                                            Toast Duration (ms)
                                        </label>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {settings.toastDuration}ms
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1000"
                                        max="10000"
                                        step="500"
                                        value={settings.toastDuration}
                                        onChange={(e) => onUpdateSetting('toastDuration', parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-baseball-red"
                                    />
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 dark:bg-slate-900/90 p-4 rounded-b-2xl border-t border-gray-200 dark:border-blue-800/30">
                    <button
                        onClick={onClose}
                        className="w-full bg-baseball-red dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;

