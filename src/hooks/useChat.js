/**
 * useChat Hook
 * Manages chat state and interaction with the Gemini AI service.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/gemini';
import { saveChatMessage, fetchChatHistory, logAnalyticsEvent } from '../services/firebase';
import { ANALYTICS_EVENTS } from '../utils/constants';

/**
 * Custom hook for managing chatbot interactions
 * @param {object|null} user - Firebase auth user
 * @returns {{ messages, isLoading, error, sendMessage, clearChat }}
 */
export function useChat(user) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  /* Load chat history on mount when user is authenticated */
  useEffect(() => {
    if (user?.uid) {
      loadChatHistory(user.uid);
    } else {
      setMessages([]);
    }
  }, [user?.uid]);

  /* Auto-scroll to bottom on new messages */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Loads chat history from Firestore
   * @param {string} uid
   */
  async function loadChatHistory(uid) {
    try {
      const history = await fetchChatHistory(uid);
      if (history.length > 0) {
        setMessages(
          history.map((msg) => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp,
          }))
        );
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
    }
  }

  /**
   * Sends a user message and gets the AI response
   * @param {string} messageText
   */
  const sendMessage = useCallback(
    async (messageText) => {
      if (!messageText.trim()) return;

      setError(null);
      const userMsg = { role: 'user', content: messageText, timestamp: new Date() };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        /* Build conversation history for context */
        const history = messages.map((m) => ({ role: m.role, content: m.content }));

        /* Send to AI service */
        const reply = await sendChatMessage(messageText, history);

        const assistantMsg = { role: 'model', content: reply, timestamp: new Date() };
        setMessages((prev) => [...prev, assistantMsg]);

        /* Save to Firestore if authenticated */
        if (user?.uid) {
          await saveChatMessage(user.uid, 'user', messageText);
          await saveChatMessage(user.uid, 'model', reply);
        }

        /* Analytics */
        logAnalyticsEvent(ANALYTICS_EVENTS.CHAT_MESSAGE_SENT, {
          message_length: messageText.length,
        });
      } catch (err) {
        setError(err.message);
        /* Remove the user message on error */
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, user]
  );

  /**
   * Clears all messages from the chat
   */
  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    messagesEndRef,
  };
}
