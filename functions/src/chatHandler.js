/**
 * chatHandler Cloud Function
 * HTTPS Callable function that handles chat messages via Gemini AI.
 *
 * Security:
 * - Requires Firebase Auth token
 * - Rate-limits to 30 requests/user/hour
 * - Sanitizes all inputs before sending to Gemini
 * - Never exposes API keys to client
 */

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { initializeApp } = require('firebase-admin/app');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/* Initialize Firebase Admin (idempotent) */
try {
  initializeApp();
} catch (e) {
  /* Already initialized */
}

const db = getFirestore();

/** System prompt for the election assistant */
const SYSTEM_PROMPT = `You are VoteWise, an expert, friendly, and neutral election assistant for Indian voters. You only answer questions related to elections, voting procedures, voter registration, eligible documents, EVMs, NOTA, election phases, and civic rights. For off-topic questions, politely redirect the user to election topics. Keep answers concise (under 150 words), factual, and beginner-friendly. Use bullet points where helpful. Never express political bias.`;

/** Rate limit: max requests per hour */
const MAX_REQUESTS_PER_HOUR = 30;

/**
 * Sanitizes user input string
 * @param {string} input
 * @returns {string}
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Checks rate limit for a user
 * @param {string} uid
 * @returns {Promise<boolean>} true if within limit
 */
async function checkRateLimit(uid) {
  const rateLimitRef = db.collection('rateLimits').doc(uid);
  const now = Date.now();
  const oneHourAgo = now - 3600000;

  try {
    const doc = await rateLimitRef.get();
    if (!doc.exists) {
      await rateLimitRef.set({ requests: [now] });
      return true;
    }

    const data = doc.data();
    const recentRequests = (data.requests || []).filter((t) => t > oneHourAgo);

    if (recentRequests.length >= MAX_REQUESTS_PER_HOUR) {
      return false;
    }

    recentRequests.push(now);
    await rateLimitRef.update({ requests: recentRequests });
    return true;
  } catch (error) {
    console.error('Rate limit check error:', error);
    return true; /* Allow on error to not block users */
  }
}

/**
 * Chat handler Cloud Function
 */
const chatHandler = onCall(
  {
    maxInstances: 10,
    timeoutSeconds: 60,
    memory: '256MiB',
  },
  async (request) => {
    /* Authentication check */
    if (!request.auth) {
      throw new HttpsError(
        'unauthenticated',
        'You must be signed in to use the chat.'
      );
    }

    const uid = request.auth.uid;
    const { userMessage, history } = request.data;

    /* Input validation */
    if (!userMessage || typeof userMessage !== 'string') {
      throw new HttpsError(
        'invalid-argument',
        'Message is required and must be a string.'
      );
    }

    const sanitizedMessage = sanitizeInput(userMessage);

    if (sanitizedMessage.length === 0) {
      throw new HttpsError('invalid-argument', 'Message cannot be empty.');
    }

    if (sanitizedMessage.length > 500) {
      throw new HttpsError(
        'invalid-argument',
        'Message must be under 500 characters.'
      );
    }

    /* Rate limit check */
    const withinLimit = await checkRateLimit(uid);
    if (!withinLimit) {
      throw new HttpsError(
        'resource-exhausted',
        'Rate limit exceeded. Please try again later.'
      );
    }

    try {
      /* Initialize Gemini */
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new HttpsError(
          'internal',
          'AI service is not configured. Please contact support.'
        );
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-pro',
        systemInstruction: SYSTEM_PROMPT,
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 512,
        },
      });

      /* Build conversation history */
      const chatHistory = (history || []).map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      /* Start chat with history */
      const chat = model.startChat({ history: chatHistory });
      const result = await chat.sendMessage(sanitizedMessage);
      const reply = result.response.text();

      /* Save to Firestore */
      const chatRef = db.collection('users').doc(uid).collection('chatHistory');
      const batch = db.batch();

      batch.create(chatRef.doc(), {
        role: 'user',
        content: sanitizedMessage,
        timestamp: FieldValue.serverTimestamp(),
      });

      batch.create(chatRef.doc(), {
        role: 'model',
        content: reply,
        timestamp: FieldValue.serverTimestamp(),
      });

      await batch.commit();

      return { reply };
    } catch (error) {
      console.error('Chat handler error:', error);

      if (error instanceof HttpsError) {
        throw error;
      }

      throw new HttpsError(
        'internal',
        'Unable to process your message. Please try again.'
      );
    }
  }
);

module.exports = { chatHandler };
