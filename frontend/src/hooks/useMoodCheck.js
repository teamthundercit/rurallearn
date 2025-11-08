import { useState, useEffect } from 'react';

const MOOD_CHECK_KEY = 'moodCheckPreferences';
const LAST_CHECK_KEY = 'lastMoodCheck';

export const useMoodCheck = () => {
  const [preferences, setPreferences] = useState({
    enabled: true,
    frequency: 'daily', // daily, always, never
    lastCheck: null
  });

  useEffect(() => {
    // Load preferences from localStorage
    const saved = localStorage.getItem(MOOD_CHECK_KEY);
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  const savePreferences = (newPrefs) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    localStorage.setItem(MOOD_CHECK_KEY, JSON.stringify(updated));
  };

  const shouldShowMoodCheck = () => {
    if (!preferences.enabled || preferences.frequency === 'never') {
      return false;
    }

    if (preferences.frequency === 'always') {
      return true;
    }

    // For 'daily' frequency
    const lastCheck = localStorage.getItem(LAST_CHECK_KEY);
    if (!lastCheck) {
      return true;
    }

    const lastCheckDate = new Date(lastCheck);
    const today = new Date();
    
    // Check if it's a new day
    return lastCheckDate.toDateString() !== today.toDateString();
  };

  const recordMoodCheck = () => {
    localStorage.setItem(LAST_CHECK_KEY, new Date().toISOString());
  };

  const toggleMoodCheck = () => {
    savePreferences({ enabled: !preferences.enabled });
  };

  const setFrequency = (frequency) => {
    savePreferences({ frequency });
  };

  return {
    preferences,
    shouldShowMoodCheck,
    recordMoodCheck,
    toggleMoodCheck,
    setFrequency,
    savePreferences
  };
};

export default useMoodCheck;
