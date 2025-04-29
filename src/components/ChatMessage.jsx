import React from 'react';

// This component shows a single chat message
// It handles both user and AI messages
function ChatMessage({ message }) {
    return (
        <div className={`message-container ${message.role === 'user' ? 'user' : ''}`}>
            {/* Show user or AI avatar */}
            <div className={`message-avatar ${message.role === 'user' ? 'user' : 'bot'}`}>
                {message.role === 'user' ? 'U' : 'AI'}
            </div>
            {/* Message content with optional image */}
            <div className="message-content">
                {message.content}
                {message.imageUrl && (
                    <div className="message-image">
                        <img src={message.imageUrl} alt="Generated" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatMessage; 