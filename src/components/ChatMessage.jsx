import React from 'react';

function ChatMessage({ message }) {
    return (
        <div className={`message-container ${message.role === 'user' ? 'user' : ''}`}>
            <div className={`message-avatar ${message.role === 'user' ? 'user' : 'bot'}`}>
                {message.role === 'user' ? 'U' : 'AI'}
            </div>
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