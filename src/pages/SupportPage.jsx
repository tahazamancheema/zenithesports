import React, { useState } from 'react';
import {
  ChevronDown, ChevronUp, MessageCircle,
  UserPlus, KeyRound, CalendarClock, Banknote,
  ShieldAlert, Bug, X, ExternalLink,
} from 'lucide-react';

// ── FAQs ─────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'How do I register my team?',
    a: 'Create an account on Zenith Esports, log in, and visit the Tournaments page. Click "Register Now" on an open tournament, fill in your team name, PUBG Mobile character IDs (4–6 players), WhatsApp number, and city, then submit. Your registration will be reviewed by an admin — you\'ll receive a WhatsApp notification once approved or rejected.',
  },
  {
    q: 'Is registration free?',
    a: 'Yes — registration on Zenith Esports is completely free. No entry fees, no hidden charges. We believe competitive opportunity should be available to every Pakistani team regardless of financial background.',
  },
  {
    q: 'How will I know if my team is approved?',
    a: 'You will be notified via your registered WhatsApp number. You can also check your Profile page at any time — your registration status (Pending / Approved / Rejected) is always shown there.',
  },
  {
    q: 'Can I submit multiple registrations?',
    a: 'No. Each account can have only one active Pending or Approved registration at a time. This prevents spam and ensures fair access to tournament slots. If your previous registration was rejected, you may register again.',
  },
  {
    q: 'What are the PUBG Mobile ID requirements?',
    a: 'Each player\'s PUBG Mobile Character ID must be unique — duplicate IDs across different team registrations will be flagged and rejected. Enter the in-game Character ID number (numeric), not the username/nickname. Each team requires a minimum of 4 IDs and supports up to 6.',
  },
  {
    q: 'How are groups assigned?',
    a: 'Once the admin approves enough teams, they are automatically partitioned into groups (e.g., Group 1, Group 2 …) of up to 20 teams each. Your group will be visible in your Profile page after assignment, and you\'ll receive a WhatsApp notification.',
  },
  {
    q: 'Can I change my player IDs after registering?',
    a: 'Player ID changes are not allowed after submission to maintain fairness. If you made a mistake, contact us on WhatsApp immediately with your team name and the corrected IDs, and an admin will review the request.',
  },
  {
    q: 'What happens if a player drops out?',
    a: 'Contact us on WhatsApp before the tournament starts. A substitute may be allowed depending on the rules of that specific tournament. Substitutions after groups are assigned are generally not permitted.',
  },
  {
    q: 'How is the prize distributed?',
    a: 'Prize money is distributed in PKR via bank transfer or JazzCash / EasyPaisa after the tournament concludes and results are verified. The winning team will be contacted on WhatsApp to confirm and collect bank / wallet details before disbursement.',
  },
  {
    q: 'I forgot my password — how do I reset it?',
    a: 'On the login page, click "Forgot Password" (or use the Magic Link option). Enter your registered email and we will send you a sign-in link. If you do not receive it within 5 minutes, check your spam folder or contact us on WhatsApp.',
  },
  {
    q: 'Google sign-in isn\'t working — what do I do?',
    a: 'Google OAuth may occasionally be unavailable due to configuration windows. Use the "Sign in with Email" (magic link) option instead. If the issue persists, contact us on WhatsApp and include your Google account email so we can investigate.',
  },
  {
    q: 'I face a technical issue on the website — what do I do?',
    a: 'Contact us directly on WhatsApp at +92 339 0715753. Include your registered email, team name, a screenshot if possible, and a description of the problem. We respond Mon–Sun, 12:00 PM – 2:00 AM PKT.',
  },
  {
    q: 'What devices/browsers are supported?',
    a: 'Zenith Esports works on all modern browsers — Chrome, Firefox, Edge, Safari — on both mobile and desktop. For the best experience, keep your browser updated. If something looks broken, try a hard refresh (Ctrl+Shift+R / Cmd+Shift+R).',
  },
  {
    q: 'What are the rules around fair play?',
    a: 'Any form of cheating, hacking, account sharing, or unsportsmanlike conduct results in immediate disqualification and a permanent ban from future Zenith Esports events. All matches are monitored and disputes are reviewed by the admin team. Match results are final once verified.',
  },
  {
    q: 'How do I dispute a match result?',
    a: 'Contact us on WhatsApp within 2 hours of the contested match. Include your team name, the opponent\'s team name, the match time, and any evidence (screenshots/recordings). Disputes submitted after the 2-hour window will not be accepted.',
  },
];

// ── Support Topics ────────────────────────────────────────────────────────────
const TOPICS = [
  {
    icon: UserPlus,
    title: 'Registration Issues',
    tagline: 'Problems submitting or managing your team registration.',
    details: [
      { heading: 'Duplicate Player ID Error', body: 'This means one or more of your submitted PUBG Mobile Character IDs are already registered under another team. Each ID must be globally unique. Double-check all IDs and re-submit with corrections. If you believe this is a mistake, contact us on WhatsApp.' },
      { heading: 'Registration Stuck on Pending', body: 'Admin reviews registrations manually and typically processes them within 24 hours. If your registration has been Pending for over 48 hours, contact us on WhatsApp with your team name and registered email.' },
      { heading: 'Cannot Find the Register Button', body: 'The Register button only appears on Active tournaments when slots are still available. If the tournament is Upcoming, registrations have not opened yet. If it is Completed or full, the slot window has closed.' },
      { heading: 'Registration Was Rejected', body: 'You will receive a WhatsApp message explaining the reason. Common causes: duplicate IDs, fake/invalid IDs, incomplete information, or violation of eligibility rules. You may re-register with corrected details.' },
    ],
    faqKeys: [0, 2, 3, 4, 6, 7],
    wa: 'Hello, I have a registration issue: ',
  },
  {
    icon: KeyRound,
    title: 'Account & Login',
    tagline: 'Sign-in problems, password resets, and account settings.',
    details: [
      { heading: 'Magic Link Not Arriving', body: 'Check your spam/junk folder first. If it\'s not there, wait 2–3 minutes and try again. Make sure you are entering the exact email you used to sign up. If the issue persists, contact us on WhatsApp.' },
      { heading: 'Google Sign-In Disabled Error', body: 'Google OAuth may be temporarily unavailable. Switch to "Sign in with Email" — enter your email and we\'ll send you a one-click login link. No password needed.' },
      { heading: 'Account Not Created After Sign-Up', body: 'After clicking the magic link, your profile is created automatically. If your profile does not appear, try signing out and back in. If the issue continues, contact support.' },
      { heading: 'Cannot Update Profile Information', body: 'Navigate to your Profile page while signed in. All fields are editable. Hit Save after making changes. If the save button shows an error, your session may have expired — sign out and back in, then try again.' },
    ],
    faqKeys: [9, 10],
    wa: 'Hello, I have a login/account issue: ',
  },
  {
    icon: CalendarClock,
    title: 'Tournament Schedule',
    tagline: 'Match times, group assignments, and bracket questions.',
    details: [
      { heading: 'Where Is My Group?', body: 'After the admin splits teams into groups, your assignment will appear on your Profile page. You will also receive a WhatsApp notification. If groups have been announced and you don\'t see yours, contact us.' },
      { heading: 'Match Times & Lobby Details', body: 'Exact match times and room codes are communicated via your team\'s registered WhatsApp number before each round. Make sure your WhatsApp number is correct on your registration.' },
      { heading: 'Tournament Status Explained', body: '"Upcoming" means registrations haven\'t opened yet. "Active" means registrations are open/ongoing. "Completed" means the tournament has concluded. Status updates automatically based on dates set by the admin.' },
      { heading: 'Schedule Tab on Tournament Page', body: 'Visit the tournament\'s detail page and click the "Schedule" tab to see a full event timeline including match dates and times published by the organizer.' },
    ],
    faqKeys: [5],
    wa: 'Hello, I have a question about the tournament schedule: ',
  },
  {
    icon: Banknote,
    title: 'Prize & Payments',
    tagline: 'Prize claim process, bank details, and payment delays.',
    details: [
      { heading: 'How Prize Money Is Paid', body: 'After results are verified, the admin will contact the winning team\'s leader via WhatsApp to collect payment details. We support bank transfer, JazzCash, and EasyPaisa. Ensure your WhatsApp number on the registration is active and monitored.' },
      { heading: 'Prize Not Received', body: 'If you won and have not received payment within 7 days of the tournament ending, contact us on WhatsApp with your team name, tournament name, and any reference messages from the admin.' },
      { heading: 'Prize Pool Amount', body: 'The total prize pool is listed on each tournament\'s detail page. Distribution breakdown (1st, 2nd, 3rd place shares) is shown in the tournament briefing before the event begins.' },
      { heading: 'Tax & Deductions', body: 'Zenith Esports does not deduct any fees from prize winnings. The full listed amount is paid to winners minus any applicable government-mandated deductions (if applicable) which will be communicated in advance.' },
    ],
    faqKeys: [8],
    wa: 'Hello, I have a prize/payment question: ',
  },
  {
    icon: ShieldAlert,
    title: 'Rules & Conduct',
    tagline: 'Tournament rules, fair play policy, and dispute resolution.',
    details: [
      { heading: 'Fair Play Policy', body: 'Any form of cheating (aimbots, lag switches, account boosting), unsportsmanlike conduct, harassment, or impersonation results in immediate disqualification and a permanent ban from all future Zenith Esports events. All matches are monitored.' },
      { heading: 'Disputing a Match Result', body: 'Contact us within 2 hours of the match via WhatsApp. Include: team names, match time, and evidence (screenshots or gameplay recordings). Disputes submitted after 2 hours will not be accepted. All admin decisions are final.' },
      { heading: 'Team Eligibility', body: 'All team members must be Pakistani residents and have a valid PUBG Mobile account. Accounts must be in good standing (not banned). Minimum age is 15 years. Players may only represent one team per tournament.' },
      { heading: 'Ban Appeals', body: 'If you believe a ban was issued in error, contact us on WhatsApp with your team name and a detailed explanation. Include any supporting evidence. All appeals are reviewed by the admin team, and a final decision will be communicated within 72 hours.' },
    ],
    faqKeys: [13, 14],
    wa: 'Hello, I have a rules/conduct question: ',
  },
  {
    icon: Bug,
    title: 'Technical Bugs',
    tagline: 'Website issues, loading errors, or dashboard problems.',
    details: [
      { heading: 'Page Not Loading / Infinite Spinner', body: 'Try a hard refresh: hold Ctrl (or Cmd on Mac) and press F5 or R. Clear your browser cache. If the problem continues on multiple browsers/devices, the server may be temporarily unavailable — check back in a few minutes or contact us.' },
      { heading: 'Registration Form Error', body: 'Make sure all required fields (marked with *) are filled. Player IDs must be numeric PUBG Mobile Character IDs. If you see a specific error message, take a screenshot and contact us on WhatsApp.' },
      { heading: 'Profile Data Not Saving', body: 'Session timeouts can cause save failures. Sign out, sign back in, and try saving again. If you are on a mobile browser, ensure pop-ups are enabled for the site (needed for magic link authentication).' },
      { heading: 'Images / Logos Not Displaying', body: 'Team logos and tournament posters are stored on our servers. If they aren\'t loading, it may be a network issue on your side. Try disabling any ad blockers or VPNs and reload the page.' },
    ],
    faqKeys: [11, 12],
    wa: 'Hello, I have a technical issue: ',
  },
];

// ── FAQ Item ──────────────────────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b border-[rgba(78,70,56,0.15)] transition-colors ${open ? 'bg-[#1f1f1f]' : ''}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex justify-between items-center px-6 py-5 text-left group"
      >
        <span className="font-agency text-lg font-bold tracking-tight group-hover:text-[#f9d07a] transition-colors pr-8">
          {q}
        </span>
        {open
          ? <ChevronUp size={18} className="text-[#f9d07a] flex-shrink-0" />
          : <ChevronDown size={18} className="text-[#d1c5b3] opacity-30 flex-shrink-0 group-hover:opacity-70 transition-opacity" />
        }
      </button>
      {open && (
        <div className="px-6 pb-6 border-l-4 border-[#dbb462]">
          <p className="text-[#d1c5b3] opacity-70 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// ── Topic Drawer ──────────────────────────────────────────────────────────────
function TopicDrawer({ topic, onClose }) {
  const { icon: Icon, title, details, faqKeys, wa } = topic;
  const relatedFAQs = faqKeys.map((k) => FAQS[k]).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm px-4 pb-4 md:pb-0">
      <div className="bg-[#131313] border border-[rgba(78,70,56,0.35)] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[rgba(78,70,56,0.2)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#dbb462]/10 border border-[#dbb462]/30 flex items-center justify-center flex-shrink-0">
              <Icon size={16} className="text-[#dbb462]" />
            </div>
            <div>
              <h2 className="font-agency text-2xl font-bold leading-none">{title}</h2>
              <p className="font-stretch text-[8px] tracking-widest text-[#d1c5b3] opacity-40 mt-0.5">
                SUPPORT TOPIC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#d1c5b3] opacity-40 hover:opacity-100 transition-opacity p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 no-scrollbar">

          {/* Detailed sub-topics */}
          <div className="divide-y divide-[rgba(78,70,56,0.1)]">
            {details.map(({ heading, body }) => (
              <div key={heading} className="px-8 py-6 hover:bg-[#1a1a1a] transition-colors">
                <h3 className="font-agency text-lg font-bold text-[#f9d07a] mb-2">{heading}</h3>
                <p className="text-[#d1c5b3] opacity-70 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          {/* Related FAQs */}
          {relatedFAQs.length > 0 && (
            <div className="border-t border-[rgba(78,70,56,0.2)] bg-[#1b1b1b]">
              <p className="font-stretch text-[8px] tracking-widest text-[#d1c5b3] opacity-40 px-8 pt-5 pb-2">
                RELATED QUESTIONS
              </p>
              <div>
                {relatedFAQs.map((faq, i) => (
                  <FAQItem key={i} {...faq} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="border-t border-[rgba(78,70,56,0.2)] px-8 py-5 flex items-center justify-between gap-4 flex-shrink-0 bg-[#0e0e0e]">
          <p className="text-[#d1c5b3] opacity-40 text-xs">Still stuck? Chat with us directly.</p>
          <a
            href={`https://wa.me/923390715753?text=${encodeURIComponent(wa)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="zenith-gradient text-[#402d00] font-stretch text-[10px] px-6 py-3 tracking-widest hover:brightness-110 transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0"
          >
            <MessageCircle size={13} />
            WHATSAPP SUPPORT
            <ExternalLink size={11} className="opacity-60" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SupportPage() {
  const [activeTopic, setActiveTopic] = useState(null);

  return (
    <div className="min-h-screen bg-[#131313] pt-20 animate-page-enter">

      {/* Topic Drawer */}
      {activeTopic && (
        <TopicDrawer topic={activeTopic} onClose={() => setActiveTopic(null)} />
      )}

      {/* Hero */}
      <section className="py-24 px-6 md:px-12 bg-[#1b1b1b]">
        <span className="font-stretch text-[#f9d07a] text-[10px] tracking-[0.4em] block mb-4">HELP CENTER</span>
        <h1 className="font-agency text-7xl md:text-8xl font-black italic tracking-tighter leading-tight pb-2 pr-4 mb-6">
          HELP &amp; <span className="zenith-gradient-text pr-4">SUPPORT</span>
        </h1>
        <p className="text-[#d1c5b3] opacity-60 max-w-xl text-base leading-relaxed">
          Find answers to frequently asked questions, or reach us directly on WhatsApp for immediate assistance.
        </p>
      </section>

      {/* Quick contact strip */}
      <div className="bg-[#0e0e0e] px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[rgba(78,70,56,0.15)]">
        <div>
          <span className="font-stretch text-[9px] text-[#f9d07a] tracking-widest">NEED DIRECT HELP?</span>
          <p className="font-agency text-2xl font-bold mt-1">WhatsApp: +92 339 0715753</p>
        </div>
        <a
          href="https://wa.me/923390715753"
          target="_blank"
          rel="noopener noreferrer"
          className="zenith-gradient text-[#402d00] font-stretch text-[10px] px-8 py-4 tracking-widest hover:brightness-110 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <MessageCircle size={14} />
          CHAT WITH US
        </a>
      </div>

      {/* Support Topics */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <span className="font-stretch text-[#f9d07a] text-[10px] tracking-[0.4em] block mb-3">BROWSE BY TOPIC</span>
            <h2 className="font-agency text-4xl font-black italic tracking-tighter">SUPPORT TOPICS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOPICS.map((topic) => {
              const Icon = topic.icon;
              return (
                <button
                  key={topic.title}
                  onClick={() => setActiveTopic(topic)}
                  className="group text-left bg-[#1b1b1b] border border-[rgba(78,70,56,0.2)] hover:border-[#dbb462]/50 hover:bg-[#1f1f1f] transition-all duration-200 p-6 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 bg-[#dbb462]/10 border border-[#dbb462]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#dbb462]/20 transition-colors">
                      <Icon size={18} className="text-[#dbb462]" />
                    </div>
                    <span className="font-stretch text-[8px] tracking-widest text-[#dbb462] opacity-0 group-hover:opacity-60 transition-opacity">
                      {topic.details.length} TOPICS →
                    </span>
                  </div>
                  <div>
                    <h3 className="font-agency text-xl font-bold mb-1 group-hover:text-[#f9d07a] transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-[#d1c5b3] opacity-50 text-xs leading-relaxed">{topic.tagline}</p>
                  </div>
                  <div className="mt-auto pt-2 border-t border-[rgba(78,70,56,0.15)] flex items-center justify-between">
                    <span className="font-stretch text-[8px] tracking-widest text-[#d1c5b3] opacity-30">
                      CLICK TO EXPAND
                    </span>
                    <ChevronDown size={14} className="text-[#d1c5b3] opacity-30 group-hover:text-[#f9d07a] group-hover:opacity-100 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-[#d1c5b3] opacity-40 text-sm">
              Can't find your answer?{' '}
              <a href="https://wa.me/923390715753" target="_blank" rel="noopener noreferrer" className="text-[#f9d07a] hover:underline">
                Contact us on WhatsApp
              </a>{' '}
              for direct support.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 md:px-12 bg-[#1b1b1b]">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <span className="font-stretch text-[#f9d07a] text-[10px] tracking-[0.4em] block mb-3">COMMON QUESTIONS</span>
            <h2 className="font-agency text-4xl font-black italic tracking-tighter">FREQUENTLY ASKED</h2>
          </div>
          <div className="bg-[#131313] border border-[rgba(78,70,56,0.15)]">
            {FAQS.map((item, i) => (
              <FAQItem key={i} {...item} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
