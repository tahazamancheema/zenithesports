import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { signInWithEmail, signUpWithEmail } from '../supabase/auth';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import GhostInput from '../components/ui/GhostInput';
import GradientButton from '../components/ui/GradientButton';
import InteractiveBackground from '../components/ui/InteractiveBackground';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', displayName: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/tournaments');
  }, [user, navigate]);

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.email) errs.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    if (mode === 'register') {
      if (!form.displayName.trim()) errs.displayName = 'Name required';
      if (form.password !== form.confirmPassword)
        errs.confirmPassword = 'Passwords do not match';
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log('[AuthPage] Submit started. Mode:', mode);
    const errs = validate();
    if (Object.keys(errs).length > 0) { 
      console.log('[AuthPage] Validation errors:', errs);
      setErrors(errs); 
      return; 
    }

    setLoading(true);
    console.log('[AuthPage] setLoading(true) called');
    try {
      if (mode === 'login') {
        console.log('[AuthPage] Awaiting signInWithEmail...');
        await signInWithEmail(form.email.trim(), form.password);
        console.log('[AuthPage] signInWithEmail resolved successfully.');
        toast.success('Welcome back to Zenith!');
        console.log('[AuthPage] Navigating to /tournaments');
        navigate('/tournaments');
        console.log('[AuthPage] Navigation command sent.');
      } else {
        const { session } = await signUpWithEmail(form.email.trim(), form.password, form.displayName);
        if (session) {
          toast.success('Account created! Welcome to Zenith Esports 🎮');
          navigate('/tournaments');
        } else {
          toast.success('Registration successful! Please check your email inbox to verify your account.');
          setForm({ ...form, password: '', confirmPassword: '' });
          setMode('login'); // switch to login mode while they verify
        }
      }
    } catch (err) {
      console.error('[AuthPage] Caught error in handleSubmit:', err);
      try {
        const rawMsg = err?.message || friendlyError(err?.code);
        const msg = typeof rawMsg === 'string' ? rawMsg : 'An unexpected error occurred.';
        toast.error(msg);
        setErrors({ general: msg });
      } catch(e) {
        setErrors({ general: 'Sign in failed.' });
      }
    } finally {
      console.log('[AuthPage] Finally block reached, calling setLoading(false)');
      setLoading(false);
    }
  }



  function friendlyError(code) {
    const map = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'Email already registered. Please login.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
      'auth/too-many-requests': 'Too many failed attempts. Try again later.',
    };
    return map[code] || 'Something went wrong. Please try again.';
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-[#131313]">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#dbb462]/5 blur-3xl" />
      </div>
      <InteractiveBackground />

      <div className="relative w-full max-w-md z-10">
        {/* Brand header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <img src="/logo.png" alt="Zenith Esports" className="h-16 w-auto object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
            <span className="font-agency text-4xl font-black italic tracking-tighter text-[#dbb462]">
              ZENITH
            </span>
          </Link>
          <p className="font-stretch text-[9px] tracking-[0.3em] text-[#d1c5b3] opacity-40 mt-2">
            PAKISTAN ESPORTS COMMAND
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex mb-8 bg-[#0e0e0e]">
          {['login', 'register'].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setErrors({}); }}
              className={`
                flex-1 py-4 font-stretch text-[10px] tracking-widest transition-all duration-200
                ${mode === m
                  ? 'bg-[#1f1f1f] text-[#f9d07a] border-b-2 border-[#f9d07a]'
                  : 'text-[#d1c5b3] opacity-40 hover:opacity-70'
                }
              `}
            >
              {m === 'login' ? 'LOGIN' : 'REGISTER'}
            </button>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-[#1f1f1f] p-8 border border-[rgba(78,70,56,0.2)]">
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 mb-6">
              <p className="text-[#ffb4ab] text-xs">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <GhostInput
                id="displayName"
                label="Full Name"
                placeholder="Muhammad Ali"
                value={form.displayName}
                onChange={(e) => handleChange('displayName', e.target.value)}
                error={errors.displayName}
                required
              />
            )}

            <GhostInput
              id="email"
              type="email"
              label="Email Address"
              placeholder="gamer@example.com"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              required
              autoComplete="email"
            />

            <div className="space-y-1">
              <label className="font-stretch text-[9px] tracking-widest text-[#d1c5b3] uppercase block">
                Password <span className="text-[#f9d07a]">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="••••••••"
                  className={`input-ghost pr-10 ${errors.password ? 'border-b-[#ffb4ab]' : ''}`}
                  style={errors.password ? { borderBottomColor: '#ffb4ab' } : {}}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-0 text-[#d1c5b3] opacity-40 hover:opacity-100 transition-opacity"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[#ffb4ab] text-[10px] font-stretch tracking-wide">⚠ {errors.password}</p>
              )}
            </div>

            {mode === 'register' && (
              <GhostInput
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
              />
            )}

            <GradientButton
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'PROCESSING...' : mode === 'login' ? 'ACCESS SYSTEM' : 'CREATE ACCOUNT'}
            </GradientButton>
          </form>


        </div>

        <p className="text-center font-body text-[10px] text-[#d1c5b3] opacity-30 mt-6">
          By continuing you agree to Zenith Esports Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
}
