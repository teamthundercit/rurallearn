import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useApi from '../utils/useApi';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const api = useApi();
  const [saving, setSaving] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' }
  ];

  const changeLanguage = async (lng) => {
    try {
      setSaving(true);
      
      // Change language in i18n
      await i18n.changeLanguage(lng);
      
      // Save to user preferences (if authenticated)
      try {
        await api.post('/api/users/me/preferences', {
          language: lng
        });
      } catch (error) {
        console.warn('Could not save language preference:', error);
        // Continue anyway - language is still changed locally
      }
      
      // Store in localStorage as backup
      localStorage.setItem('i18nextLng', lng);
      
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setSaving(false);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="language-switcher relative">
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        disabled={saving}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Select language"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.nativeName}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {saving && (
        <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
