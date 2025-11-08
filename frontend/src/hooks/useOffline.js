import { useState, useEffect, useCallback } from 'react';
import {
  initDB,
  getPendingSyncItems,
  clearSyncedItems,
  saveLessonsOffline,
  getLessonsOffline
} from '../utils/offlineStorage';
import axios from 'axios';

/**
 * Custom hook for managing offline functionality
 */
export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize IndexedDB
  useEffect(() => {
    initDB()
      .then(() => {
        setIsInitialized(true);
        updateUnsyncedCount();
      })
      .catch(error => {
        console.error('Failed to initialize offline storage:', error);
      });
  }, []);

  // Update unsynced count
  const updateUnsyncedCount = useCallback(async () => {
    try {
      const pendingItems = await getPendingSyncItems();
      setUnsyncedCount(pendingItems.length);
    } catch (error) {
      console.error('Error updating unsynced count:', error);
    }
  }, []);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log('Back online');
      setIsOnline(true);
      syncPendingData();
    };

    const handleOffline = () => {
      console.log('Gone offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync pending data when back online
  const syncPendingData = useCallback(async () => {
    if (!isOnline || isSyncing) return;

    try {
      setIsSyncing(true);
      const pendingItems = await getPendingSyncItems();

      if (pendingItems.length === 0) {
        setIsSyncing(false);
        return;
      }

      console.log(`Syncing ${pendingItems.length} pending items...`);

      const syncedIds = [];

      for (const item of pendingItems) {
        try {
          if (item.type === 'progress') {
            await axios.post('/api/progress', item.data);
            syncedIds.push(item.id);
          }
          // Add more sync types as needed
        } catch (error) {
          console.error('Error syncing item:', error);
          // Continue with other items
        }
      }

      // Clear successfully synced items
      if (syncedIds.length > 0) {
        await clearSyncedItems(syncedIds);
        await updateUnsyncedCount();
      }

      console.log(`Successfully synced ${syncedIds.length} items`);
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing]);

  // Cache lessons for offline use
  const cacheLessons = useCallback(async (lessons) => {
    try {
      await saveLessonsOffline(lessons);
      console.log('Lessons cached for offline use');
    } catch (error) {
      console.error('Error caching lessons:', error);
    }
  }, []);

  // Get lessons (online or offline)
  const getLessons = useCallback(async (filters = {}) => {
    if (isOnline) {
      try {
        const response = await axios.get('/api/lessons', { params: filters });
        // Cache for offline use
        await cacheLessons(response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching lessons online, falling back to offline:', error);
        // Fall back to offline
        return await getLessonsOffline(filters);
      }
    } else {
      // Offline mode
      return await getLessonsOffline(filters);
    }
  }, [isOnline, cacheLessons]);

  return {
    isOnline,
    isSyncing,
    unsyncedCount,
    isInitialized,
    syncPendingData,
    cacheLessons,
    getLessons,
    updateUnsyncedCount
  };
};

export default useOffline;
