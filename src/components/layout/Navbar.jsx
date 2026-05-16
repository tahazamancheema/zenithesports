import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../supabase/auth';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { label: 'HOME', to: '/' },
  { label: 'TOURNAMENTS', to: '/tournaments' },
  { label: 'DAILY SCRIMS', to: '/scrims' },
  { label: 'ABOUT US', to: '/about' },
  { label: 'MY PROFILE', to: '/profile' },
];

export default function Navbar() {
  const { user, userDoc, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  async function handleSignOut() {
    toast.loading('Signing out...', { id: 'logout' });
    await signOut();
    toast.success('Signed out successfully.', { id: 'logout' });
    window.location.href = '/';
  }

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  const displayName =
    userDoc?.username ||
    user?.user_metadata?.displayName ||
    user?.email?.split('@')[0] ||
    'PLAYER';

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${scrolled
          ? 'h-16 bg-[#0a0a0a]/96 backdrop-blur-xl border-[rgba(219,180,98,0.1)] shadow-[0_4px_40px_rgba(0,0,0,0.6)]'
          : 'h-20 bg-transparent border-white/[0.04]'
        }`}
    >
      {/* Gradient underline that appears on scroll */}
      <div className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#dbb462]/30 to-transparent transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />
      <div className="container mx-auto h-full px-6 lg:px-12 flex justify-between items-center">

        {/* Brand Area */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Zenith"
                className="relative h-10 md:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="font-rajdhani font-bold text-xl md:text-2xl tracking-normal leading-none uppercase mt-1">
                <span className="text-[#f2f2f2] group-hover:text-white transition-colors">ZENITH</span>
                <span className="ml-1 text-[#dbb462] transition-colors">ESPORTS</span>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className={`
                  relative font-agency font-bold text-[18px] tracking-[0.05em] px-4 py-1 uppercase
                  transition-all duration-300
                  ${isActive(to)
                    ? 'text-[#dbb462]'
                    : 'text-[#d1c5b3] opacity-50 hover:opacity-100 hover:text-white'
                  }
                  group/nav
                `}
              >
                {label}
                <div className={`absolute bottom-0 left-4 right-4 h-[1.5px] bg-[#dbb462] transition-all duration-500 origin-left ${isActive(to) ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100'}`} />
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="ml-3 flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-1 font-agency font-bold text-[18px] tracking-[0.05em] text-[#dbb462] hover:bg-white/10 transition-all uppercase"
              >
                <ShieldCheck size={16} className="mb-0.5" />
                ADMIN
              </Link>
            )}
          </nav>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center gap-4 group/user">
                <div className="text-right">
                  <p className="font-agency font-bold text-[18px] text-white tracking-[0.05em] uppercase truncate max-w-[150px] transition-colors">
                    {displayName}
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={handleSignOut}
                    className="w-10 h-10 bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-[#d1c5b3] hover:text-[#ffb4ab] hover:border-[#ffb4ab]/50 transition-all"
                    title="Sign Out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="btn-obsidian-primary font-agency font-bold text-[18px] px-8 py-2 tracking-[0.05em] uppercase"
              >
                LOGIN
              </Link>
            )}
          </div>

          <button
            className="lg:hidden text-[#f2f2f2] hover:text-[#dbb462] transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className={`lg:hidden fixed inset-x-0 ${scrolled ? 'top-16' : 'top-20'} bg-[#0a0a0a]/98 backdrop-blur-xl border-b border-[#dbb462]/15 animate-in slide-in-from-top-10 duration-500 z-50`}>
          {/* Subtle gradient at top */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#dbb462]/30 to-transparent" />
          <nav className="flex flex-col p-10 gap-8">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`font-agency font-bold text-4xl tracking-[0.1em] uppercase ${isActive(to) ? 'text-[#dbb462]' : 'text-[#d1c5b3] opacity-40'}`}
              >
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="font-agency font-bold text-3xl tracking-[0.1em] text-[#dbb462] py-4 border-t border-white/5 flex items-center gap-3 uppercase"
              >
                <ShieldCheck size={24} /> ADMIN DASHBOARD
              </Link>
            )}
            <div className="pt-8 border-t border-white/5">
              {!user ? (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center zenith-gradient text-[#402d00] font-agency font-bold text-3xl py-4 tracking-[0.1em] uppercase"
                >
                  LOGIN / REGISTER
                </Link>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="w-full text-center border border-[#ffb4ab]/30 text-[#ffb4ab] font-agency font-bold text-3xl py-4 tracking-[0.1em] uppercase"
                >
                  SIGN OUT
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
