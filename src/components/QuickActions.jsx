import React from 'react';

// This component shows quick action buttons for different chat modes
function QuickActions({ onSelectAction }) {
    // List of available quick actions
    const actions = [
        {
            id: 'general',
            name: 'General Chat',
            description: 'Ask me anything!',
            prompt: 'Hello! How can I help you today?'
        },
        {
            id: 'image',
            name: 'Image Search',
            description: 'Search for images',
            prompt: 'What kind of image would you like to see?'
        }
    ];

    return (
        <div className="quick-actions">
            <h2>Select a Mode</h2>
            <div className="actions-grid">
                {actions.map((action) => (
                    <button
                        key={action.id}
                        className="action-button"
                        onClick={() => onSelectAction(action)}
                    >
                        <h3>{action.name}</h3>
                        <p>{action.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default QuickActions; 