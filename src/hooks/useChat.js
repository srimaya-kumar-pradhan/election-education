/**
 * useChat Hook
 *
 * Manages chat state and interaction with the Gemini AI service.
 * Provides context-aware messaging by passing user eligibility results
 * and profile data to the AI service for personalized responses.
 *
 * Key behaviors:
 * - Loads chat history from Firestore on mount (authenticated users)
 * - Passes full conversation history for multi-turn context
 * - Passes user context (eligibility, first-time voter status) for smart responses
 * - Chat saving is handled server-side by the Cloud Function to avoid duplicates
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/gemini';
import { fetchChatHistory, logAnalyticsEvent } from '../services/firebase';
import { ANALYTICS_EVENTS } from '../utils/constants';

/**
 * Custom hook for managing chatbot interactions
 * @param {object|null} user - Firebase auth user
 * @param {object|null} userData - Firestore user document (includes eligibilityResult, isFirstTimeVoter)
 * @returns {{ messages, isLoading, error, sendMessage, clearChat, messagesEndRef }}
 */
export function useChat(user, userData = null) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  /** Ref to hold latest messages to avoid stale closures in sendMessage callback */
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

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
   * Builds user context object for the AI service.
   * This enables context-aware responses based on the user's profile and
   * previous interactions (e.g., eligibility check results).
   * @returns {object|null}
   */
  const buildUserContext = useCallback(() => {
    if (!user && !userData) return null;

    return {
      displayName: user?.displayName || null,
      isFirstTimeVoter: userData?.isFirstTimeVoter ?? null,
      eligibilityResult: userData?.eligibilityResult || null,
    };
  }, [user, userData]);

  /**
   * Sends a user message and gets the AI response.
   * Uses messagesRef to avoid stale closure — sendMessage identity is stable.
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
        /* Build conversation history for multi-turn context */
        const history = messagesRef.current.map((m) => ({ role: m.role, content: m.content }));

        /* Build user context for smart, personalized responses */
        const userContext = buildUserContext();

        /* Send to AI service (Cloud Function or demo fallback) */
        const reply = await sendChatMessage(messageText, history, userContext);

        const assistantMsg = { role: 'model', content: reply, timestamp: new Date() };
        setMessages((prev) => [...prev, assistantMsg]);

        /**
         * Note: Chat history is saved server-side by the Cloud Function.
         * We do NOT save from the client to avoid duplicate messages.
         */

        /* Analytics */
        logAnalyticsEvent(ANALYTICS_EVENTS.CHAT_MESSAGE_SENT, {
          message_length: messageText.length,
        });
      } catch (err) {
        setError(err.message);
        /* Remove the user message on error to keep the UI consistent */
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
      }
    },
    [buildUserContext]
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
