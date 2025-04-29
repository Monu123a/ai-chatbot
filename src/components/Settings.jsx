import React from 'react';
import { X, Moon, Sun, MessageSquare, Clock, Zap } from 'lucide-react';

function SettingsPanel({ isOpen, onClose, settings, onSettingsChange }) {
    if (!isOpen) return null;

    return (
        <div className="settings-overlay">
            <div className="settings-panel">
                <div className="settings-header">
                    <h2>Settings</h2>
                    <button className="close-button" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="settings-content">
                    {/* Theme Settings */}
                    <div className="settings-section">
                        <h3>Theme</h3>
                        <div className="theme-options">
                            <button
                                className={`theme-option ${settings.theme === 'light' ? 'active' : ''}`}
                                onClick={() => onSettingsChange({ ...settings, theme: 'light' })}
                            >
                                <Sun className="w-5 h-5" />
                                <span>Light</span>
                            </button>
                            <button
                                className={`theme-option ${settings.theme === 'dark' ? 'active' : ''}`}
                                onClick={() => onSettingsChange({ ...settings, theme: 'dark' })}
                            >
                                <Moon className="w-5 h-5" />
                                <span>Dark</span>
                            </button>
                        </div>
                    </div>

                    {/* Message Settings */}
                    <div className="settings-section">
                        <h3>Message Settings</h3>
                        <div className="setting-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={settings.markdownSupport}
                                    onChange={(e) => onSettingsChange({ ...settings, markdownSupport: e.target.checked })}
                                />
                                Enable Markdown Support
                            </label>
                        </div>
                        <div className="setting-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={settings.codeHighlighting}
                                    onChange={(e) => onSettingsChange({ ...settings, codeHighlighting: e.target.checked })}
                                />
                                Enable Code Highlighting
                            </label>
                        </div>
                    </div>

                    {/* Performance Settings */}
                    <div className="settings-section">
                        <h3>Performance</h3>
                        <div className="setting-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={settings.autoScroll}
                                    onChange={(e) => onSettingsChange({ ...settings, autoScroll: e.target.checked })}
                                />
                                Auto-scroll to new messages
                            </label>
                        </div>
                        <div className="setting-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={settings.messageAnimation}
                                    onChange={(e) => onSettingsChange({ ...settings, messageAnimation: e.target.checked })}
                                />
                                Enable message animations
                            </label>
                        </div>
                    </div>

                    {/* Data Settings */}
                    <div className="settings-section">
                        <h3>Data & Privacy</h3>
                        <div className="setting-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={settings.saveHistory}
                                    onChange={(e) => onSettingsChange({ ...settings, saveHistory: e.target.checked })}
                                />
                                Save chat history
                            </label>
                        </div>
                        <button className="clear-history-button" onClick={() => onSettingsChange({ ...settings, clearHistory: true })}>
                            Clear Chat History
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsPanel; 