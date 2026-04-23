/**
 * Chat Page
 * AI-powered chatbot interface with message bubbles and input bar
 */

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { VALIDATION, ROUTES } from '../utils/constants';
import './Chat.css';

/**
 * @param {{ user: object|null, onSignIn: Function }} props
 */
export default function Chat({ user, onSignIn }) {
  const { messages, isLoading, error, sendMessage, clearChat, messagesEndRef } = useChat(user);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleSuggestion = (text) => {
    if (isLoading) return;
    sendMessage(text);
  };

  const suggestions = [
    'What documents do I need to vote?',
    'How do I register as a voter?',
    'What is NOTA?',
    'How does an EVM work?',
  ];

  if (!user) {
    return (
      <div className="chat-auth-gate page-container animate-fadeIn">
        <div className="chat-auth-content">
          <div className="chat-auth-icon" aria-hidden="true">💬</div>
          <h1 className="chat-auth-title">AI Election Assistant</h1>
          <p className="chat-auth-description">
            Sign in to chat with our AI-powered election assistant. Ask any question about
            voting, registration, documents, or election procedures.
          </p>
          <button className="btn btn-primary btn-lg" onClick={onSignIn} id="chat-sign-in">
            Sign In to Start Chatting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-header-avatar" aria-hidden="true">🗳️</div>
          <div>
            <h1 className="chat-header-title">VoteWise AI</h1>
            <span className="chat-header-status">
              <span className="status-dot" aria-hidden="true" />
              Online — Powered by Gemini
            </span>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={clearChat}
            aria-label="Clear chat history"
          >
            Clear Chat
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="chat-messages" role="log" aria-live="polite" aria-label="Chat messages">
        {messages.length === 0 ? (
          <div className="chat-welcome animate-fadeIn">
            <div className="chat-welcome-icon" aria-hidden="true">🗳️</div>
            <h2 className="chat-welcome-title">Hello, {user.displayName?.split(' ')[0] || 'there'}!</h2>
            <p className="chat-welcome-text">
              I am your AI election assistant. Ask me anything about Indian elections,
              voting procedures, eligibility, or documents.
            </p>
            <div className="chat-suggestions">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  className="chat-suggestion"
                  onClick={() => handleSuggestion(s)}
                  id={`suggestion-${i}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-model'} animate-fadeInUp`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {msg.role === 'model' && (
                  <div className="chat-bubble-avatar" aria-hidden="true">🗳️</div>
                )}
                <div className="chat-bubble-content">
                  <div className="chat-bubble-text" dangerouslySetInnerHTML={{
                    __html: formatMessage(msg.content)
                  }} />
                </div>
              </div>
            ))}
          </>
        )}

        {isLoading && (
          <div className="chat-bubble chat-bubble-model animate-fadeIn">
            <div className="chat-bubble-avatar" aria-hidden="true">🗳️</div>
            <div className="chat-bubble-content">
              <div className="chat-typing" aria-label="VoteWise is typing">
                <span className="chat-typing-dot" />
                <span className="chat-typing-dot" />
                <span className="chat-typing-dot" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="chat-error animate-fadeIn" role="alert">
            <span aria-hidden="true">⚠️</span> {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form className="chat-input-bar" onSubmit={handleSubmit}>
        <div className="chat-input-container">
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about elections, voting, registration..."
            maxLength={VALIDATION.MAX_MESSAGE_LENGTH}
            disabled={isLoading}
            aria-label="Type your message"
            id="chat-input"
          />
          <span className="chat-char-count" aria-hidden="true">
            {input.length}/{VALIDATION.MAX_MESSAGE_LENGTH}
          </span>
          <button
            type="submit"
            className="chat-send-btn"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            id="chat-send"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Formats messages with basic markdown-like transformations
 * @param {string} text
 * @returns {string} HTML string
 */
function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^• /gm, '<span class="bullet">•</span> ')
    .replace(/^- /gm, '<span class="bullet">•</span> ')
    .replace(/\n/g, '<br/>');
}
