/**
 * VoteWise Application Constants
 * All hardcoded strings, labels, and configuration values
 */

/** Application metadata */
export const APP_NAME = 'VoteWise';
export const APP_TAGLINE = 'Your AI-Powered Election Assistant';
export const APP_DESCRIPTION =
  'VoteWise helps Indian citizens — especially first-time voters — understand elections, check eligibility, and navigate the voting process with confidence.';

/** Navigation labels */
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

/** Route paths */
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

/** Design tokens */
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

/** Chatbot system prompt */
export const CHATBOT_SYSTEM_PROMPT = `You are VoteWise, an expert, friendly, and neutral election assistant for Indian voters. You only answer questions related to elections, voting procedures, voter registration, eligible documents, EVMs, NOTA, election phases, and civic rights. For off-topic questions, politely redirect the user to election topics. Keep answers concise (under 150 words), factual, and beginner-friendly. Use bullet points where helpful. Never express political bias.`;

/** Input validation limits */
export const VALIDATION = {
  MAX_MESSAGE_LENGTH: 500,
  MIN_AGE: 1,
  MAX_AGE: 120,
  VOTING_AGE: 18,
  MAX_REQUESTS_PER_HOUR: 30,
};

/** FAQ categories */
export const FAQ_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'documents', label: 'Documents' },
  { id: 'registration', label: 'Registration' },
  { id: 'booth', label: 'Booth' },
  { id: 'evm', label: 'EVM' },
  { id: 'general', label: 'General' },
];

/** Citizenship options */
export const CITIZENSHIP_OPTIONS = [
  { value: 'indian', label: 'Indian Citizen' },
  { value: 'other', label: 'Other' },
];

/** Residence options */
export const RESIDENCE_OPTIONS = [
  { value: 'resident', label: 'Indian Resident' },
  { value: 'nri', label: 'NRI (Non-Resident Indian)' },
];

/** Timeline status labels */
export const TIMELINE_STATUS = {
  COMPLETED: 'completed',
  ACTIVE: 'active',
  UPCOMING: 'upcoming',
};

/** First-time voter booth steps */
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

/** Error messages */
export const ERRORS = {
  AUTH_REQUIRED: 'Please sign in to continue.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  MESSAGE_TOO_LONG: `Message must be under ${VALIDATION.MAX_MESSAGE_LENGTH} characters.`,
  MESSAGE_EMPTY: 'Please enter a message.',
  RATE_LIMIT: 'You have reached your hourly message limit. Please try again later.',
};

/** Success messages */
export const SUCCESS = {
  SIGNED_IN: 'Welcome to VoteWise!',
  SIGNED_OUT: 'You have been signed out.',
  ELIGIBILITY_SAVED: 'Your eligibility result has been saved.',
};

/** Analytics event names */
export const ANALYTICS_EVENTS = {
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  ELIGIBILITY_CHECKED: 'eligibility_checked',
  JOURNEY_STEP_VIEWED: 'journey_step_viewed',
  JOURNEY_COMPLETED: 'journey_completed',
  FAQ_SEARCHED: 'faq_searched',
  FAQ_VIEWED: 'faq_viewed',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  SIGN_IN: 'user_sign_in',
  SIGN_OUT: 'user_sign_out',
};
