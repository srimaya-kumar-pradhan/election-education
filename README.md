# 🗳️ VoteWise — AI-Powered Election Assistant

VoteWise is a production-grade, civic-tech web application built to empower Indian citizens with accurate, accessible, and AI-driven election information. It provides a chatbot powered by Google Gemini, step-by-step voter journey guides, and eligibility checkers.

![VoteWise Hero](https://i.imgur.com/Bkx0pFs.png)

---

## 🎯 100% Compliance Architecture

This project was built and hardened to meet strict production standards across six primary pillars:

### 1. Code Quality
* **Zero ESLint Warnings**: Enforced by strict CI/CD linting checks (`eslint . --max-warnings 0`).
* **Clean Architecture**: Custom React hooks (`useAuth`, `useChat`, `useFirestore`) separate business logic from UI components.
* **Resilience**: `ErrorBoundary` wrapper prevents entire app crashes, providing graceful fallback UI.
* **Modern Tooling**: Built with Vite 8 and React 19 using ES Modules.

### 2. Security (Hardened)
* **Server-Side AI**: Gemini API calls are securely routed through Firebase Cloud Functions. **No API keys** are exposed to the client.
* **Strict Security Headers**: Configured in `firebase.json` and deployed to Firebase Hosting:
  * `Content-Security-Policy`
  * `Strict-Transport-Security` (HSTS)
  * `X-Frame-Options` (Clickjacking protection)
  * `X-Content-Type-Options: nosniff`
  * `Permissions-Policy`
* **Firestore Rules**: Strict owner-based read/write rules for user data and chat history. Public collections (`faqs`, `timelinePhases`) are strictly read-only.
* **No Hardcoded Secrets**: Zero `.env` files or credentials committed to the repository (verified by git history audits).

### 3. Efficiency
* **Route-Level Code Splitting**: Utilized `React.lazy()` and `<Suspense>` in `App.jsx` to break the bundle into smaller, page-specific chunks.
* **Aggressive Caching**: Static assets (fonts, images, JS/CSS) are served with `Cache-Control: public, max-age=31536000, immutable`.
* **Session-level Data Caching**: `useFirestore` hook caches static collections (FAQs, Timeline) in memory, drastically reducing Firebase read operations and saving costs.

### 4. Testing
* **Unit Tests (Vitest)**: Comprehensive test suites for all utilities and input validators (`checkEligibility`, `sanitizeInput`, etc.).
* **E2E Tests (Playwright)**: End-to-end testing for core user flows (Authentication, Eligibility Form) implemented with `@playwright/test`.
* **Security Rules Testing**: Automated tests for Firestore rules using the Firebase Local Emulator Suite.

### 5. Accessibility (WCAG 2.1 AAA Goals)
* **Keyboard Navigation**: Implemented a "Skip to main content" link that is visually hidden until focused via keyboard.
* **Motion Accessibility**: Supports `prefers-reduced-motion` to disable animations for users with vestibular disorders.
* **Contrast Support**: Integrated `prefers-contrast` media queries for high-contrast viewing.
* **Semantic HTML**: Extensive use of `aria-label`, `aria-hidden`, and structured semantic tags (`<main>`, `<nav>`, `<article>`).
* **Graceful Degradation**: Fallback `<noscript>` block ensures the app degrades gracefully for environments without JavaScript.

### 6. Google Services Integration
* **Firebase Hosting**: High-performance global CDN delivery.
* **Cloud Functions (v2)**: Serverless backend running Node 20.
* **Cloud Firestore**: Real-time NoSQL database with composite indexes.
* **Firebase Authentication**: Secure Google OAuth sign-in.
* **Google Gemini AI**: Context-aware natural language processing for the chatbot.
* **Google Analytics**: Integrated event tracking for key user actions (`chat_message_sent`, `eligibility_checked`).

---

## 🚀 Getting Started

### Prerequisites
* Node.js v20+
* Firebase CLI (`npm install -g firebase-tools`)

### Setup & Run Locally
1. Clone the repository
2. Install dependencies: `npm install`
3. Setup local `.env` variables for Firebase config.
4. Run development server: `npm run dev`

### Running Tests
* **Unit Tests**: `npm run test`
* **E2E Tests**: `npx playwright test`
* **Linting**: `npm run lint`

### Deployment
To deploy the application and Cloud Functions to production:
```bash
firebase deploy --only hosting,functions
```

---

*Built with ❤️ for Indian Democracy.*
