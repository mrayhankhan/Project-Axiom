"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Send, ThumbsUp, ThumbsDown, Copy, RotateCcw, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: Source[];
    timestamp: string;
}

interface Source {
    id: string;
    document: string;
    page: number;
    snippet: string;
    similarity: number;
}

const mockMessages: Message[] = [
    {
        id: '1',
        role: 'user',
        content: 'What are the key risk factors for the credit scoring model mentioned in the documentation?',
        timestamp: '10:23 AM'
    },
    {
        id: '2',
        role: 'assistant',
        content: 'Based on the credit risk model documentation, the key risk factors include:\n\n1. **Data Quality Risk**: The model relies on historical credit data that may contain biases or outdated information. Regular validation is required to ensure data accuracy.\n\n2. **Model Drift**: Changes in economic conditions can cause the model\'s predictions to become less accurate over time. Monthly monitoring is recommended.\n\n3. **Regulatory Compliance**: The model must adhere to fair lending practices and explainability requirements under current regulations.\n\n4. **Feature Importance Stability**: Critical features like debt-to-income ratio and payment history should maintain consistent importance weights.\n\nThe documentation recommends quarterly reviews and immediate investigation if accuracy drops below 92%.',
        sources: [
            {
                id: '1',
                document: 'Credit Risk Model Documentation v2.3.pdf',
                page: 12,
                snippet: 'Key risk factors include data quality, model drift, and regulatory compliance requirements...',
                similarity: 0.94
            },
            {
                id: '2',
                document: 'Model Risk Assessment Report Q4.pdf',
                page: 8,
                snippet: 'The credit scoring model shows sensitivity to changes in debt-to-income ratios...',
                similarity: 0.89
            }
        ],
        timestamp: '10:23 AM'
    }
];

export default function QA() {
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [input, setInput] = useState('');
    const [selectedModel, setSelectedModel] = useState('GPT-4');
    const [showSources, setShowSources] = useState(true);
    const [temperature, setTemperature] = useState(0.7);

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setInput('');

        // Simulate assistant response
        setTimeout(() => {
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'I\'m analyzing your question and retrieving relevant information from the knowledge base...',
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, assistantMessage]);
        }, 500);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 overflow-hidden">
                {/* Chat Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-surface-a30">
                    <div>
                        <h3 className="font-semibold text-text-primary">Intelligence Q&A</h3>
                        <p className="text-sm text-text-muted">Ask questions about your documents and models</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="px-3 py-1.5 text-sm border border-surface-a40 rounded-md focus:border-primary-a30 focus:ring-2 focus:ring-primary-a30/25 bg-surface-a10 dark:bg-surface-a20 text-text-primary"
                        >
                            <option>GPT-4</option>
                            <option>GPT-3.5 Turbo</option>
                            <option>Claude 2</option>
                        </select>
                        <Button variant="secondary" size="sm">New Chat</Button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {message.role === 'assistant' && (
                                <div className="flex-shrink-0 w-8 h-8 bg-primary-a30 rounded-full flex items-center justify-center mr-3">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                            )}
                            <div className={`max-w-3xl ${message.role === 'user' ? 'ml-12' : 'mr-12'}`}>
                                <div className={cn(
                                    "rounded-lg px-4 py-3",
                                    message.role === 'user'
                                        ? 'bg-primary-a30 dark:bg-primary-a40 text-text-primary'
                                        : 'bg-surface-a20 dark:bg-surface-a30 text-text-primary'
                                )}>
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                </div>
                                <div className="flex items-center gap-2 mt-2 px-1">
                                    <span className="text-xs text-text-muted">{message.timestamp}</span>
                                    {message.role === 'assistant' && (
                                        <>
                                            <button className="p-1 hover:bg-surface-a20 rounded" title="Copy">
                                                <Copy className="w-3.5 h-3.5 text-text-muted" />
                                            </button>
                                            <button className="p-1 hover:bg-surface-a20 rounded" title="Regenerate">
                                                <RotateCcw className="w-3.5 h-3.5 text-text-muted" />
                                            </button>
                                            <button className="p-1 hover:bg-surface-a20 rounded" title="Good response">
                                                <ThumbsUp className="w-3.5 h-3.5 text-text-muted" />
                                            </button>
                                            <button className="p-1 hover:bg-surface-a20 rounded" title="Bad response">
                                                <ThumbsDown className="w-3.5 h-3.5 text-text-muted" />
                                            </button>
                                        </>
                                    )}
                                </div>
                                {message.sources && message.sources.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <p className="text-xs font-medium text-text-secondary">Sources ({message.sources.length})</p>
                                        {message.sources.map((source) => (
                                            <SourceCard key={source.id} source={source} />
                                        ))}
                                    </div>
                                )}
                            </div>
                            {message.role === 'user' && (
                                <div className="flex-shrink-0 w-8 h-8 bg-surface-a40 rounded-full flex items-center justify-center ml-3 text-white text-sm font-medium">
                                    JD
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="border-t border-surface-a30 p-4">
                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Ask a question about your documents..."
                                rows={3}
                                className="w-full px-4 py-3 border border-surface-a40 rounded-lg resize-none focus:border-primary-a30 focus:ring-2 focus:ring-primary-a30/25 transition-all bg-surface-a10 dark:bg-surface-a20 text-text-primary placeholder:text-text-muted"
                            />
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-text-muted">Press Enter to send, Shift+Enter for new line</p>
                                <p className="text-xs text-text-muted">{input.length} characters</p>
                            </div>
                        </div>
                        <Button
                            variant="primary"
                            size="lg"
                            icon={<Send className="w-4 h-4" />}
                            onClick={handleSend}
                            disabled={!input.trim()}
                        >
                            Send
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right Panel - Context & Settings */}
            <div className="w-80 lg:w-96 space-y-4 overflow-y-auto">
                {/* Context Selection */}
                <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-4">
                    <h4 className="font-semibold text-text-primary mb-3">Context Selection</h4>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 p-2 rounded hover:bg-surface-a20 cursor-pointer">
                            <input type="radio" name="context" defaultChecked className="text-primary-a40 focus:ring-primary-a30" />
                            <span className="text-sm text-text-primary">All Documents</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 rounded hover:bg-surface-a20 cursor-pointer">
                            <input type="radio" name="context" className="text-primary-a40 focus:ring-primary-a30" />
                            <span className="text-sm text-text-primary">Selected Folders</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 rounded hover:bg-surface-a20 cursor-pointer">
                            <input type="radio" name="context" className="text-primary-a40 focus:ring-primary-a30" />
                            <span className="text-sm text-text-primary">Manual Selection</span>
                        </label>
                    </div>
                </div>

                {/* Retriever Settings */}
                <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-4">
                    <h4 className="font-semibold text-text-primary mb-3">Retriever Settings</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-text-secondary mb-1">Top K Results</label>
                            <input
                                type="number"
                                defaultValue={5}
                                min={1}
                                max={20}
                                className="w-full px-3 py-2 border border-surface-a40 rounded-md focus:border-primary-a30 focus:ring-2 focus:ring-primary-a30/25 bg-surface-a10 dark:bg-surface-a20 text-text-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-text-secondary mb-2">Temperature: {temperature}</label>
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.1}
                                value={temperature}
                                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                className="w-full accent-primary-a30"
                            />
                            <div className="flex justify-between text-xs text-text-muted mt-1">
                                <span>Precise</span>
                                <span>Creative</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-text-secondary mb-1">Max Response Length</label>
                            <select className="w-full p-2 border rounded-md" defaultValue="Long (1024 tokens)">
                                <option>Short (256 tokens)</option>
                                <option>Medium (512 tokens)</option>
                                <option>Long (1024 tokens)</option>
                                <option>Very Long (2048 tokens)</option>
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" defaultChecked className="rounded text-primary-a40 focus:ring-primary-a30" />
                                <span className="text-sm text-text-primary">Show explainability</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-4">
                    <h4 className="font-semibold text-text-primary mb-3">Filters</h4>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm text-text-secondary mb-1">Date Range</label>
                            <select className="w-full px-3 py-2 border border-surface-a40 rounded-md text-sm focus:border-primary-a30 focus:ring-2 focus:ring-primary-a30/25 bg-surface-a10 dark:bg-surface-a20 text-text-primary">
                                <option>All time</option>
                                <option>Last 7 days</option>
                                <option>Last 30 days</option>
                                <option>Last 90 days</option>
                                <option>Custom range</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-text-secondary mb-1">Document Tags</label>
                            <div className="flex flex-wrap gap-1">
                                <Badge variant="neutral" size="sm">risk</Badge>
                                <Badge variant="neutral" size="sm">model</Badge>
                                <Badge variant="neutral" size="sm">compliance</Badge>
                                <button className="text-xs text-primary-a40 hover:text-primary-a50">+ Add tag</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SourceCard({ source }: { source: Source }) {
    return (
        <div className="p-3 bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 hover:border-primary-a30 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{source.document}</p>
                    <p className="text-xs text-text-muted">Page {source.page}</p>
                </div>
                <Badge variant="info" size="sm">{(source.similarity * 100).toFixed(0)}%</Badge>
            </div>
            <p className="text-xs text-text-secondary line-clamp-2">{source.snippet}</p>
            <button className="flex items-center gap-1 mt-2 text-xs text-primary-a40 hover:text-primary-a50">
                <span>View in document</span>
                <ChevronRight className="w-3 h-3" />
            </button>
        </div>
    );
}
