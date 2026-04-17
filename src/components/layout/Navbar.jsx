import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../supabase/auth';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { label: 'HOME',        to: '/' },
  { label: 'TOURNAMENTS', to: '/tournaments' },
  { label: 'ABOUT US',    to: '/about' },
  { label: 'PROFILE',     to: '/profile' },
];

export default function Navbar() {
  const { user, userDoc, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    toast.loading('Signing out...', { id: 'logout' });
    await signOut();
    toast.success('Signed out', { id: 'logout' });
    window.location.href = '/';
  }

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  // Derive display name — Supabase stores it in user_metadata
  const displayName =
    userDoc?.username ||
    user?.user_metadata?.displayName ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'USER';

  // ── right-side auth widget ───────────────────────────────────────────────
  // KEY RULE: never hide the login button due to loading state.
  // Show: loading spinner (small) if loading AND no user yet,
  //       user info if user is present,
  //       login button if not loading and not user.
  // This guarantees the LOGIN button is always visible when logged out.
  const renderAuthWidget = () => {
    if (user) {
      return (
        <div className="hidden md:flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1f1f1f] border border-[#4e4638] flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-[#d1c5b3]" />
          </div>
          <span className="font-stretch text-[9px] tracking-widest text-[#d1c5b3] max-w-[120px] truncate">
            {displayName}
          </span>
          <button
            onClick={handleSignOut}
            className="text-[#d1c5b3] hover:text-[#ffb4ab] transition-colors p-1"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      );
    }

    // Show LOGIN button immediately — even while loading.
    // A tiny pulsing dot indicates the auth check is still in progress.
    return (
      <div className="hidden md:flex items-center gap-2">
        {loading && (
          <span className="w-1.5 h-1.5 bg-[#dbb462] rounded-full animate-pulse opacity-50" />
        )}
        <Link
          to="/auth"
          className="zenith-gradient text-[#402d00] font-stretch text-[10px] px-6 py-2.5 tracking-widest hover:brightness-110 active:scale-95 transition-all"
        >
          LOGIN
        </Link>
      </div>
    );
  };

  return (
    <header className="fixed top-0 w-full z-50 h-20 bg-[#131313] border-b border-[rgba(78,70,56,0.15)]">
      <div className="flex justify-between items-center px-6 md:px-12 w-full h-full">

        {/* Logo + Brand */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Zenith Esports Logo"
              className="h-10 w-auto object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="font-agency text-2xl font-black italic tracking-tighter zenith-gradient-text">
              ZENITH ESPORTS
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-1">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className={`
                  font-stretch text-[10px] tracking-widest px-4 py-2
                  transition-all duration-200 ease-out
                  ${isActive(to)
                    ? 'text-[#f9d07a] border-b-2 border-[#f9d07a]'
                    : 'text-[#d1c5b3] opacity-60 hover:opacity-100 hover:bg-[#2a2a2a]'
                  }
                `}
              >
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`
                  font-stretch text-[10px] tracking-widest px-4 py-2 flex items-center gap-1
                  transition-all duration-200 ease-out
                  ${location.pathname.startsWith('/admin')
                    ? 'text-[#f9d07a] border-b-2 border-[#f9d07a]'
                    : 'text-[#f9d07a] opacity-70 hover:opacity-100 hover:bg-[#2a2a2a]'
                  }
                `}
              >
                <ShieldCheck size={12} />
                ADMIN
              </Link>
            )}
          </nav>
        </div>

        {/* Right: auth + hamburger */}
        <div className="flex items-center gap-3">
          {renderAuthWidget()}

          <button
            className="md:hidden text-[#d1c5b3] hover:text-[#f9d07a] transition-colors p-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0e0e0e] border-b border-[rgba(78,70,56,0.15)] mobile-menu-enter">
          <nav className="flex flex-col py-4">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`
                  font-stretch text-[10px] tracking-widest px-6 py-4
                  ${isActive(to) ? 'text-[#f9d07a] bg-[#1f1f1f]' : 'text-[#d1c5b3] opacity-60'}
                `}
              >
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="font-stretch text-[10px] tracking-widest px-6 py-4 text-[#f9d07a] opacity-70 flex items-center gap-2"
              >
                <ShieldCheck size={12} />
                ADMIN PANEL
              </Link>
            )}

            {/* Mobile auth */}
            <div className="border-t border-[rgba(78,70,56,0.15)] mt-2">
              {user ? (
                <div className="px-6 py-4 flex items-center justify-between">
                  <span className="font-stretch text-[9px] tracking-widest text-[#d1c5b3] opacity-60 truncate max-w-[180px]">
                    {displayName}
                  </span>
                  <button
                    onClick={() => { handleSignOut(); setMobileOpen(false); }}
                    className="flex items-center gap-2 font-stretch text-[9px] tracking-widest text-[#ffb4ab]"
                  >
                    <LogOut size={12} />
                    SIGN OUT
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="mx-6 my-3 block zenith-gradient text-[#402d00] font-stretch text-[10px] px-6 py-3 tracking-widest text-center"
                >
                  LOGIN / REGISTER
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
