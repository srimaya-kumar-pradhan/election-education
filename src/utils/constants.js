/**
 * @fileoverview Centralized constants for VoteWise application.
 * All string literals, route paths, collection names, config values,
 * and UI labels are defined here and imported where needed.
 * Never hardcode strings directly in components.
 * @module constants
 */

// ── Application Metadata ─────────────────────────────────────────

/** @constant {string} Application display name */
export const APP_NAME = 'VoteWise';

/** @constant {string} Application tagline shown in hero sections */
export const APP_TAGLINE = 'Your AI-Powered Election Assistant';

/** @constant {string} Application description for SEO and hero */
export const APP_DESCRIPTION =
  'VoteWise helps Indian citizens — especially first-time voters — understand elections, check eligibility, and navigate the voting process with confidence.';

/** @constant {string} Semantic version of the application */
export const APP_VERSION = '2.0.0';

// ── Navigation Labels ────────────────────────────────────────────

/**
 * @constant {Object} NAV_LABELS - Navigation link display text.
 */
export const NAV_LABELS = {
  HOME: 'Home',
  CHAT: 'Chat',
  JOURNEY: 'Journey',
  FAQ: 'FAQ',
  PROFILE: 'Profile',
  ELIGIBILITY: 'Eligibility',
  TIMELINE: 'Timeline',
  ONBOARDING: 'Onboarding',
};

// ── Route Paths ──────────────────────────────────────────────────

/**
 * @constant {Object} ROUTES - All application route paths.
 * Use these instead of hardcoded strings in Link and navigate().
 */
export const ROUTES = {
  HOME: '/',
  CHAT: '/chat',
  JOURNEY: '/journey',
  FAQ: '/faq',
  PROFILE: '/profile',
  ELIGIBILITY: '/eligibility',
  TIMELINE: '/timeline',
  ONBOARDING: '/onboarding',
};

// ── Design Tokens ────────────────────────────────────────────────

/**
 * @constant {Object} COLORS - Brand color palette for the application.
 */
export const COLORS = {
  PRIMARY: '#1A73E8',
  PRIMARY_DARK: '#1557B0',
  PRIMARY_LIGHT: '#4A90E2',
  SUCCESS: '#34A853',
  ERROR: '#EA4335',
  WARNING: '#FBBC04',
  SURFACE: '#FFFFFF',
  SURFACE_DARK: '#0F1419',
  BACKGROUND: '#F8F9FA',
  BACKGROUND_DARK: '#1A1D23',
  TEXT_PRIMARY: '#202124',
  TEXT_SECONDARY: '#5F6368',
  TEXT_INVERSE: '#FFFFFF',
  BORDER: '#DADCE0',
  SHADOW: 'rgba(0, 0, 0, 0.08)',
};

// ── Firestore Collection Names ───────────────────────────────────

/**
 * @constant {Object} COLLECTIONS - Firestore collection identifiers.
 * Use these to prevent typos in collection name strings.
 */
export const COLLECTIONS = {
  USERS: 'users',
  FAQS: 'faqs',
  JOURNEY_STEPS: 'journeySteps',
  TIMELINE_PHASES: 'timelinePhases',
  CHAT_HISTORY: 'chatHistory',
  RATE_LIMITS: 'rateLimits',
};

// ── Chatbot Configuration ────────────────────────────────────────

/**
 * @constant {string} CHATBOT_SYSTEM_PROMPT - System prompt for Gemini AI.
 */
export const CHATBOT_SYSTEM_PROMPT = `You are VoteWise, an expert, friendly, and neutral election assistant for Indian voters. You only answer questions related to elections, voting procedures, voter registration, eligible documents, EVMs, NOTA, election phases, and civic rights. For off-topic questions, politely redirect the user to election topics. Keep answers concise (under 150 words), factual, and beginner-friendly. Use bullet points where helpful. Never express political bias.`;

// ── Input Validation ─────────────────────────────────────────────

/**
 * @constant {Object} VALIDATION - Input validation limits and thresholds.
 */
export const VALIDATION = {
  MAX_MESSAGE_LENGTH: 500,
  MIN_AGE: 1,
  MAX_AGE: 120,
  VOTING_AGE: 18,
  MAX_REQUESTS_PER_HOUR: 30,
};

// ── Form Options ─────────────────────────────────────────────────

/**
 * @constant {Array} FAQ_CATEGORIES - FAQ filter category options.
 */
export const FAQ_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'documents', label: 'Documents' },
  { id: 'registration', label: 'Registration' },
  { id: 'booth', label: 'Booth' },
  { id: 'evm', label: 'EVM' },
  { id: 'general', label: 'General' },
];

/**
 * @constant {Array} CITIZENSHIP_OPTIONS - Dropdown options for citizenship.
 */
export const CITIZENSHIP_OPTIONS = [
  { value: 'indian', label: 'Indian Citizen' },
  { value: 'other', label: 'Other' },
];

/**
 * @constant {Array} RESIDENCE_OPTIONS - Dropdown options for residence status.
 */
export const RESIDENCE_OPTIONS = [
  { value: 'resident', label: 'Indian Resident' },
  { value: 'nri', label: 'NRI (Non-Resident Indian)' },
];

// ── Timeline Status ──────────────────────────────────────────────

/**
 * @constant {Object} TIMELINE_STATUS - Election phase status identifiers.
 */
export const TIMELINE_STATUS = {
  COMPLETED: 'completed',
  ACTIVE: 'active',
  UPCOMING: 'upcoming',
};

// ── Booth Steps (First-time Voter Guide) ─────────────────────────

/**
 * @constant {Array} BOOTH_STEPS - Polling booth procedure steps.
 */
export const BOOTH_STEPS = [
  {
    id: 1,
    title: 'Arrive at the Polling Booth',
    description: 'Reach your designated polling station on election day. Carry your voter ID or any approved photo identification.',
    icon: '🏛️',
  },
  {
    id: 2,
    title: 'Show Your ID',
    description: 'Present your Voter ID card or approved photo ID to the polling officer for verification against the electoral roll.',
    icon: '🪪',
  },
  {
    id: 3,
    title: 'Get Ink Mark',
    description: 'After verification, indelible ink is applied to your left index finger to prevent duplicate voting.',
    icon: '✍️',
  },
  {
    id: 4,
    title: 'Cast Your Vote on EVM',
    description: 'Enter the voting compartment. Press the button next to your chosen candidate on the Electronic Voting Machine.',
    icon: '🗳️',
  },
  {
    id: 5,
    title: 'VVPAT Confirmation',
    description: 'Check the VVPAT slip displayed for 7 seconds to confirm your vote was recorded correctly. It then drops into the sealed box.',
    icon: '✅',
  },
];

// ── Error Messages ───────────────────────────────────────────────

/**
 * @constant {Object} ERRORS - Standardized user-facing error messages.
 */
export const ERRORS = {
  AUTH_REQUIRED: 'Please sign in to continue.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  MESSAGE_TOO_LONG: `Message must be under ${500} characters.`,
  MESSAGE_EMPTY: 'Please enter a message.',
  RATE_LIMIT: 'You have reached your hourly message limit. Please try again later.',
  UNAUTHENTICATED: 'Please sign in to use this feature.',
  INVALID_INPUT: 'Please check your input and try again.',
  FIRESTORE_READ: 'Failed to load data. Please refresh the page.',
  FIRESTORE_WRITE: 'Failed to save data. Please try again.',
  FUNCTION_CALL: 'Service temporarily unavailable. Please try again in a moment.',
  AUTH_POPUP: 'Sign-in popup was blocked or closed. Please allow popups and try again.',
};

// ── Success Messages ─────────────────────────────────────────────

/**
 * @constant {Object} SUCCESS - Standardized user-facing success messages.
 */
export const SUCCESS = {
  SIGNED_IN: 'Welcome to VoteWise!',
  SIGNED_OUT: 'You have been signed out.',
  ELIGIBILITY_SAVED: 'Your eligibility result has been saved.',
};

// ── Analytics Event Names ────────────────────────────────────────

/**
 * @constant {Object} ANALYTICS_EVENTS - GA4 custom event names.
 * Must match the events configured in Firebase Analytics console.
 */
export const ANALYTICS_EVENTS = {
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  CHAT_RESPONSE_RECEIVED: 'chat_response_received',
  ELIGIBILITY_CHECKED: 'eligibility_checked',
  ELIGIBILITY_ELIGIBLE: 'eligibility_result_eligible',
  ELIGIBILITY_INELIGIBLE: 'eligibility_result_ineligible',
  JOURNEY_STEP_VIEWED: 'journey_step_viewed',
  JOURNEY_COMPLETED: 'journey_completed',
  FAQ_SEARCHED: 'faq_searched',
  FAQ_VIEWED: 'faq_viewed',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  SIGN_IN: 'user_sign_in',
  SIGN_OUT: 'user_sign_out',
  FIRST_VOTER_MODE: 'first_voter_mode_viewed',
  TIMELINE_VIEWED: 'timeline_viewed',
  NOTIFICATION_SUBSCRIBED: 'notification_subscribed',
  APP_ERROR: 'app_error',
};

// ── Accessibility Labels (ARIA) ──────────────────────────────────

/**
 * @constant {Object} ARIA - ARIA label strings for screen readers.
 * Used in aria-label attributes throughout the application.
 */
export const ARIA = {
  CHAT_INPUT: 'Type your election question here',
  SEND_BUTTON: 'Send message to VoteWise assistant',
  NAV_MAIN: 'Main navigation',
  NAV_MOBILE: 'Mobile navigation',
  NAV_HOME: 'Navigate to Home page',
  NAV_CHAT: 'Navigate to Chat page',
  NAV_JOURNEY: 'Navigate to Election Journey',
  NAV_FAQ: 'Navigate to FAQ page',
  NAV_PROFILE: 'Navigate to Profile page',
  SIGN_IN_BTN: 'Sign in with your Google account',
  SIGN_OUT_BTN: 'Sign out of VoteWise',
  LOADING_CONTENT: 'Content is loading, please wait',
  CLOSE_MODAL: 'Close dialog',
  ELIGIBILITY_FORM: 'Voter eligibility checker form',
  JOURNEY_PROGRESS: 'Election journey progress indicator',
  CHAT_MESSAGES: 'Chat conversation with VoteWise',
  CHATBOT_RESPONSE: 'VoteWise assistant response',
  USER_MESSAGE: 'Your message',
  CLEAR_CHAT: 'Clear chat history',
  SKIP_NAV: 'Skip to main content',
};
