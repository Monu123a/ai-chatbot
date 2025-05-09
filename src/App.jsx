import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MessageSquare, Plus, Settings, User, LogOut, Clock, Menu, X } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import SettingsPanel from './components/Settings';
import QuickActions from './components/QuickActions';
import './styles.css';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBGwuQ51cvsZPhlULCOouK7a1NkwvZ_W8I');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'nvupk-mbbHdRuuGYjfHgOdrHPZU7OS83cS7Ov460jf0';
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

function App() {
    const [chatState, setChatState] = useState({
        messages: [],
        isLoading: false,
        error: null,
        currentChatId: null,
        currentMode: 'general',
    });

    const [chatHistory, setChatHistory] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [appSettings, setAppSettings] = useState(() => {
        const savedSettings = localStorage.getItem('appSettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            theme: 'light',
            markdownSupport: true,
            codeHighlighting: true,
            autoScroll: true,
            messageAnimation: true,
            saveHistory: true,
        };
    });

    // Load chat history from localStorage on component mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
            setChatHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Save chat history to localStorage whenever it changes
    useEffect(() => {
        if (appSettings.saveHistory) {
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        }
    }, [chatHistory, appSettings.saveHistory]);

    // Save settings to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('appSettings', JSON.stringify(appSettings));
        document.documentElement.setAttribute('data-theme', appSettings.theme);
    }, [appSettings]);

    const searchImage = async (query) => {
        try {
            console.log('Searching image with query:', query);
            console.log('Using Unsplash key:', UNSPLASH_ACCESS_KEY);
            
            const response = await fetch(
                `${UNSPLASH_API_URL}?query=${encodeURIComponent(query)}&per_page=1`,
                {
                    headers: {
                        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Unsplash API error:', errorData);
                throw new Error('Failed to search image');
            }

            const data = await response.json();
            if (data.results && data.results.length > 0) {
                return data.results[0].urls.regular;
            } else {
                throw new Error('No images found');
            }
        } catch (error) {
            console.error('Error searching image:', error);
            throw error;
        }
    };

    const handleSendMessage = async (content) => {
        try {
            setChatState((prev) => ({
                ...prev,
                isLoading: true,
                messages: [...prev.messages, { role: 'user', content }],
            }));

            let response;
            if (chatState.currentMode === 'image') {
                console.log('Generating image for:', content);
                const imageUrl = await searchImage(content);
                response = {
                    role: 'assistant',
                    content: `Here's an image related to "${content}":`,
                    imageUrl: imageUrl
                };
            } else {
                console.log('Generating text for:', content);
                const result = await model.generateContent(content);
                const text = result.response.text();
                response = {
                    role: 'assistant',
                    content: text
                };
            }

            const newMessages = [
                ...chatState.messages,
                { role: 'user', content },
                response
            ];

            setChatState((prev) => ({
                ...prev,
                isLoading: false,
                messages: newMessages,
            }));

            // Update chat history
            if (chatState.currentChatId) {
                setChatHistory((prev) =>
                    prev.map((chat) =>
                        chat.id === chatState.currentChatId
                            ? { ...chat, messages: newMessages, lastUpdated: new Date().toISOString() }
                            : chat
                    )
                );
            } else {
                const newChat = {
                    id: Date.now().toString(),
                    title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
                    messages: newMessages,
                    lastUpdated: new Date().toISOString(),
                    mode: chatState.currentMode,
                };
                setChatHistory((prev) => [newChat, ...prev]);
                setChatState((prev) => ({ ...prev, currentChatId: newChat.id }));
            }
        } catch (error) {
            console.error('Error in handleSendMessage:', error);
            setChatState((prev) => ({
                ...prev,
                isLoading: false,
                error: 'Failed to generate answer',
            }));
        }
    };

    const handleNewChat = () => {
        setChatState({
            messages: [],
            isLoading: false,
            error: null,
            currentChatId: null,
            currentMode: 'general',
        });
        setIsSidebarOpen(false);
    };

    const handleLoadChat = (chatId) => {
        const chat = chatHistory.find((c) => c.id === chatId);
        if (chat) {
            setChatState({
                messages: chat.messages,
                isLoading: false,
                error: null,
                currentChatId: chat.id,
                currentMode: chat.mode || 'general',
            });
            setIsSidebarOpen(false);
        }
    };

    const handleDeleteChat = (chatId, e) => {
        e.stopPropagation();
        setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));
        if (chatState.currentChatId === chatId) {
            handleNewChat();
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSettingsChange = (newSettings) => {
        if (newSettings.clearHistory) {
            setChatHistory([]);
            localStorage.removeItem('chatHistory');
            handleNewChat();
            newSettings.clearHistory = false;
        }
        setAppSettings(newSettings);
    };

    const handleQuickAction = (action) => {
        setChatState((prev) => ({
            ...prev,
            currentMode: action.id,
            messages: [
                { role: 'assistant', content: action.prompt }
            ],
        }));
    };

    return (
        <div className="app-container">
            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <button className="new-chat-button" onClick={handleNewChat}>
                        <Plus className="w-5 h-5" />
                        New Chat
                    </button>
                    <button className="close-sidebar-button" onClick={toggleSidebar}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="sidebar-content">
                    <div className="chat-history">
                        {chatHistory.map((chat) => (
                            <div
                                key={chat.id}
                                className={`chat-history-item ${chat.id === chatState.currentChatId ? 'active' : ''}`}
                                onClick={() => handleLoadChat(chat.id)}
                            >
                                <div className="chat-history-item-content">
                                    <Clock className="w-4 h-4" />
                                    <span className="chat-title">{chat.title}</span>
                                </div>
                                <button
                                    className="delete-chat-button"
                                    onClick={(e) => handleDeleteChat(chat.id, e)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sidebar-footer">
                    <button className="sidebar-button">
                        <User className="w-5 h-5" />
                        Account
                    </button>
                    <button className="sidebar-button" onClick={() => setIsSettingsOpen(true)}>
                        <Settings className="w-5 h-5" />
                        Settings
                    </button>
                    <button className="sidebar-button">
                        <LogOut className="w-5 h-5" />
                        Log Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Header */}
                <div className="header">
                    <button className="menu-button" onClick={toggleSidebar}>
                        <Menu className="w-6 h-6" />
                    </button>
                    <MessageSquare className="w-6 h-6 text-primary-color" />
                    <h1>AI Chatbot</h1>
                </div>

                {/* Chat Container */}
                <div className="chat-container">
                    {chatState.messages.length === 0 ? (
                        <QuickActions onSelectAction={handleQuickAction} />
                    ) : (
                    <div className="messages-container">
                        {chatState.messages.map((message, index) => (
                            <ChatMessage key={index} message={message} />
                        ))}
                        {chatState.isLoading && (
                            <div className="loading-spinner">
                                <div className="loading-text">Loading...</div>
                            </div>
                        )}
                        {chatState.error && (
                            <div className="error-message">Failed to generate answer</div>
                        )}
                    </div>
                    )}

                    {/* Input */}
                    <ChatInput onSend={handleSendMessage} isLoading={chatState.isLoading} />
                </div>

                {/* Footer */}
                <div className="footer">
                    <p>Developed and designed by Harsh Ahlawat</p>
                </div>
            </div>

            {/* Settings Panel */}
            <SettingsPanel
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={appSettings}
                onSettingsChange={handleSettingsChange}
            />
        </div>
    );
}

export default App; 