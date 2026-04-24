/**
 * Gemini AI Chat Service
 *
 * Handles communication with the AI election assistant.
 * In production, all Gemini API calls are routed through Firebase Cloud Functions
 * to keep the API key server-side only.
 * In demo/offline mode (no API key configured), returns curated static responses.
 *
 * Google Service: Gemini 1.5 Pro via Cloud Functions (firebase-functions/v2)
 */

import { CHATBOT_SYSTEM_PROMPT, VALIDATION } from '../utils/constants';
import { validateChatMessage, sanitizeInput } from '../utils/validators';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth } from 'firebase/auth';
import app from './firebase';

/** Firebase Cloud Functions reference — initialized once and reused */
const functions = getFunctions(app);
const chatCallable = httpsCallable(functions, 'chatHandler');

/**
 * Sends a message to the Gemini-powered chat backend via Cloud Functions.
 * Falls back to demo responses when the Cloud Function is unavailable.
 *
 * @param {string} userMessage - The user's message
 * @param {Array} history - Previous messages in the conversation
 * @param {object|null} userContext - Optional user context (eligibility, first-time voter status)
 * @returns {Promise<string>} The AI response
 */
export async function sendChatMessage(userMessage, history = [], userContext = null) {
  /* Validate input before sending */
  const validation = validateChatMessage(userMessage);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const sanitizedMessage = sanitizeInput(userMessage);

  try {
    const auth = getAuth(app);
    const currentUser = auth.currentUser;

    if (!currentUser) {
      /* If user is not authenticated, use demo responses */
      return getDemoResponse(sanitizedMessage, userContext);
    }

    /**
     * Call chatHandler Cloud Function.
     * The function handles Gemini API calls server-side, keeping the API key secure.
     * It also performs rate limiting and saves chat history to Firestore.
     */
    const result = await chatCallable({
      userMessage: sanitizedMessage,
      history: history.map((msg) => ({ role: msg.role, content: msg.content })),
      userContext: userContext || {},
    });

    return result.data.reply;
  } catch (error) {
    console.error('Chat service error:', error);

    /* Parse Cloud Function error codes into user-friendly messages */
    if (error.code === 'functions/unauthenticated') {
      throw new Error('Please sign in to use the chat.');
    }
    if (error.code === 'functions/resource-exhausted') {
      throw new Error('You have reached your hourly message limit. Please try again later.');
    }
    if (error.code === 'functions/invalid-argument') {
      throw new Error(error.message || 'Invalid message. Please try again.');
    }

    /* Fallback to demo responses on any Cloud Function failure (e.g., not deployed, network error) */
    console.warn('Cloud Function unavailable, using demo response.');
    return getDemoResponse(sanitizedMessage, userContext);
  }
}

/**
 * Returns a context-aware demo response when Cloud Functions are unavailable.
 * Responses are matched based on keyword analysis of the user's message and
 * personalized using any available user context (e.g., eligibility results).
 *
 * @param {string} message - Sanitized user message
 * @param {object|null} userContext - User context for personalization
 * @returns {string} A curated response
 */
function getDemoResponse(message, userContext = null) {
  const lowerMsg = message.toLowerCase();

  /* Build a context-aware greeting prefix when user context is available */
  let contextPrefix = '';
  if (userContext?.eligibilityResult) {
    const { eligible, inputs } = userContext.eligibilityResult;
    if (!eligible && inputs?.age < 18) {
      contextPrefix = `Since you're ${inputs.age} years old, you'll be eligible to vote in ${18 - inputs.age} year${18 - inputs.age > 1 ? 's' : ''}. In the meantime, here's some useful information:\n\n`;
    } else if (eligible && inputs?.residenceStatus === 'nri') {
      contextPrefix = `As an NRI voter, here's what's relevant to you:\n\n`;
    }
  }

  if (lowerMsg.includes('id') || lowerMsg.includes('document') || lowerMsg.includes('identity')) {
    return `${contextPrefix}📋 **Accepted Photo ID Documents at Polling Booth:**

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
    return `${contextPrefix}📝 **How to Register as a Voter:**

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
    return `${contextPrefix}🗳️ **About Electronic Voting Machines (EVMs):**

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
    return `${contextPrefix}🚫 **About NOTA (None of the Above):**

• NOTA is always the **last option** on the EVM ballot unit
• It was introduced by the Supreme Court in September 2013
• Allows voters to reject all candidates without abstaining
• NOTA votes are counted but **do not affect** the election result
• Even if NOTA gets majority, the candidate with most votes wins

💡 Exercising NOTA is a democratic right — it sends a message to political parties about voter dissatisfaction.`;
  }

  if (lowerMsg.includes('booth') || lowerMsg.includes('polling') || lowerMsg.includes('station')) {
    return `${contextPrefix}🏛️ **Polling Booth Procedure:**

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

  if (lowerMsg.includes('eligible') || lowerMsg.includes('age') || lowerMsg.includes('can i vote')) {
    if (userContext?.eligibilityResult) {
      const { eligible, reason, details } = userContext.eligibilityResult;
      return `Based on the eligibility check you completed earlier:\n\n${eligible ? '✅' : '❌'} **${reason}**\n\n${details}\n\nWould you like to know more about the voter registration process or what documents you'll need?`;
    }
    return `To check your voter eligibility, you need to be:\n\n• 🇮🇳 An **Indian citizen**\n• 🎂 At least **18 years old** on the qualifying date (January 1st)\n• 📍 A **resident** of the constituency where you want to vote\n\nUse our **Eligibility Checker** tool for a quick check, or ask me specific questions!`;
  }

  /* Default welcome message — personalized if context is available */
  const userName = userContext?.displayName?.split(' ')[0];
  const greeting = userName ? `Hello, ${userName}! ` : '';

  return `🗳️ **${greeting}Welcome to VoteWise!**

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
