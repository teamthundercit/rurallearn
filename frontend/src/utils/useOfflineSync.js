import { useState, useEffect, useCallback } from 'react';
import { getUnsyncedProgress, markProgressAsSynced, deleteSyncedProgress } from './indexedDB';
import { recordLessonCompletion, submitQuiz } from '../services/api';

export const useOfflineSync = (token) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [unsyncedCount, setUnsyncedCount] = useState(0);

  // Update online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check for unsynced data
  const checkUnsyncedData = useCallback(async () => {
    try {
      const unsyncedData = await getUnsyncedProgress();
      setUnsyncedCount(unsyncedData.length);
      return unsyncedData;
    } catch (error) {
      console.error('Error checking unsynced data:', error);
      return [];
    }
  }, []);

  // Sync queued data when online
  const syncData = useCallback(async () => {
    if (!isOnline || !token || isSyncing) {
      return;
    }

    setIsSyncing(true);

    try {
      const unsyncedData = await getUnsyncedProgress();
      
      if (unsyncedData.length === 0) {
        setIsSyncing(false);
        return;
      }

      for (const item of unsyncedData) {
        try {
          if (item.type === 'lessonCompletion') {
            await recordLessonCompletion(token, item.lessonId, item.timeSpent);
            await markProgressAsSynced(item.id);
          } else if (item.type === 'quizSubmission') {
            await submitQuiz(token, item.lessonId, item.answers);
            await markProgressAsSynced(item.id);
          }
        } catch (error) {
          console.error('Error syncing item:', item, error);
          // Continue with next item even if one fails
        }
      }

      // Clean up synced data
      await deleteSyncedProgress();
      
      // Update unsynced count
      await checkUnsyncedData();
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, token, isSyncing, checkUnsyncedData]);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && token) {
      syncData();
    }
  }, [isOnline, token, syncData]);

  // Check unsynced data on mount
  useEffect(() => {
    checkUnsyncedData();
  }, [checkUnsyncedData]);

  return {
    isOnline,
    isSyncing,
    unsyncedCount,
    syncData,
    checkUnsyncedData
  };
};
