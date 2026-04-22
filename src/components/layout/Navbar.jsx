import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../supabase/auth';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { label: 'HOME',         to: '/' },
  { label: 'TOURNAMENTS',  to: '/tournaments' },
  { label: 'ABOUT US',    to: '/about' },
  { label: 'MY PROFILE',   to: '/profile' },
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
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
        scrolled 
          ? 'h-20 bg-[#0e0e0e]/95 backdrop-blur-xl border-white/10 shadow-2xl' 
          : 'h-24 bg-transparent border-white/5'
      }`}
    >
      <div className="container mx-auto h-full px-6 lg:px-12 flex justify-between items-center">
        
        {/* Brand Area */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Zenith"
                className="relative h-12 md:h-14 w-auto object-contain transition-all duration-700 group-hover:scale-105"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <div className="flex flex-col">
              <div className="font-bebas text-3xl md:text-4xl tracking-tight leading-none uppercase">
                <span className="text-[#f2f2f2]">ZENITH</span>
                <span className="ml-2 text-[#dbb462]">ESPORTS</span>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className={`
                  relative font-teko text-[18px] tracking-widest px-5 py-2 uppercase
                  transition-all duration-300
                  ${isActive(to)
                    ? 'text-[#dbb462]'
                    : 'text-[#d1c5b3] opacity-40 hover:opacity-100 hover:text-white'
                  }
                  group/nav
                `}
              >
                {label}
                <div className={`absolute bottom-0 left-5 right-5 h-[2px] bg-[#dbb462] transition-all duration-500 origin-left ${isActive(to) ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100'}`} />
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="ml-4 flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 font-teko text-[16px] tracking-widest text-[#dbb462] hover:bg-white/10 transition-all uppercase"
              >
                <ShieldCheck size={16} />
                ADMIN
              </Link>
            )}
          </nav>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center gap-6 group/user">
                <div className="text-right">
                  <p className="font-bebas text-2xl text-white tracking-widest uppercase truncate max-w-[250px] transition-colors">
                    {displayName}
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={handleSignOut}
                    className="w-12 h-12 bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-[#d1c5b3] hover:text-[#ffb4ab] hover:border-[#ffb4ab]/50 transition-all"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="btn-obsidian-primary font-bebas text-[20px] px-10 py-4 tracking-widest uppercase"
              >
                LOGIN
              </Link>
            )}
          </div>

          <button
            className="lg:hidden text-[#f2f2f2] hover:text-[#dbb462] transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={36} /> : <Menu size={36} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bg-[#0e0e0e] border-b border-[#dbb462]/20 animate-in slide-in-from-top-10 duration-500 z-50">
          <nav className="flex flex-col p-10 gap-8">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`font-agency text-3xl font-black italic tracking-tighter uppercase ${isActive(to) ? 'text-[#dbb462]' : 'text-[#d1c5b3] opacity-40'}`}
              >
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="font-agency text-xl font-bold tracking-[0.2em] text-[#dbb462] py-4 border-t border-white/5 flex items-center gap-3 uppercase"
              >
                <ShieldCheck size={20} /> ADMIN PANEL
              </Link>
            )}
            <div className="pt-8 border-t border-white/5">
              {!user ? (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center zenith-gradient text-[#402d00] font-agency font-bold text-xl py-6 tracking-[0.2em]"
                >
                  LOGIN / REGISTER
                </Link>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="w-full text-center border border-[#ffb4ab]/30 text-[#ffb4ab] font-agency font-bold text-xl py-6 tracking-[0.2em] uppercase"
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
