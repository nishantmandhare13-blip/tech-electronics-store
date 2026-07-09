import React, { useState } from 'react';
import { Sun, Moon, Volume2, VolumeX, ShieldAlert, User, Heart, ShoppingBag, Eye, Settings } from 'lucide-react';
import { sound } from '../audio';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  currentPanel: 'store' | 'admin' | 'split';
  setCurrentPanel: (panel: 'store' | 'admin' | 'split') => void;
  customerProfile: { name: string; email: string; phone: string; address: string };
  setCustomerProfile: (val: { name: string; email: string; phone: string; address: string }) => void;
  wishlistLength: number;
  setShowWishlistOnly: (val: boolean) => void;
  showWishlistOnly: boolean;
}

export default function Navbar({
  darkMode,
  setDarkMode,
  soundEnabled,
  setSoundEnabled,
  currentPanel,
  setCurrentPanel,
  customerProfile,
  setCustomerProfile,
  wishlistLength,
  setShowWishlistOnly,
  showWishlistOnly
}: NavbarProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [profileForm, setProfileForm] = useState(customerProfile);

  const handleSoundToggle = () => {
    const isEnabled = sound.toggleSound();
    setSoundEnabled(isEnabled);
    sound.playClick();
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentPanel('admin');
        setShowLoginModal(false);
        setUsername('');
        setPassword('');
        setLoginError('');
        sound.playSuccess();
      } else {
        const errData = await res.json();
        setLoginError(errData.error || 'Invalid credentials');
        sound.playPop();
      }
    } catch (e) {
      setLoginError('Server connection error. Please try again.');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setCustomerProfile(profileForm);
    setShowProfileModal(false);
    sound.playSuccess();
  };

  return (
    <nav className="sticky top-0 z-50 h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all duration-300">
      {/* Brand Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 via-rose-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-extrabold text-xl shadow-md transform hover:scale-105 transition-all">
          T
        </div>
        <div>
          <span className="font-sans font-black text-lg md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-rose-500 to-violet-600 italic">
            Tech Electronics Store
          </span>
          <span className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold">
            MBA PM Project 2026
          </span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Live Stock Badge from Design HTML */}
        <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/60 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">LIVE SYNC POS ACTIVE</span>
        </div>

        {/* User Profile Config */}
        <button
          onClick={() => { setShowProfileModal(true); setProfileForm(customerProfile); sound.playClick(); }}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer hover:text-amber-500"
          title="Customer Profile"
        >
          <User className="w-5.5 h-5.5" />
        </button>

        {/* Mute Audio controller */}
        <button
          onClick={handleSoundToggle}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
          title={soundEnabled ? "Mute Sound Effects" : "Unmute Sound Effects"}
        >
          {soundEnabled ? <Volume2 className="w-5.5 h-5.5 text-indigo-500" /> : <VolumeX className="w-5.5 h-5.5 text-slate-400" />}
        </button>

        {/* Dark/Light mode theme switch */}
        <button
          onClick={() => { setDarkMode(!darkMode); sound.playClick(); }}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun className="w-5.5 h-5.5 text-amber-500" /> : <Moon className="w-5.5 h-5.5 text-indigo-600" />}
        </button>
      </div>

      {/* ADMIN LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl glass-card p-6 shadow-2xl relative border border-slate-200 dark:border-slate-800">
            <h3 className="font-display font-bold text-2xl text-slate-800 dark:text-white flex items-center space-x-2">
              <ShieldAlert className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span>Admin Gateway</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Please authenticate to access product inventory, live orders, and metrics dashboards.
            </p>

            <form onSubmit={handleAdminLogin} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Admin Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter 'admin'"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Access Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter 'admin123'"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {loginError && (
                <p className="text-xs text-red-500 font-medium">
                  ⚠️ {loginError}
                </p>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => { setShowLoginModal(false); sound.playClick(); }}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-indigo-500/15"
                >
                  Verify Access
                </button>
              </div>
            </form>
            <div className="mt-4 p-2.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900 text-center">
              <span className="block text-[10px] font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">
                Demo Credentials
              </span>
              <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
                User: <span className="font-bold text-indigo-600 dark:text-indigo-400">admin</span> &bull; Pass: <span className="font-bold text-indigo-600 dark:text-indigo-400">admin123</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER PROFILE CONFIG MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl glass-card p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-display font-bold text-2xl text-slate-800 dark:text-white flex items-center space-x-2">
              <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span>Checkout Billing Profile</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure billing contact details used dynamically for instant invoices, GST computations, and door delivery logistics.
            </p>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                  Full Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                  Delivery Address (India)
                </label>
                <textarea
                  required
                  rows={2}
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => { setShowProfileModal(false); sound.playClick(); }}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
