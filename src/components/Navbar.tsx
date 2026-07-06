import React from 'react';
import { Handshake, Sun, Cloud, Moon, Shield } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  fairScore: number;
  theme: 'white' | 'babyblue' | 'dark';
  setTheme: (theme: 'white' | 'babyblue' | 'dark') => void;
  currentUser: {
    name: string;
    email: string;
    avatar: string;
    isVerified: boolean;
    fairScoreBoost: number;
    phoneVerified: boolean;
    identityVerified: boolean;
    socialsConnected: { twitter?: string; github?: string };
  } | null;
  onLogout: () => void;
}

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  fairScore, 
  theme, 
  setTheme,
  currentUser,
  onLogout
}: NavbarProps) {
  const tabs = [
    { id: 'landing', label: 'Home' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'borrow', label: 'Borrow' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'wallet', label: 'Wallet' },
    { id: 'earnings', label: 'Earnings' },
    { id: 'profile', label: 'Profile' },
  ];

  const themeClasses = {
    white: {
      nav: 'bg-white border-b border-gray-100',
      text: 'text-gray-900',
      activeTab: 'bg-primary-orange text-white font-semibold',
      inactiveTab: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
      badge: 'bg-gray-50 border-gray-100',
    },
    babyblue: {
      nav: 'bg-white/90 backdrop-blur-md border-b border-blue-100',
      text: 'text-slate-950',
      activeTab: 'bg-primary-orange text-white font-semibold',
      inactiveTab: 'text-slate-600 hover:text-slate-950 hover:bg-blue-50/60',
      badge: 'bg-blue-50 border-blue-100/50',
    },
    dark: {
      nav: 'bg-slate-950/95 border-b border-slate-900',
      text: 'text-white',
      activeTab: 'bg-primary-orange text-white font-semibold',
      inactiveTab: 'text-gray-400 hover:text-white hover:bg-slate-900',
      badge: 'bg-slate-900 border-slate-800',
    }
  };

  const currentThemeClasses = themeClasses[theme];

  return (
    <nav className={`${currentThemeClasses.nav} sticky top-0 z-50 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button 
            onClick={() => setCurrentTab('landing')} 
            className="flex items-center gap-x-2.5 group focus:outline-none"
            id="nav-logo"
          >
            <div className="w-10 h-10 bg-primary-orange rounded-xl flex items-center justify-center shadow-sm group-hover:bg-orange-600 transition-all duration-200">
              <Handshake className="text-white w-6 h-6" />
            </div>
            <div>
              <span className={`font-display text-2xl font-black tracking-tighter ${currentThemeClasses.text} block`}>
                FairLink<span className="text-primary-orange">p2p.com</span>
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <div className={`hidden md:flex items-center gap-x-1 p-1 rounded-full border ${
            theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-gray-50 border-gray-100'
          }`}>
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                    isActive ? currentThemeClasses.activeTab : currentThemeClasses.inactiveTab
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Theme Switch & Profile */}
          <div className="flex items-center gap-x-3.5">
            {/* Elegant 3-Way Toggle Switch */}
            <div className={`flex items-center p-0.5 rounded-xl border ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-gray-100 border-gray-200'
            }`}>
              <button
                onClick={() => setTheme('white')}
                title="White Mode"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  theme === 'white' 
                    ? 'bg-white text-amber-500 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('babyblue')}
                title="Baby Blue Mode (Default)"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  theme === 'babyblue' 
                    ? 'bg-sky-100 text-blue-600 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Cloud className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                title="Dark Mode"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-slate-800 text-indigo-400 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>

            {/* Profile */}
            <button
              onClick={() => {
                if (currentUser) {
                  setCurrentTab('profile');
                } else {
                  setCurrentTab('landing');
                }
              }}
              className={`flex items-center gap-x-2 border rounded-full px-3 py-1 text-left transition-all hover:scale-[1.02] cursor-pointer ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-150'
              }`}
            >
              {currentUser ? (
                <>
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-8 h-8 rounded-full border border-indigo-100 object-cover shadow-inner shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left hidden sm:block">
                    <div className={`text-xs font-bold leading-tight ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-gray-500 flex items-center gap-x-0.5">
                      FairScore: <span id="nav-score" className="font-bold text-emerald-500">{fairScore}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 bg-gray-250 text-gray-600 rounded-full flex items-center justify-center text-xs font-bold shadow-inner shrink-0">
                    GP
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className={`text-xs font-bold leading-tight ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      Guest Peer
                    </div>
                    <div className="text-[10px] text-indigo-500 font-bold hover:underline">
                      Sign In with Google
                    </div>
                  </div>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation tab-strip */}
        <div className={`flex md:hidden items-center justify-around py-2 border-t overflow-x-auto ${
          theme === 'dark' ? 'border-slate-900' : 'border-gray-100'
        }`}>
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary-orange text-white font-bold'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-slate-900' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
