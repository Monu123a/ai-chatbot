import React, { useState } from 'react';
import { Send } from 'lucide-react';

function ChatInput({ onSend, isLoading }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSend(input);
            setInput('');
        }
    };

    return (
        <form className="chat-input-container" onSubmit={handleSubmit}>
            <input
                type="text"
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
            />
            <button 
                type="submit" 
                className="send-button"
                disabled={isLoading || !input.trim()}
            >
                <Send className="w-5 h-5" />
            </button>
        </form>
    );
}

export default ChatInput; 




