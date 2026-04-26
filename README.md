# 🗳️ VoteWise – Smart Election Assistant

> **Empowering every Indian citizen — especially first-time voters — with AI-powered election guidance built entirely on Google's scalable cloud infrastructure.**

[![Firebase Hosting](https://img.shields.io/badge/Firebase_Hosting-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Firestore](https://img.shields.io/badge/Firestore-FF6F00?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/docs/firestore)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🌐 Live Demo

**👉 [https://votewise-1a2d0.web.app](https://votewise-1a2d0.web.app)**

---

## 📌 Chosen Vertical

**Civic Technology — Voter Education and Election Assistance**

VoteWise directly addresses the challenge of voter confusion and civic disengagement in India, particularly among first-time voters aged 18-25. India conducts the world's largest democratic elections with over 950 million eligible voters, yet a significant portion — especially youth — remain uncertain about the voting process, eligibility requirements, and their rights as citizens.

VoteWise bridges this gap by replacing static, confusing government portals with an intelligent, conversational, and visually guided assistant that meets voters where they are.

---

## 🎯 Approach and Logic

### Core Philosophy

VoteWise is built around one principle: **No voter should feel confused, intimidated, or uninformed on election day.**

The system uses Gemini's conversational AI combined with Firebase's real-time infrastructure to create an experience that is personal, accurate, and accessible to every citizen regardless of their digital literacy level.

### Persona and Target User

- **Primary**: First-time voters (18-22 years old)
- **Secondary**: Senior voters unfamiliar with digital systems
- **Tertiary**: NRI voters navigating special voting rules

### Decision Architecture

```
User Input (natural language)
         ↓
┌────────────────────────────────────────────┐
│  Firebase Auth — Identity Verification     │
│  (required for chatbot and history)        │
└──────────────────┬─────────────────────────┘
                   ↓
┌────────────────────────────────────────────┐
│  Intent Router (Gemini system prompt)      │
│                                            │
│  Is the query election-related?            │
│  YES → Process with election knowledge     │
│  NO  → Politely redirect to election topic │
└──────────────────┬─────────────────────────┘
                   ↓
┌────────────────────────────────────────────┐
│  Context Enrichment Layer                  │
│  • Is user registered?  (from Firestore)   │
│  • Is user first-time voter? (from profile)│
│  • What journey stage are they on?         │
└──────────────────┬─────────────────────────┘
                   ↓
        Gemini 1.5 Pro response
         + saved to Firestore
         + logged to Analytics
```

### Eligibility Check Logic

```
Input: age (integer) + citizenship (string) + residence (string)
                    ↓
if (citizenship ≠ "indian")     → NOT ELIGIBLE
       reason: citizenship requirement
                    ↓
if (age < 18)                   → NOT ELIGIBLE
       reason: age with countdown to eligibility
                    ↓
if (residence === "nri")        → ELIGIBLE (special NRI rules)
       reason: NRI provisions noted
                    ↓
else                            → ELIGIBLE
       reason: full eligibility confirmed
```

### Chatbot Context Management

```
User types message
       ↓
Client-side: sanitizeInput(input)
       ↓
Rate limit check: 30 req/user/hour (Firestore counter)
       ↓
Cloud Function: chatHandler(message, history[last N turns])
       ↓
Gemini 1.5 Pro API call:
  • System prompt: election expert persona
  • Safety: BLOCK_MEDIUM_AND_ABOVE
  • Max tokens: 512
       ↓
Response returned to client
       ↓
Both turns saved to Firestore chatHistory
       ↓
Analytics event logged (no PII)
```

---

## ⚙️ How The Solution Works

### System Architecture

```
╔═══════════════════════════════════════════════════╗
║         React 19 SPA (Firebase Hosting)           ║
║                                                   ║
║  ┌──────┐ ┌──────┐ ┌──────────┐ ┌──────────────┐ ║
║  │ Home │ │ Chat │ │ Journey  │ │  Eligibility │ ║
║  └──────┘ └──────┘ └──────────┘ └──────────────┘ ║
║  ┌──────────┐ ┌──────┐ ┌───────────────────────┐ ║
║  │ Timeline │ │ FAQ  │ │  First-Time Voter Mode │ ║
║  └──────────┘ └──────┘ └───────────────────────┘ ║
╚════════════════════╦══════════════════════════════╝
                     ║  Firebase Auth Token (HTTPS)
                     ▼
╔═══════════════════════════════════════════════════╗
║     Firebase Cloud Functions (Node.js 20)         ║
║                                                   ║
║  chatHandler │ checkEligibility │ faqFetcher      ║
║  notificationScheduler (scheduled)                ║
╚══════╦════════════════╦══════════════════╦════════╝
       ▼                ▼                  ▼
╔════════════╗  ╔════════════════╗  ╔════════════════╗
║ Gemini API ║  ║   Firestore    ║  ║ Firebase Auth  ║
║ 1.5 Pro    ║  ║  (Real-time    ║  ║ Google Sign-In ║
║ (AI Engine)║  ║   Database)    ║  ╚════════════════╝
╚════════════╝  ╚════════════════╝
                        ║
              ╔═════════╩═════════════╗
              ║  Firebase Analytics   ║
              ║  (GA4 — all events)   ║
              ╚═══════════════════════╝
                        ║
              ╔═════════╩═════════════╗
              ║  Firebase Cloud       ║
              ║  Messaging (FCM)      ║
              ╚═══════════════════════╝
```

### Feature Breakdown

| Feature | How It Works | Google Services Used |
|---------|-------------|---------------------|
| 🤖 AI Chatbot | User message → Cloud Function → Gemini 1.5 Pro → Streamed response | Gemini API, Cloud Functions, Firestore |
| ✅ Eligibility Checker | Form inputs → Rule-based validation → Result card with next steps | Cloud Functions, Firestore |
| 🗺️ Election Journey | Step-by-step flow loaded from Firestore with progress tracking | Firestore, Firebase Hosting |
| 🎓 First-Time Voter Mode | Onboarding carousel with booth walkthrough visuals | Firestore, Firebase Auth |
| 📋 FAQ System | Firestore-backed search with real-time category filters and accordion UI | Firestore |
| 📅 Timeline Viewer | Election phase data from Firestore with active phase highlighting | Firestore |
| 🔔 Push Notifications | Scheduled Cloud Function checks upcoming dates → sends FCM | Cloud Functions, FCM |
| 📊 Analytics | Every key user action logged as GA4 custom event (no PII) | Firebase Analytics |

### Firestore Data Schema

```
votewise-firestore/
│
├── users/{uid}                    ← Private, auth-gated
│   ├── uid: string
│   ├── email: string
│   ├── displayName: string
│   ├── isFirstTimeVoter: boolean
│   ├── fcmToken: string
│   ├── eligibilityResult: object|null
│   ├── createdAt: Timestamp
│   └── chatHistory/{msgId}        ← Subcollection
│       ├── role: "user" | "model"
│       ├── content: string
│       └── timestamp: Timestamp
│
├── journeySteps/{step_id}         ← Public read
│   ├── id: string
│   ├── order: number
│   ├── title: string
│   ├── description: string
│   ├── icon: string
│   ├── nextStepId: string|null
│   ├── prevStepId: string|null
│   ├── ctaLabel: string
│   └── ctaUrl: string
│
├── faqs/{auto_id}                 ← Public read
│   ├── question: string
│   ├── answer: string
│   ├── category: string
│   ├── tags: string[]
│   └── order: number
│
└── timelinePhases/{phase_id}      ← Public read
    ├── phase: number
    ├── label: string
    ├── date: string (YYYY-MM-DD)
    ├── description: string
    └── status: "completed"|"active"|"upcoming"
```

---

## 🔧 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | React | 19.x |
| Build Tool | Vite | 8.x |
| Frontend Hosting | Firebase Hosting | Latest |
| Authentication | Firebase Auth + Google Sign-In | Latest |
| Database | Cloud Firestore | Latest |
| Backend | Firebase Cloud Functions | Node.js 20 |
| AI Engine | Gemini 1.5 Pro via Cloud Functions | Latest |
| Push Notifications | Firebase Cloud Messaging | Latest |
| Analytics | Firebase Analytics (GA4) | Latest |
| Animations | Framer Motion | Latest |
| i18n | i18next | Latest |
| Testing (Unit) | Vitest | Latest |
| Testing (E2E) | Playwright | Latest |

---

## 💡 Assumptions Made

1. **Target geography**: All election rules, age limits, and civic processes reflect Indian election law as governed by the Election Commission of India (ECI).

2. **Minimum voting age**: 18 years as established by the Representation of the People Act, 1950 (India).

3. **NRI voting**: NRI voters are eligible but must be physically present in their registered constituency to vote, per current Indian electoral law.

4. **API scale**: Gemini API free tier is sufficient for hackathon/demo scale. The $5 Google Cloud credit acts as a safety buffer for any overage.

5. **Authentication scope**: Auth is required for the AI chatbot (to save history and enforce rate limits). FAQ, Timeline, and Journey are publicly accessible without sign-in to maximize civic reach.

6. **Language**: Default language is English with Hindi toggle. Gemini's built-in multilingual capability handles queries in Hindi and other Indian languages without additional setup.

7. **Election data**: Phase dates, booth information, and timeline data are seeded as representative static data reflecting a generic Indian general election cycle.

8. **First-time voter flag**: Set to `true` for all new sign-ups automatically. Users can toggle this via the onboarding flow.

9. **Rate limiting**: 30 chatbot messages per user per hour is enforced server-side via Firestore counters (not just client-side) to prevent API abuse.

10. **Content moderation**: Gemini safety settings are set to `BLOCK_MEDIUM_AND_ABOVE` for all harm categories to ensure appropriate content for all age groups.

---

## 🔐 Security Implementation

| Security Measure | Implementation |
|-----------------|---------------|
| API Key Protection | Gemini key stored **only** in Firebase Functions environment config — never in client code or `.env` files |
| Authentication | All Cloud Functions validate `request.auth` before processing — unauthenticated calls return 401 |
| Firestore Rules | Deny-all by default; explicit allow per collection; users can only access their own data |
| Rate Limiting | 30 chat requests/user/hour enforced server-side via Firestore atomic counters |
| Input Sanitization | All user inputs run through `sanitizeInput()` before reaching Gemini or Firestore |
| HTTP Security Headers | CSP, HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, Cross-Origin-Opener-Policy |
| Content Moderation | Gemini `safetySettings: BLOCK_MEDIUM_AND_ABOVE` on all 4 harm categories |
| Secret Exposure | `.env.local` and all credential files excluded via airtight `.gitignore` |
| HTTPS Enforcement | Firebase Hosting enforces HTTPS automatically; HSTS header set with preload |
| Analytics Privacy | No PII (email, name, UID) in any GA4 event parameters |

---

## ♿ Accessibility (WCAG 2.1 AA Compliant)

| Requirement | Implementation |
|-------------|---------------|
| Keyboard Navigation | All interactive elements reachable via Tab key; Enter submits chat |
| Skip Navigation | Skip-to-content link appears on keyboard focus at page top |
| ARIA Labels | All buttons, inputs, images, and icons have descriptive `aria-label` |
| Live Regions | `aria-live="polite"` on all dynamically updated content areas |
| Focus Management | Focus indicators on all interactive elements |
| Color Contrast | All text meets ≥ 4.5:1 contrast ratio (Google Blue #1A73E8 on white) |
| Touch Targets | Minimum 48×48px touch target on all interactive elements |
| Screen Readers | Loading states announced via `role="status"` and `aria-busy` |
| Error Messages | Form errors linked via `aria-describedby` to input fields |
| Semantic HTML | Proper heading hierarchy, landmark roles, and list structures throughout |
| Reduced Motion | Supports `prefers-reduced-motion` to disable animations |
| High Contrast | Supports `prefers-contrast` for enhanced visibility |

---

## 🧪 Testing

### Running Tests

```bash
# Run all unit tests
npm test

# Run with watch mode
npm run test:watch

# Run E2E tests (Playwright)
npx playwright test

# Run E2E tests with UI (headed mode)
npx playwright test --headed

# Run Cloud Function unit tests
cd functions && npm test

# Run linting
npm run lint

# Run linting with auto-fix
npm run lint -- --fix
```

### Test Coverage

| Test Type | Tool | Description |
|-----------|------|-------------|
| Unit — Validators | Vitest | sanitizeInput, checkEligibility, validateChatMessage |
| Unit — Constants | Vitest | All exported constants structural integrity |
| Unit — Demo Data | Vitest | Data schema, ordering, linking validation |
| Unit — Sanitize | Vitest | XSS prevention, boundary values, edge cases |
| Unit — Logger | Vitest | Logger API surface and error handling |
| Integration — Firestore Rules | Firebase Emulator | All rule paths tested |
| E2E — Critical Flows | Playwright | Chatbot, Eligibility flows |

### Key Test Files

```
tests/
├── validators.test.js     ← sanitize, eligibility, chat validation
├── constants.test.js      ← constants structural integrity
├── demoData.test.js       ← demo data schema validation
├── edgeCases.test.js      ← sanitize boundary/edge case tests
├── logger.test.js         ← logger utility behavior tests
├── rules.test.js          ← Firestore security rules integration
└── e2e/
    ├── chatbot.spec.js    ← Playwright chatbot flow
    └── eligibility.spec.js ← Playwright eligibility flow
functions/
└── __tests__/
    ├── chatHandler.test.js
    ├── eligibilityHandler.test.js
    └── faqHandler.test.js
```

---

## 🚀 Setup & Deployment

### Prerequisites

```bash
node --version    # Must be ≥ 20.0.0
npm --version     # Must be ≥ 9.0.0
firebase --version  # Install: npm install -g firebase-tools
```

### Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/srimaya-kumar-pradhan/election-education.git
cd election-education

# 2. Install frontend dependencies
npm install

# 3. Install Cloud Functions dependencies
cd functions && npm install && cd ..

# 4. Copy environment template
cp .env.example .env.local

# 5. Fill in your Firebase config values
# (Get from: Firebase Console → Project Settings → Your apps)

# 6. Start local development server
npm run dev

# 7. (Optional) Run Firebase emulators for local backend testing
firebase emulators:start
```

### Required Environment Variables (.env.local)

```env
# Get these values from Firebase Console → Project Settings → Your apps
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

> ⚠️ **NEVER commit `.env.local` to version control.**
> The `.gitignore` file prevents this automatically.
> The Gemini API key is set via Firebase CLI, not `.env`.

### Database Seeding

```bash
# Seed Firestore with election data (journeySteps, faqs, timeline)
node scripts/seedFirestore.js
```

### Production Deployment

```bash
# Run tests first — never deploy failing tests
npm test

# Build the frontend
npm run build

# Deploy everything
firebase deploy

# Or deploy individually:
firebase deploy --only firestore:rules
firebase deploy --only functions
firebase deploy --only hosting

# Verify deployment
curl -I https://votewise-1a2d0.web.app
```

---

## 📁 Project Structure

```
votewise/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ErrorBoundary.jsx # Global error boundary
│   │   ├── Skeleton.jsx      # Loading placeholder component
│   │   ├── Navbar.jsx        # Top navigation bar
│   │   ├── BottomNav.jsx     # Mobile bottom navigation
│   │   └── ui/
│   │       ├── Loader.jsx    # Versatile loader component
│   │       └── Toast.jsx     # Toast notification system
│   ├── pages/                # Route-level page components
│   │   ├── Home.jsx          # Landing page with hero section
│   │   ├── Chat.jsx          # AI chatbot interface
│   │   ├── Journey.jsx       # Step-by-step voter journey
│   │   ├── Eligibility.jsx   # Eligibility checker form
│   │   ├── Timeline.jsx      # Election phase timeline
│   │   ├── Faq.jsx           # Searchable FAQ system
│   │   ├── Onboarding.jsx    # First-time voter guide
│   │   └── Profile.jsx       # User profile & settings
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.js        # Firebase auth state management
│   │   ├── useFirestore.js   # Firestore CRUD with caching
│   │   └── useChat.js        # Chat state & Gemini integration
│   ├── services/             # External service integrations
│   │   ├── firebase.js       # Firebase initialization & API
│   │   ├── gemini.js         # Gemini AI service wrapper
│   │   └── fcm.js            # Cloud Messaging setup
│   ├── utils/                # Pure utility functions
│   │   ├── constants.js      # All string constants & config
│   │   ├── logger.js         # Environment-aware logger
│   │   ├── sanitize.js       # Input sanitization utilities
│   │   ├── validators.js     # Validation & eligibility logic
│   │   └── demoData.js       # Fallback demo data
│   ├── styles/               # Global CSS & design tokens
│   │   ├── global.css
│   │   └── tokens.css
│   ├── i18n.js               # Internationalization config
│   ├── main.jsx              # React entry point
│   └── App.jsx               # Root component + router
├── functions/
│   ├── src/
│   │   ├── chatHandler.js    # Gemini AI chatbot function
│   │   ├── eligibilityHandler.js  # Eligibility validator
│   │   ├── faqHandler.js     # FAQ data function
│   │   ├── notificationScheduler.js  # FCM scheduler
│   │   └── index.js          # Function exports
│   └── __tests__/
│       ├── chatHandler.test.js
│       ├── eligibilityHandler.test.js
│       └── faqHandler.test.js
├── tests/
│   ├── validators.test.js    # Validation & eligibility tests
│   ├── constants.test.js     # Constants structural tests
│   ├── demoData.test.js      # Demo data schema tests
│   ├── edgeCases.test.js     # Sanitize edge case tests
│   ├── logger.test.js        # Logger utility tests
│   ├── rules.test.js         # Firestore rules integration
│   └── e2e/
│       ├── chatbot.spec.js   # E2E chatbot flow
│       └── eligibility.spec.js  # E2E eligibility flow
├── scripts/
│   └── seedFirestore.js      # Database seeder
├── firebase.json             # Firebase + security headers
├── firestore.rules           # Firestore security rules
├── firestore.indexes.json    # Composite indexes
├── .env.example              # Environment template (safe)
├── .gitignore                # Airtight secret exclusions
├── package.json              # Dependencies & scripts
└── README.md                 # This file
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Ensure all tests pass before submitting a PR.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

*Built with ❤️ for the Google Hackathon.*
*Making Indian democracy accessible to every citizen, on every device, in every language.*
