import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Instagram, MessageCircle, ChevronRight } from 'lucide-react';

const FOOTER_LINKS = [
  { label: 'ABOUT US', to: '/about' },
  { label: 'TERMS OF SERVICE', to: '/terms' },
  { label: 'PRIVACY POLICY', to: '/privacy' },
  { label: 'SUPPORT', to: '/support' },
  { label: 'CONTACT', to: '/contact' },
];

const SOCIAL_LINKS = [
  { icon: Youtube, href: 'https://youtube.com/@zenithesports.pakistan', label: 'YouTube' },
  { icon: Instagram, href: 'https://instagram.com/zenithesports.pk', label: 'Instagram' },
  { icon: MessageCircle, href: 'https://wa.me/923390715753', label: 'WhatsApp' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0e0e0e] border-t border-white/5 relative overflow-hidden">
      {/* Background branding */}
      <div className="absolute -bottom-10 -left-10 font-bebas text-[20vw] text-white/[0.02] pointer-events-none select-none uppercase leading-none">
        Zenith
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

          {/* Column 1: Branding */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-5">
              <img
                src="/logo.png"
                alt="Zenith"
                className="h-12 w-auto object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="font-bebas text-4xl tracking-tight leading-none uppercase">
                <span className="text-[#f2f2f2]">ZENITH</span>
                <span className="ml-2 text-[#dbb462]">ESPORTS</span>
              </div>
            </div>

            <p className="font-body text-[#d1c5b3] text-lg opacity-40 leading-relaxed max-w-sm">
              Pakistan's premier platform for competitive PUBG Mobile. We provide the stage for squads to compete and prove their skills.
            </p>
          </div>

          {/* Column 2: Directory */}
          <div className="lg:col-span-3 space-y-8">
            <h4 className="font-teko text-[18px] tracking-widest text-[#dbb462] opacity-80 uppercase">Directory</h4>
            <div className="flex flex-col gap-4">
              {FOOTER_LINKS.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="group flex items-center gap-3 font-bebas text-xl tracking-widest text-[#d1c5b3] opacity-40 hover:opacity-100 hover:text-white transition-all"
                >
                  <ChevronRight size={14} className="text-[#dbb462] opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all duration-300" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Support */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-[#111] border border-white/5 p-8 relative group overflow-hidden">
              <h4 className="font-teko text-[18px] tracking-widest text-[#dbb462] opacity-80 uppercase mb-8">Technical Support</h4>

              <a
                href="https://wa.me/923390715753"
                target="_blank"
                rel="noopener noreferrer"
                className="block group/wa"
              >
                <p className="font-teko text-[14px] tracking-widest text-[#d1c5b3] opacity-40 uppercase mb-2">WhatsApp Unit</p>
                <div className="flex items-center justify-between">
                  <span className="font-bebas text-3xl text-white group-hover:text-[#dbb462] transition-colors leading-none">
                    +92 339 0715753
                  </span>
                  <MessageCircle size={28} className="text-[#dbb462] transition-all group-hover/wa:scale-110" />
                </div>
              </a>

              <div className="pt-8 mt-8 border-t border-white/5">
                <p className="font-teko text-[14px] tracking-widest text-[#d1c5b3] opacity-40 uppercase mb-2">Operational Hours (PKT)</p>
                <p className="font-bebas text-xl text-white tracking-widest">MON – SUN &nbsp;·&nbsp; 12 PM — 02 AM</p>
              </div>
            </div>

            <div className="flex gap-4">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-4 bg-[#111] border border-white/5 flex items-center justify-center text-[#d1c5b3] hover:text-[#dbb462] hover:bg-[#dbb462]/5 hover:border-[#dbb462]/30 transition-all"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 bg-[#0a0a0a] py-10">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-center items-center gap-4 text-center">
          <span className="font-teko text-[16px] tracking-widest text-[#d1c5b3] opacity-40 uppercase">
            © 2021 - {year} Zenith Esports Pakistan &nbsp;&bull;&nbsp; A Project By <span className="text-[#dbb462] opacity-100 font-bold">Beyond Zenith</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
