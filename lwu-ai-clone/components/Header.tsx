'use client';

import { useState } from 'react';
import { Sparkles, User, LogOut, LayoutDashboard, Coins, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import AuthModal from './AuthModal';
import LanguageSwitcher from './LanguageSwitcher';
import { useLocale } from '@/i18n/LocaleProvider';
import Link from 'next/link';

export default function Header() {
  const { data: session, status } = useSession();
  const { locale, setLocale } = useLocale();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  const handleSignIn = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    } else {
      setAuthMode('register');
      setShowAuthModal(true);
    }
  };

  const handleSignOut = async () => {
    setShowUserMenu(false);
    await signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/50 border-b border-white/10"
      >
        <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Sparkles className="w-8 h-8 text-indigo-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                LWU AI
              </span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="/#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="/#pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="/#gallery" className="text-gray-300 hover:text-white transition-colors">
                Gallery
              </a>
              {isAuthenticated && (
                <Link href="/tools" className="text-gray-300 hover:text-white transition-colors">
                  Tools
                </Link>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher currentLocale={locale} onLocaleChange={setLocale} />
              {isLoading ? (
                <div className="w-32 h-10 bg-white/5 rounded-full animate-pulse" />
              ) : isAuthenticated && session?.user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center overflow-hidden">
                      {session.user.image ? (
                        <img src={session.user.image} alt={session.user.name || ''} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium">{session.user.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        {session.user.credits || 0} credits
                      </div>
                    </div>
                  </button>

                  {/* User menu dropdown */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-lg shadow-xl overflow-hidden"
                      >
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-red-400"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleSignIn}
                    className="hidden sm:block px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white font-medium hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
}
