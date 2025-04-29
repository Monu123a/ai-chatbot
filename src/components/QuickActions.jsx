import React from 'react';
import { Code, Book, PenTool, Calculator, Sparkles, Image } from 'lucide-react';

const quickActions = [
    {
        id: 'general',
        name: 'General AI',
        icon: Sparkles,
        description: 'General purpose AI assistant',
        prompt: 'I am your general AI assistant. How can I help you today?'
    },
    {
        id: 'coding',
        name: 'Coding Mode',
        icon: Code,
        description: 'Get help with programming and code',
        prompt: 'I am your coding assistant. I can help you with programming, debugging, and code explanations. What would you like to work on?'
    },
    {
        id: 'writing',
        name: 'Writing Assistant',
        icon: PenTool,
        description: 'Help with writing and content creation',
        prompt: 'I am your writing assistant. I can help you with essays, articles, and creative writing. What would you like to write about?'
    },
    {
        id: 'math',
        name: 'Math Mode',
        icon: Calculator,
        description: 'Get help with mathematics and calculations',
        prompt: 'I am your math assistant. I can help you with calculations, equations, and mathematical concepts. What math problem would you like to solve?'
    },
    {
        id: 'summarize',
        name: 'Summarize',
        icon: Book,
        description: 'Summarize text and content',
        prompt: 'I can help you summarize text, articles, or any content. Please share what you would like me to summarize.'
    },
    {
        id: 'image',
        name: 'Image Search',
        icon: Image,
        description: 'Search for images on the web',
        prompt: 'I can help you find images. What would you like to search for?'
    }
];

function QuickActions({ onSelectAction }) {
    return (
        <div className="quick-actions">
            <div className="quick-actions-header">
                <h3>Quick Actions</h3>
                <p>Select a mode to get started</p>
            </div>
            <div className="quick-actions-grid">
                {quickActions.map((action) => (
                    <button
                        key={action.id}
                        className="quick-action-button"
                        onClick={() => onSelectAction(action)}
                    >
                        <div className="quick-action-icon">
                            <action.icon className="w-6 h-6" />
                        </div>
                        <div className="quick-action-content">
                            <h4>{action.name}</h4>
                            <p>{action.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default QuickActions; 