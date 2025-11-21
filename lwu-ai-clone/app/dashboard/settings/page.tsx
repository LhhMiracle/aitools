'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Mail,
  Crown,
  Coins,
  Calendar,
  Shield,
  Bell,
  Palette,
  Save,
  Loader2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { data: session, status, update: updateSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    marketingEmails: false,
    darkMode: true,
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          </div>
        </main>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
      await updateSession();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Preferences saved!');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'subscription', name: 'Subscription', icon: Crown },
    { id: 'notifications', name: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h2 className="text-xl font-bold mb-6">Profile Information</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    Save Changes
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h2 className="text-xl font-bold mb-4">Account Statistics</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5">
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                        <Calendar className="w-4 h-4" />
                        Member Since
                      </div>
                      <div className="font-semibold">
                        {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                        <Shield className="w-4 h-4" />
                        Account Status
                      </div>
                      <div className="font-semibold text-green-400">Active</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h2 className="text-xl font-bold mb-6">Current Plan</h2>

                  <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Crown className="w-8 h-8 text-yellow-400" />
                        <div>
                          <h3 className="text-xl font-bold">{user.plan?.toUpperCase() || 'FREE'} Plan</h3>
                          <p className="text-sm text-gray-400">
                            {user.plan === 'free' ? 'Basic features' : 'All features unlocked'}
                          </p>
                        </div>
                      </div>
                      {user.plan !== 'free' && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-yellow-400" />
                      <span className="text-2xl font-bold">{user.credits}</span>
                      <span className="text-gray-400">credits remaining</span>
                    </div>
                  </div>

                  <Link
                    href="/#pricing"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
                  >
                    {user.plan === 'free' ? 'Upgrade Plan' : 'Change Plan'}
                  </Link>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h2 className="text-xl font-bold mb-4">Credit Usage</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">This Month</span>
                      <span className="font-semibold">0 credits used</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">All Time</span>
                      <span className="font-semibold">0 credits used</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div>
                      <h3 className="font-semibold">Email Notifications</h3>
                      <p className="text-sm text-gray-400">
                        Receive updates about your generations
                      </p>
                    </div>
                    <button
                      onClick={() => setPreferences({
                        ...preferences,
                        emailNotifications: !preferences.emailNotifications
                      })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.emailNotifications ? 'bg-indigo-500' : 'bg-white/10'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          preferences.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div>
                      <h3 className="font-semibold">Marketing Emails</h3>
                      <p className="text-sm text-gray-400">
                        Receive news and promotional offers
                      </p>
                    </div>
                    <button
                      onClick={() => setPreferences({
                        ...preferences,
                        marketingEmails: !preferences.marketingEmails
                      })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.marketingEmails ? 'bg-indigo-500' : 'bg-white/10'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          preferences.marketingEmails ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSavePreferences}
                  disabled={loading}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Save Preferences
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
