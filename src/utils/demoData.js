/**
 * Demo Data Module
 *
 * Single source of truth for fallback/demo data used when Firestore
 * is unavailable (e.g., demo credentials, network errors, or local dev).
 *
 * This data mirrors the production Firestore collections and is also
 * used by the seedFirestore.js script to seed the database.
 *
 * Collections:
 * - journeySteps: The 5-step voter registration journey
 * - faqs: 10 curated election FAQs across categories
 * - timelinePhases: 8 election timeline phases with status
 */

export const DEMO_DATA = {
  journeySteps: [
    {
      id: 'step_01',
      order: 1,
      title: 'Check Registration',
      description:
        'Visit voters.eci.gov.in to verify your name in the electoral roll. Search by name or EPIC number.',
      icon: 'how_to_reg',
      nextStepId: 'step_02',
      prevStepId: null,
      ctaLabel: 'Check Now',
      ctaUrl: 'https://voters.eci.gov.in',
    },
    {
      id: 'step_02',
      order: 2,
      title: 'Register to Vote',
      description:
        'If not registered, fill Form 6 online at nvsp.in or visit your nearest ERO office with required documents.',
      icon: 'app_registration',
      nextStepId: 'step_03',
      prevStepId: 'step_01',
      ctaLabel: 'Register Online',
      ctaUrl: 'https://www.nvsp.in',
    },
    {
      id: 'step_03',
      order: 3,
      title: 'Find Your Polling Booth',
      description:
        'Locate your designated polling station using the Voter Helpline App or the ECI website.',
      icon: 'location_on',
      nextStepId: 'step_04',
      prevStepId: 'step_02',
      ctaLabel: 'Find Booth',
      ctaUrl: 'https://eci.gov.in',
    },
    {
      id: 'step_04',
      order: 4,
      title: 'Prepare Your Documents',
      description:
        'Keep your Voter ID (EPIC) or any approved photo ID ready. Also carry a printout of your electoral search result.',
      icon: 'badge',
      nextStepId: 'step_05',
      prevStepId: 'step_03',
      ctaLabel: 'View ID List',
      ctaUrl: null,
    },
    {
      id: 'step_05',
      order: 5,
      title: 'Vote on Election Day',
      description:
        'Visit your polling booth between 7 AM - 6 PM. Follow the queue, show your ID, get inked, and cast your vote on the EVM.',
      icon: 'how_to_vote',
      nextStepId: null,
      prevStepId: 'step_04',
      ctaLabel: 'Learn Booth Process',
      ctaUrl: null,
    },
  ],

  faqs: [
    {
      id: 'faq_01',
      question: 'What photo ID documents are accepted at the polling booth?',
      answer:
        'The following documents are accepted: Voter ID card (EPIC), Aadhaar card, Passport, Driving Licence, PAN Card, MNREGA Job Card, Bank/Post Office Passbook with photo, and Smart Card issued by RGI under NPR.',
      category: 'documents',
      tags: ['ID', 'booth', 'documents'],
      order: 1,
    },
    {
      id: 'faq_02',
      question: 'How do I register as a first-time voter?',
      answer:
        'You can register online at nvsp.in by filling Form 6. You will need age proof (birth certificate or school certificate), address proof (Aadhaar, utility bill), and a passport-size photograph. You can also visit your nearest ERO office for offline registration.',
      category: 'registration',
      tags: ['registration', 'first-time', 'Form 6'],
      order: 2,
    },
    {
      id: 'faq_03',
      question: 'What is NOTA and how does it work?',
      answer:
        'NOTA stands for "None of the Above." It is the last option on the EVM ballot unit. By pressing the NOTA button, you can reject all candidates. NOTA votes are counted but do not affect the election result — the candidate with the most votes still wins.',
      category: 'evm',
      tags: ['NOTA', 'EVM', 'voting'],
      order: 3,
    },
    {
      id: 'faq_04',
      question: 'What is the minimum age to vote in India?',
      answer:
        'You must be at least 18 years old on the qualifying date (January 1st of the year) to be eligible to vote in Indian elections. You can start the registration process once you turn 17 years and 8 months.',
      category: 'registration',
      tags: ['age', 'eligibility', 'registration'],
      order: 4,
    },
    {
      id: 'faq_05',
      question: 'How does an EVM (Electronic Voting Machine) work?',
      answer:
        "An EVM consists of a Control Unit and a Ballot Unit. The presiding officer activates the ballot unit for each voter. You press the blue button next to your candidate's name and symbol. A beep and light confirm your vote. The EVM is standalone, battery-operated, and not connected to any network.",
      category: 'evm',
      tags: ['EVM', 'electronic', 'machine', 'voting'],
      order: 5,
    },
    {
      id: 'faq_06',
      question: 'Can NRIs vote in Indian elections?',
      answer:
        'Yes, NRIs can vote in Indian elections since 2011. You need to register as an overseas elector using Form 6A. However, you must vote in person at the polling station of your constituency — postal voting for NRIs is not yet available for general elections.',
      category: 'registration',
      tags: ['NRI', 'overseas', 'registration'],
      order: 6,
    },
    {
      id: 'faq_07',
      question: 'What happens if my name is not on the voter list?',
      answer:
        'If your name is missing, you cannot vote in that election. To add your name, file Form 6 at nvsp.in or visit your local ERO office. Always check the voter list well before election day by visiting voters.eci.gov.in.',
      category: 'registration',
      tags: ['voter list', 'missing', 'registration'],
      order: 7,
    },
    {
      id: 'faq_08',
      question: 'What is VVPAT and why is it important?',
      answer:
        "VVPAT (Voter Verifiable Paper Audit Trail) is a machine attached to the EVM that prints a paper slip showing the candidate's name and symbol. The slip is displayed for 7 seconds and then drops into a sealed box. This allows voters to verify their vote was correctly recorded.",
      category: 'evm',
      tags: ['VVPAT', 'paper trail', 'verification'],
      order: 8,
    },
    {
      id: 'faq_09',
      question: 'What should I do on polling day?',
      answer:
        'On polling day: (1) Go to your designated polling station with a valid photo ID. (2) Stand in the queue. (3) Show your ID to the officer. (4) Sign/thumbprint the register. (5) Get inked on your left index finger. (6) Enter the compartment and vote. (7) Check the VVPAT slip. (8) Exit the booth.',
      category: 'booth',
      tags: ['polling day', 'procedure', 'booth'],
      order: 9,
    },
    {
      id: 'faq_10',
      question: 'Can I vote if I arrive at the booth after 6 PM?',
      answer:
        'If you are already standing in the queue before 6 PM (the official closing time), you will be allowed to cast your vote. No new voters are allowed to join the queue after closing time.',
      category: 'booth',
      tags: ['timing', 'booth', 'queue'],
      order: 10,
    },
  ],

  timelinePhases: [
    {
      id: 'phase_01',
      phase: 1,
      label: 'Notification of Election',
      date: '2024-03-16',
      description:
        'Election Commission issues official notification announcing the election schedule and phases.',
      status: 'completed',
    },
    {
      id: 'phase_02',
      phase: 2,
      label: 'Filing of Nominations',
      date: '2024-03-20',
      description:
        'Candidates file their nomination papers with the returning officer of their constituency.',
      status: 'completed',
    },
    {
      id: 'phase_03',
      phase: 3,
      label: 'Scrutiny of Nominations',
      date: '2024-03-25',
      description: 'Returning officers examine the nominations and reject invalid ones.',
      status: 'completed',
    },
    {
      id: 'phase_04',
      phase: 4,
      label: 'Withdrawal of Candidature',
      date: '2024-03-28',
      description:
        'Last date for candidates to withdraw their nominations from the contest.',
      status: 'completed',
    },
    {
      id: 'phase_05',
      phase: 5,
      label: 'Campaign Period',
      date: '2024-04-01',
      description:
        'Candidates and political parties campaign. Must stop 48 hours before polling.',
      status: 'completed',
    },
    {
      id: 'phase_06',
      phase: 6,
      label: 'Polling Day - Phase 1',
      date: '2024-04-19',
      description:
        'First phase of voting across 102 constituencies in 21 states and union territories.',
      status: 'active',
    },
    {
      id: 'phase_07',
      phase: 7,
      label: 'Polling Day - Phase 2',
      date: '2024-04-26',
      description:
        'Second phase of voting across 89 constituencies in 13 states and union territories.',
      status: 'upcoming',
    },
    {
      id: 'phase_08',
      phase: 8,
      label: 'Counting of Votes',
      date: '2024-06-04',
      description:
        'EVMs are opened and votes are counted. Results are declared constituency-wise.',
      status: 'upcoming',
    },
  ],
};
