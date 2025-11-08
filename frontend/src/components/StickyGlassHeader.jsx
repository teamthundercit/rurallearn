import React from 'react';
import { motion } from 'framer-motion';
import WelcomeMessage from './WelcomeMessage';
import LanguageSwitcher from './LanguageSwitcher';

const StickyGlassHeader = ({ user, displayUser, onLogout }) => {
  return (
    <header className="sticky-glass px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Welcome Section */}
        <div className="flex items-center gap-4">
          <motion.div
            className="text-3xl font-black text-neon-animate font-display gpu-accelerated"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            EduAdapt
          </motion.div>
          
          {/* Vertical Divider */}
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
          
          <WelcomeMessage name={displayUser?.name?.split(' ')[0] || 'User'} />
        </div>
        
        {/* User Profile Section */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">{displayUser?.name}</p>
            <p className="text-xs text-gray-600">{displayUser?.email}</p>
            {displayUser?.role && (
              <span className="badge-primary text-xs mt-1 inline-block">
                {displayUser.role}
              </span>
            )}
          </div>
          
          {(user?.picture || displayUser?.avatar) && (
            <div className="relative">
              <img
                src={user?.picture || displayUser?.avatar}
                alt={displayUser?.name}
                className="h-12 w-12 rounded-full ring-4 ring-primary-100 hover:ring-primary-200 transition-all cursor-pointer"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 rounded-full border-2 border-white"></div>
            </div>
          )}
          
          <button
            onClick={onLogout}
            className="btn-secondary text-sm px-4 py-2"
          >
            <span className="hidden sm:inline">Logout</span>
            <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default StickyGlassHeader;
