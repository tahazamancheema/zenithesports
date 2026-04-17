import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './hooks/useAuth';

// Lazy-load all pages for code splitting
const LandingPage     = lazy(() => import('./pages/LandingPage'));
const AuthPage        = lazy(() => import('./pages/AuthPage'));
const ProfilePage     = lazy(() => import('./pages/ProfilePage'));
const AdminDashboard  = lazy(() => import('./pages/AdminDashboard'));
const TournamentsPage = lazy(() => import('./pages/TournamentsPage'));
const TournamentDetailsPage = lazy(() => import('./pages/TournamentDetailsPage'));
const AboutPage       = lazy(() => import('./pages/AboutPage'));
const ContactPage     = lazy(() => import('./pages/ContactPage'));
const SupportPage     = lazy(() => import('./pages/SupportPage'));
const TermsPage       = lazy(() => import('./pages/TermsPage'));
const PrivacyPage     = lazy(() => import('./pages/PrivacyPage'));
const NotFoundPage    = lazy(() => import('./pages/NotFoundPage'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));

// Pages that don't show the main footer
const NO_FOOTER_ROUTES = ['/admin', '/profile'];

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#131313]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-1 zenith-gradient animate-pulse" />
        <span className="font-agency text-3xl font-bold italic text-[#dbb462] animate-pulse">
          ZENITH
        </span>
        <div className="w-12 h-1 zenith-gradient animate-pulse" />
      </div>
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  const showFooter = !NO_FOOTER_ROUTES.some((r) => location.pathname.startsWith(r));

  return (
    <div className="min-h-screen flex flex-col bg-[#131313]">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Main */}
            <Route path="/"            element={<LandingPage />} />
            <Route path="/auth"        element={<AuthPage />} />
            <Route path="/tournaments" element={<TournamentsPage />} />
            <Route path="/tournaments/:id" element={<TournamentDetailsPage />} />
            <Route path="/about"       element={<AboutPage />} />
            <Route path="/contact"     element={<ContactPage />} />
            <Route path="/support"     element={<SupportPage />} />
            <Route path="/terms"       element={<TermsPage />} />
            <Route path="/privacy"     element={<PrivacyPage />} />

            {/* Protected */}
            <Route
              path="/register/:tournamentId"
              element={
                <ProtectedRoute requireAuth>
                  <RegistrationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute requireAuth>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAuth requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

const TOAST_STYLE = {
  style: {
    background: '#1f1f1f',
    color: '#e2e2e2',
    border: '1px solid rgba(78, 70, 56, 0.3)',
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: '13px',
    borderRadius: '0px',
  },
  success: { iconTheme: { primary: '#dbb462', secondary: '#402d00' } },
  error:   { iconTheme: { primary: '#ffb4ab', secondary: '#690005' } },
};

export default function App() {
  // EXTREME FAILSAFE: Force clear physical memory if the browser lock engine corrupts
  useEffect(() => {
    if (window.location.search.includes('panic_reset')) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={TOAST_STYLE} />
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
