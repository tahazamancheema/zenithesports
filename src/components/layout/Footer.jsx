import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Instagram, MessageCircle, ChevronRight } from 'lucide-react';

const FOOTER_LINKS = [
  { label: 'ABOUT US',        to: '/about' },
  { label: 'TERMS OF SERVICE', to: '/terms' },
  { label: 'PRIVACY POLICY',  to: '/privacy' },
  { label: 'SUPPORT',         to: '/support' },
  { label: 'CONTACT',         to: '/contact' },
];

const SOCIAL_LINKS = [
  {
    icon: Youtube,
    href: 'https://youtube.com/@zenithesports.pakistan',
    label: 'YouTube',
  },
  {
    icon: Instagram,
    href: 'https://instagram.com/zenithesports.pk',
    label: 'Instagram',
  },
  {
    // +92339 0715753
    icon: MessageCircle,
    href: 'https://wa.me/923390715753',
    label: 'WhatsApp',
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1b1b1b] border-t border-[rgba(78,70,56,0.15)]">
      {/* Main footer grid */}
      <div className="px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Brand column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Zenith Esports"
              className="h-8 w-auto object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="font-agency text-2xl font-black italic tracking-tighter text-[#dbb462]">
              ZENITH ESPORTS
            </span>
          </div>
          <p className="font-body text-[#d1c5b3] text-sm opacity-60 leading-relaxed max-w-xs">
            Pakistan's premier competitive PUBG Mobile esports platform.
            Forged in obsidian, refined in victory.
          </p>
          <p className="font-stretch text-[8px] tracking-[0.2em] uppercase text-[#d1c5b3] opacity-30">
            Pakistan 🇵🇰
          </p>
        </div>

        {/* Quick links */}
        <div className="space-y-4">
          <h3 className="font-stretch text-[9px] tracking-widest text-[#f9d07a]">
            QUICK LINKS
          </h3>
          <div className="space-y-3">
            {FOOTER_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="block font-stretch text-[8px] tracking-[0.2em] uppercase text-[#d1c5b3] opacity-40 hover:text-[#dbb462] hover:opacity-100 transition-all duration-300"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Social + Contact */}
        <div className="space-y-4">
          <h3 className="font-stretch text-[9px] tracking-widest text-[#f9d07a]">
            CONNECT
          </h3>
          <div className="flex gap-4">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 bg-[#1f1f1f] border border-[rgba(78,70,56,0.3)] flex items-center justify-center text-[#d1c5b3] hover:text-[#f9d07a] hover:border-[#f9d07a] transition-all duration-200"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
          {/* Support card */}
          <div className="mt-5 border-t-2 border-[#dbb462] bg-[#0e0e0e]" style={{ borderImage: 'linear-gradient(135deg, #dbb462 0%, #fbefc4 100%) 1' }}>
            {/* WhatsApp row */}
            <a
              href="https://wa.me/923390715753"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-4 group hover:bg-[#181818] transition-colors border-b border-[rgba(78,70,56,0.15)]"
            >
              <div className="w-8 h-8 bg-[#dbb462]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#dbb462]/20 transition-colors">
                <MessageCircle size={14} className="text-[#dbb462]" />
              </div>
              <div className="min-w-0">
                <p className="font-stretch text-[7px] tracking-widest text-[#d1c5b3] mb-0.5" style={{ opacity: 0.4 }}>WHATSAPP SUPPORT</p>
                <p className="font-agency text-xl font-bold leading-none zenith-gradient-text group-hover:brightness-110 transition-all">
                  +92 339 0715753
                </p>
              </div>
              <ChevronRight size={14} className="text-[#dbb462] ml-auto flex-shrink-0" style={{ opacity: 0.4 }} />
            </a>

            {/* Hours row */}
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="w-8 h-8 bg-[#dbb462]/10 flex items-center justify-center flex-shrink-0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#dbb462]">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <p className="font-stretch text-[7px] tracking-widest text-[#d1c5b3] mb-0.5" style={{ opacity: 0.4 }}>SUPPORT HOURS</p>
                <p className="font-agency text-xl font-bold leading-none text-[#e2e2e2]">
                  Mon – Sun &nbsp;·&nbsp; 12 PM – 2 AM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[rgba(78,70,56,0.15)] px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-stretch text-[8px] tracking-[0.2em] uppercase text-[#d1c5b3] opacity-30">
          © {year} ZENITH ESPORTS PAKISTAN. FORGED IN OBSIDIAN.
        </p>
        <div className="flex items-center gap-2">
          <span className="font-stretch text-[8px] tracking-widest text-[#d1c5b3] opacity-30">
            A PROJECT BY
          </span>
          <span className="font-agency text-sm font-bold italic tracking-tight text-[#dbb462] opacity-60">
            BEYOND ZENITH
          </span>
        </div>
      </div>
    </footer>
  );
}
