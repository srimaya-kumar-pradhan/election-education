/**
 * Gemini AI Service (Client-side)
 * 
 * In production, the Gemini API is called via Cloud Functions only.
 * This service handles client-side communication with the chat Cloud Function.
 * For demo/development, it can also call the Gemini API directly.
 */

import { CHATBOT_SYSTEM_PROMPT, VALIDATION } from '../utils/constants';
import { validateChatMessage, sanitizeInput } from '../utils/validators';

/**
 * Sends a message to the Gemini-powered chat backend.
 * In production, this calls a Firebase Cloud Function.
 * For demo mode, it uses the Google Generative AI SDK directly.
 * 
 * @param {string} userMessage - The user's message
 * @param {Array} history - Previous messages in the conversation
 * @param {string|null} authToken - Firebase auth token
 * @returns {Promise<string>} The AI response
 */
export async function sendChatMessage(userMessage, history = [], authToken = null) {
  /* Validate input */
  const validation = validateChatMessage(userMessage);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const sanitizedMessage = sanitizeInput(userMessage);

  /**
   * Demo mode: Uses the Google Generative AI SDK directly.
   * In production, replace this with a Cloud Function call.
   */
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'demo-api-key') {
      /* Return a demo response when no API key is configured */
      return getDemoResponse(sanitizedMessage);
    }

    /**
     * Call Gemini API via REST endpoint.
     * In production, this should be a Cloud Function callable instead.
     */
    const contents = buildConversationContents(sanitizedMessage, history);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: CHATBOT_SYSTEM_PROMPT }],
          },
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
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', errorData);
      throw new Error('Failed to get response from AI assistant.');
    }

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'I apologize, I could not generate a response. Please try again.';

    return reply;
  } catch (error) {
    console.error('Chat service error:', error);
    if (error.message.includes('Failed to get response')) {
      throw error;
    }
    throw new Error('Unable to connect to the AI assistant. Please try again later.');
  }
}

/**
 * Builds the conversation contents array for Gemini API
 * @param {string} currentMessage
 * @param {Array} history
 * @returns {Array}
 */
function buildConversationContents(currentMessage, history) {
  const contents = [];

  /* Add conversation history */
  for (const msg of history) {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    });
  }

  /* Add current user message */
  contents.push({
    role: 'user',
    parts: [{ text: currentMessage }],
  });

  return contents;
}

/**
 * Returns a demo response when no API key is configured.
 * Provides realistic responses for common election queries.
 * @param {string} message
 * @returns {string}
 */
function getDemoResponse(message) {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('id') || lowerMsg.includes('document') || lowerMsg.includes('identity')) {
    return `📋 **Accepted Photo ID Documents at Polling Booth:**

• Voter ID Card (EPIC) — most preferred
• Aadhaar Card
• Passport
• Driving Licence
• PAN Card
• MNREGA Job Card
• Bank/Post Office Passbook with photo
• Smart Card issued by RGI under NPR

💡 **Tip:** Carry your Voter ID card as it's the most universally accepted document at all polling stations.`;
  }

  if (lowerMsg.includes('register') || lowerMsg.includes('registration') || lowerMsg.includes('enroll')) {
    return `📝 **How to Register as a Voter:**

1. **Online:** Visit [nvsp.in](https://www.nvsp.in) and fill Form 6
2. **Offline:** Visit your nearest ERO (Electoral Registration Officer) office
3. **Documents needed:**
   • Age proof (birth certificate, school certificate)
   • Address proof (Aadhaar, utility bill, bank statement)
   • Passport-size photograph

⏰ **Timeline:** Registration typically takes 2-4 weeks for verification.

💡 You must be 18+ years old on the qualifying date (January 1st of the year).`;
  }

  if (lowerMsg.includes('evm') || lowerMsg.includes('machine') || lowerMsg.includes('electronic')) {
    return `🗳️ **About Electronic Voting Machines (EVMs):**

• EVMs are standalone, battery-operated devices
• Each EVM can record up to 2,000 votes
• They are **not connected** to any network or internet
• EVMs use a one-time programmable chip that cannot be reprogrammed

**How to vote on an EVM:**
1. The presiding officer will activate the ballot unit
2. Press the blue button next to your chosen candidate
3. A beep and light confirm your vote
4. Check the VVPAT slip (displayed for 7 seconds)

✅ EVMs have been used in India since 1982 and are designed for tamper-proof voting.`;
  }

  if (lowerMsg.includes('nota') || lowerMsg.includes('none of the above')) {
    return `🚫 **About NOTA (None of the Above):**

• NOTA is always the **last option** on the EVM ballot unit
• It was introduced by the Supreme Court in September 2013
• Allows voters to reject all candidates without abstaining
• NOTA votes are counted but **do not affect** the election result
• Even if NOTA gets majority, the candidate with most votes wins

💡 Exercising NOTA is a democratic right — it sends a message to political parties about voter dissatisfaction.`;
  }

  if (lowerMsg.includes('booth') || lowerMsg.includes('polling') || lowerMsg.includes('station')) {
    return `🏛️ **Polling Booth Procedure:**

1. **Queue up** at your designated polling station
2. **Show your ID** to the polling officer
3. **Sign/thumbprint** the register
4. **Receive ink mark** on your left index finger
5. **Enter the voting compartment** (private)
6. **Press your choice** on the EVM
7. **Verify** VVPAT slip (7 seconds)
8. **Exit** the booth

⏰ **Polling hours:** Usually 7:00 AM to 6:00 PM
📍 **Find your booth:** Visit voters.eci.gov.in

💡 If you're in the queue before 6 PM, you **will** be allowed to vote.`;
  }

  return `🗳️ **Welcome to VoteWise!**

I can help you with:
• **Voter Registration** — How to register and required documents
• **Polling Booth** — What to expect on election day
• **EVM & VVPAT** — How electronic voting works
• **Eligibility** — Check if you can vote
• **NOTA** — Understanding the "None of the Above" option
• **Election Phases** — Timeline and important dates

Try asking me something like:
_"What documents do I need to vote?"_ or _"How do I register as a voter?"_

I'm here to make voting easy and accessible for everyone! 🇮🇳`;
}
